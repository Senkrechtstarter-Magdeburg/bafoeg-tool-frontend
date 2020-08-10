import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Questionary} from "@models/questions";
import {PDF_FORMS} from "../../../questions/pdfForms";

declare type FieldType =
  { type: "string" }
  | { type: "boolean" }
  | { type: "select", options: string[] }
  | { type: "radio", options: string[] }
  | { type: string };

declare class PdfForm {
  serialize_str(str: string): string;

  serialize(node, uncompressed)

  transform(buffer: ArrayBufferLike | ArrayLike<number>, fields: { [key: string]: string }): Uint8Array

  list_fields(buffer: ArrayBufferLike | ArrayLike<number>): { [key: string]: FieldType[] }
}

declare function pdfform(): PdfForm;


@Injectable({
  providedIn: "root"
})
export class FormService {

  constructor(private http: HttpClient) {
  }

  public fillQuestionary(questionary: Questionary, data: { [key: string]: any }): Observable<Uint8Array> {
    const url = PDF_FORMS[questionary.formMapping.formName];

    return this.http.post("http://localhost:30119/fill/formblatt_1",
      questionary.formMapping.getMappings(data),
      {responseType: "arraybuffer", headers: {"Content-Type": "application/json"}})
      .pipe(
        map(result => new Uint8Array(result))
      );
  }
}
