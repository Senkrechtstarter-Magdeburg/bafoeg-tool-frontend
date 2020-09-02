import {Questionary} from "@models";
import {Dict} from "@shared";
import {Observable} from "rxjs";

export abstract class FormService {

  constructor() {
  }

  /**
   * Gets the pdf form corresponding to the questionary and fills it with the data.
   * @param questionary Questionary to be converted to pdf(s)
   * @param data User filled data for the questionary
   */
  public abstract fill(questionary: Questionary, data: Dict): Observable<Uint8Array>;
}


