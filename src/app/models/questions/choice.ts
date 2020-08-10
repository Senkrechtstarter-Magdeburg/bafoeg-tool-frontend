export interface Choice<T = string> {
  text: string;
  value: T;
  icon?: string;
  hideIf?: (context: any) => boolean
}
