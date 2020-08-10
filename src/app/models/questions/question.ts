import {DocumentRequest} from "./documentRequest";
import {DisplayType} from "@models/questions/displayType";

export interface Question {
  id: string;
  text: string;
  readonly type: string;
  hint: string;
  documentRequests: DocumentRequest[];
  placeholder: string;
  displayType: DisplayType;
}

