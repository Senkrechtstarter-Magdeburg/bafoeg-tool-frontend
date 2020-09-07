export interface QuestionContext {
  raw: any;

  get<T = any>(id: string, namespace?: string): T;

  is(id: string, ...values: any[]): boolean;

  is_n(id: string, namespace: string, ...values: any[]): boolean;
}

