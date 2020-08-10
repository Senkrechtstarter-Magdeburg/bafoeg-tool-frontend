import {QuestionContext} from "@shared/builder/questionContext";

export abstract class QuestionContextFactory {
  public abstract create(namespace: string, id: string): <Z>(ctx: Z) => QuestionContext;
}
