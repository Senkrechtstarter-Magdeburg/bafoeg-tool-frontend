export interface DocumentRequest {
  id: string;
  name: string;
  description: string;
  required: ((context: any) => boolean) | boolean
}
