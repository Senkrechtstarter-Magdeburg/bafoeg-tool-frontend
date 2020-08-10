import {QuestionContextFactory} from "@shared/builder/questionContextFactory";
import {BlockedQuestionContextInternal} from "@shared/builder/blockedQuestionContextInternal";
import {QuestionContext} from "@shared/builder/questionContext";

export class BlockedQuestionContextFactory extends QuestionContextFactory {
  public create(namespace: string, id: string): <Z>(ctx: Z) => QuestionContext {
    return ctx => new BlockedQuestionContextInternal(ctx, namespace);
  }
}
