import {QuestionContext} from "./questionContext";
import {range} from "@shared/util";

export class QuestionContextInternal implements QuestionContext {
  constructor(public raw: any, protected defaultNamespace: string) {

  }

  public get<T = any>(id: string, namespace?: string): T | null {
    const {id: i, namespaces} = this.extractPossibleNamespacesAndId(id, namespace);
    if (this.raw) {
      for (const ns of namespaces) {
        if (this.raw.hasOwnProperty(`${ns}.${i}`)) {
          return this.raw[`${ns}.${i}`];
        }
      }
    }

    return null;

  }

  public is(id: string, ...values: any[]): boolean {
    const val = this.get(id);
    return values.some(v => v === val);
  }

  public is_n(id: string, namespace: string | undefined, ...values: any[]): boolean {
    return this.is(`${namespace}.${id}`);
  }

  public extractPossibleNamespacesAndId(id: string, namespace?: string): { id: string, namespaces: string[] } {
    const idSplit = id.split(".");
    const namespaceParts = [...(namespace ? namespace.split(".") : []), ...idSplit.slice(0, -1)];

    id = idSplit[idSplit.length - 1];

    const defaultNameSpaces = this.defaultNamespace.split(".");
    let namespaces: string[] = range(defaultNameSpaces.length + 1).reverse().map(i => defaultNameSpaces.slice(0, i).join("."));
    if (namespaceParts.length) {
      namespace = namespaceParts.join(".");
      namespaces = namespaces.map(part => part + (part.length ? "." : "") + namespace);
    }
    return {id, namespaces};
  }
}

