import {Dict} from "@shared";

export interface FormMapping {
  formName: string;

  getMappings(context: any): Dict

  getFormField(formFieldName: string, context: any): string | null;
}
