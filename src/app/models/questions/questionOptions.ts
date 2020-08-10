import {DocumentRequest} from "./documentRequest";
import {DisplayType} from "@models/questions/displayType";

export interface QuestionOptions {
  id: string,
  text: string,
  hint?: string,
  documents?: DocumentRequest[]
  placeholder?: string;
  displayType: DisplayType
}
