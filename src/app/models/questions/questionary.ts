import {QuestionContainer} from "./questionContainer";
import {FormMapping} from "@models/forms";
import {DocumentRequest} from "@models/questions/documentRequest";

export interface Questionary {
  id: string;
  title: string;
  questionContainers: QuestionContainer[];
  formMappings?: { [formName: string]: FormMapping };
  documents: DocumentRequest[]
}
