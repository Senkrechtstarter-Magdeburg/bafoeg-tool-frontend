import {Injectable, OnDestroy} from "@angular/core";
import {forkJoin, from, fromEvent, merge, Observable, Subject, zip} from "rxjs";
import {filter, finalize, first, map, scan, share, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Questionary} from "@models";
import {Dict} from "../dict";
import {PDF_FORMS} from "@questions/pdfForms";
import {FromEventTarget} from "rxjs/internal/observable/fromEvent";
import {FillPdfRequest, isFillPdfResponse, isWorkerError, isWorkerMessage} from "./worker-messages";
import {FilledForms, FormService, WithProgress} from "./form.service";
import {v4 as uuid} from "uuid";

@Injectable()
export class WasmFormService implements FormService, OnDestroy {

  private wasm = from(import("@senkrechtstarter-magdeburg/pdfformfill")).pipe(shareReplay(1));
  private worker: Worker;
  private eventStream: Observable<MessageEvent>;

  constructor(private http: HttpClient) {
  }

  public fill(questionary: Questionary, data: Dict): Observable<WithProgress<FilledForms>> {

    const results$ = Object.entries(questionary.formMappings)
      .map(([, formMapping]) => {
        const url = PDF_FORMS[formMapping.formName];


        const fields = Object.entries(formMapping.getMappings(data))
          .reduce((prev, [k, v]) => ({...prev, [k]: (v === null || v === undefined ? "" : v.toString())}), {});

        if (typeof Worker !== "undefined") {
          if (!this.worker) {
            // Create a new
            this.worker = new Worker("./wasm.worker", {type: "module"});

            this.eventStream = merge(
              fromEvent(this.worker as FromEventTarget<MessageEvent>, "message"),
              fromEvent(this.worker as FromEventTarget<MessageEvent>, "error"),
              fromEvent(this.worker as FromEventTarget<MessageEvent>, "messageerror"),
            );
          }

          const messageId = uuid();

          return this.http.get(url, {responseType: "arraybuffer"}).pipe(
            switchMap((buf) => {
              const res = this.eventStream.pipe(
                filter(({data: x}) => isFillPdfResponse(x) && x.answers === messageId),
                first(),
                map(workerEvent => {
                  if (isWorkerMessage(workerEvent.data)) {
                    const response = workerEvent.data;

                    if (isFillPdfResponse(response)) {

                      return {
                        formName: formMapping.formName,
                        buffer: response.pdfBuffer,
                      };
                    }

                    if (isWorkerError(response)) {
                      throw response.err;
                    }
                  }
                  throw new Error("Webworker did not respond valid response");
                })
              );

              this.worker.postMessage(new FillPdfRequest(new Uint8Array(buf), fields, messageId));

              return res;
            }),
            share(),
          );

        } else {
          console.warn("Browser does not support webworkers");
          // Web Workers are not supported in this environment.
          return zip(
            this.http.get(url, {responseType: "arraybuffer"}),
            this.wasm
          ).pipe(
            map(([buf, wasm]) => {
              const form = wasm.load_form(new Uint8Array(buf));
              form.fill(fields);
              return {
                formName: formMapping.formName,
                buffer: form.save_to_buf(),
              };
            })
          );
        }
      });

    let finished = 0;
    const progress$ = new Subject<number>();
    const result$ = forkJoin(results$.map(obs$ => obs$.pipe(
      finalize(() => {
        progress$.next(++finished * 100 / results$.length);
        if (finished === results$.length) {
          progress$.complete();
        }
      })
    )));

    return merge(
      progress$.pipe(map(progress => ({progress}))),
      result$.pipe(map(forms => ({forms})))
    ).pipe(
      scan((prev, cur) => ({...prev, ...cur}), {progress: 0, forms: null}),
      shareReplay(1)
    );
  }

  public ngOnDestroy(): void {
    this.worker?.terminate();
  }

}
