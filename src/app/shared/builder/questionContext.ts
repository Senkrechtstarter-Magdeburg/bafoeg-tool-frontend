export interface QuestionContext {
  raw: any;

  get(id: string, namespace?: string);

  is(id: string, ...values: any[]): boolean;

  is_n(id: string, namespace: string, ...values: any[]): boolean;
}

