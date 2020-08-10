export interface QuestionaryFormMapping {
  get(fieldName: string, context: { [key: string]: any });
}
