import {QuestionContainer} from "./questionContainer";
import {FormMapping} from "@models/forms";

export interface Questionary {
  id: string;
  title: string;
  questionContainers: QuestionContainer[];
  formMapping?: FormMapping;
}
