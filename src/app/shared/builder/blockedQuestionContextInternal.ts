import {QuestionContextInternal} from "@shared/builder/questionContextInternal";

export class BlockedQuestionContextInternal extends QuestionContextInternal {

  protected extractNamespaceAndId(id: string, namespace?: string): { id: string; namespace: string } {
    const idSplit = id.split(".");
    const namespaceParts = [...(namespace ? namespace.split(".") : []), ...idSplit.slice(0, -1)];

    id = idSplit[idSplit.length - 1];

    if (namespaceParts.length) {
      const defaultNameSpaceParts = this.defaultNamespace.split(".");

      // slice one namespace part more for lookup
      namespace =
        defaultNameSpaceParts.slice(0, defaultNameSpaceParts.length - namespaceParts.length - 1).concat(namespaceParts).join(".");
    } else {
      namespace = this.defaultNamespace;
    }
    return {id, namespace};
  }
}
