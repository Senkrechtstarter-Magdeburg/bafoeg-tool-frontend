import {Dict} from "../dict";

export interface WorkerMessage {
  type: string;
}

export class WorkerResponse {
  public type: "genericresponse";

  /**
   * Wrapped message from the worker
   */
  public message: WorkerMessage;

  constructor(message: WorkerMessage) {
    this.message = message;
  }
}

export class FillPdfRequest implements WorkerMessage {
  public type: "fillPdfRequest" = "fillPdfRequest";
  /**
   * Buffer holding the pdf to fill
   */
  public readonly pdfBuffer: Uint8Array;

  /**
   * Object containing the filled pdf fields. Pdf field form name as key, its value as value.
   */
  public readonly fields: Dict;


  constructor(pdfBuffer: Uint8Array, fields: Dict) {
    this.pdfBuffer = pdfBuffer;
    this.fields = fields;
  }
}


export class FillPdfResponse implements WorkerMessage {
  public type: "fillPdfResponse" = "fillPdfResponse";

  /**
   * Buffer holding the filled pdf document
   */
  public readonly pdfBuffer: Uint8Array;


  constructor(pdfBuffer: Uint8Array) {
    this.pdfBuffer = pdfBuffer;
  }
}

export class WorkerError implements WorkerMessage {
  public type: "error" = "error";

  public readonly err: any;

  constructor(err: any) {
    this.err = err;
  }
}


export function isWorkerMessage(x: any): x is WorkerMessage {
  return x && x.hasOwnProperty("type") && typeof x.type === "string";
}

export function isFillPdfRequest(x: any): x is FillPdfRequest {
  return isWorkerMessage(x) && x.type === "fillPdfRequest";
}

export function isFillPdfResponse(x: any): x is FillPdfResponse {
  return isWorkerMessage(x) && x.type === "fillPdfResponse";
}

export function isWorkerError(x: any): x is WorkerError {
  return isWorkerMessage(x) && x.type === "error";
}

export function isWorkerResponse(x: any): x is WorkerResponse {
  return isWorkerMessage(x) && x.type === "genericresponse";
}
