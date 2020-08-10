import {QuestionContextFactory} from "@shared/builder/questionContextFactory";
import {QuestionContextInternal} from "@shared/builder/questionContextInternal";
import {QuestionContext} from "@shared/builder/questionContext";

export class DefaultQuestionContextFactory extends QuestionContextFactory {
  public create(namespace: string, id: string): <Z>(ctx: Z) => QuestionContext {
    return ctx => new QuestionContextInternal(ctx, namespace);
  }
}
