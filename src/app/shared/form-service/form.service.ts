import {Questionary} from "@models";
import {Dict} from "@shared";
import {Observable} from "rxjs";

export type WithProgress<T> = { progress: number } & T;
export type FilledForms = { forms: { formName: string, buffer: Uint8Array }[] };

export abstract class FormService {

  constructor() {
  }

  /**
   * Gets the pdf form corresponding to the questionary and fills it with the data.
   * @param questionary Questionary to be converted to pdf(s)
   * @param data User filled data for the questionary
   */
  public abstract fill(questionary: Questionary, data: Dict): Observable<WithProgress<FilledForms>>;
}


