import {Injectable, OnDestroy} from "@angular/core";
import {from, fromEvent, merge, Observable, zip} from "rxjs";
import {first, map, share, shareReplay, switchMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Questionary} from "@models";
import {Dict} from "../dict";
import {PDF_FORMS} from "../../questions/pdfForms";
import {FromEventTarget} from "rxjs/internal/observable/fromEvent";
import {FillPdfRequest, isFillPdfResponse, isWorkerError, isWorkerMessage} from "./worker-messages";
import {FormService} from "./form.service";

@Injectable()
export class WasmFormService implements FormService, OnDestroy {

  private wasm = from(import("@senkrechtstarter-magdeburg/pdfformfill")).pipe(shareReplay(1));
  private worker: Worker;
  private eventStream: Observable<MessageEvent>;

  constructor(private http: HttpClient) {
  }

  public fill(questionary: Questionary, data: Dict): Observable<Uint8Array> {
    const url = PDF_FORMS[questionary.formMapping.formName];


    const fields = Object.entries(questionary.formMapping.getMappings(data))
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

      return this.http.get(url, {responseType: "arraybuffer"}).pipe(
        switchMap((buf) => {
          const res = this.eventStream.pipe(
            first(),
            map(workerEvent => {
              if (isWorkerMessage(workerEvent.data)) {
                const response = workerEvent.data;

                if (isFillPdfResponse(response)) {
                  return response.pdfBuffer;
                }

                if (isWorkerError(response)) {
                  throw response.err;
                }
              }
              throw new Error("Webworker did not respond valid response");
            })
          );

          this.worker.postMessage(new FillPdfRequest(new Uint8Array(buf), fields));

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
          return form.save_to_buf();
        })
      );
    }
  }

  public ngOnDestroy(): void {
    this.worker?.terminate();
  }

}
