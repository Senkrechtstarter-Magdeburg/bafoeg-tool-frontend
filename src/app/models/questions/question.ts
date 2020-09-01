import {DisplayType} from "@models/questions/displayType";

export interface Question {
  id: string;
  text: string;
  readonly type: string;
  hint: string;
  placeholder: string;
  displayType: DisplayType;
}

