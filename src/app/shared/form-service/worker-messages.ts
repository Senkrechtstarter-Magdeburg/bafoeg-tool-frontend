import {Dict} from "../dict";
import {v4 as uuid} from "uuid";

export interface WorkerMessage {
  type: string;
  messageId: string;
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


  constructor(pdfBuffer: Uint8Array, fields: Dict, public readonly messageId: string = uuid()) {
    this.pdfBuffer = pdfBuffer;
    this.fields = fields;
  }
}

export abstract class WorkerResponseMessage implements WorkerMessage {
  public abstract type: string;

  /**
   * Message id of the request
   */
  public answers: string;

  constructor(answers: string, public readonly messageId: string = uuid()) {
    this.answers = answers;
  }
}

export class FillPdfResponse extends WorkerResponseMessage {
  public type: "fillPdfResponse" = "fillPdfResponse";

  /**
   * Buffer holding the filled pdf document
   */
  public readonly pdfBuffer: Uint8Array;


  constructor(pdfBuffer: Uint8Array, answers: string, messageId: string = uuid()) {
    super(answers, messageId);
    this.pdfBuffer = pdfBuffer;
  }
}

export class WorkerError extends WorkerResponseMessage {
  public type: "error" = "error";

  public readonly err: any;
  public messageId: string;

  constructor(err: any, answers: string, messageId: string = uuid()) {
    super(answers, messageId);
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
