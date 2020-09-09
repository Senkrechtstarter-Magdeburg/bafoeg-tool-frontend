/// <reference lib="webworker" />

import {FillPdfResponse, isFillPdfRequest, isWorkerMessage, WorkerError} from "./worker-messages";
import {from} from "rxjs";
import {shareReplay} from "rxjs/operators";

const wasm$ = from(import("@senkrechtstarter-magdeburg/pdfformfill")).pipe(shareReplay(1));

addEventListener("message", (ev) => wasm$.subscribe(wasm => {

  const {data} = ev;
  if (isFillPdfRequest(data)) {
    try {
      const form = wasm.load_form(data.pdfBuffer);
      form.fill(data.fields);
      const result = form.save_to_buf();

      postMessage(new FillPdfResponse(result, data.messageId));
    } catch (e) {
      console.error(e);
      postMessage(new WorkerError(e, data.messageId));
    }
  } else if (isWorkerMessage(data)) {
    postMessage(new WorkerError(`Unknown message type: "${data.type}"`, data.messageId));
  } else {
    postMessage(new WorkerError(`Unknown message "${data}"`, data.messageId));
  }
}));
