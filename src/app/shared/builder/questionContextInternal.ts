import {QuestionContext} from "./questionContext";

export class QuestionContextInternal implements QuestionContext {
  constructor(public raw: any, protected defaultNamespace: string) {

  }

  public get(id: string, namespace?: string) {
    const {id: i, namespace: ns} = this.extractNamespaceAndId(id, namespace);
    return this.raw && this.raw[`${ns}.${i}`];
  }

  public is(id: string, ...values: any[]): boolean {
    return this.is_n(id, undefined, ...values);
  }

  public is_n(id: string, namespace: string | undefined, ...values: any[]): boolean {
    const val = this.get(id, namespace);
    return values.some(v => v === val);
  }

  protected extractNamespaceAndId(id: string, namespace?: string): { id: string, namespace: string } {
    const idSplit = id.split(".");
    const namespaceParts = [...(namespace ? namespace.split(".") : []), ...idSplit.slice(0, -1)];

    id = idSplit[idSplit.length - 1];

    if (namespaceParts.length) {
      const defaultNameSpaceParts = this.defaultNamespace.split(".");

      namespace = defaultNameSpaceParts.slice(0, defaultNameSpaceParts.length - namespaceParts.length).concat(namespaceParts).join(".");
    } else {
      namespace = this.defaultNamespace;
    }
    return {id, namespace};
  }
}

