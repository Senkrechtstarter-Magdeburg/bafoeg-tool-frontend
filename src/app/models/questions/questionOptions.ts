import {DisplayType} from "@models/questions/displayType";

export interface QuestionOptions {
  id: string,
  text: string,
  hint?: string,
  placeholder?: string;
  displayType: DisplayType
}
