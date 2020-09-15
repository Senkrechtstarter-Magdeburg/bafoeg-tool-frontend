import {Question} from "@models/questions/question";
import {Questions} from "@models/questions/questions";

export type AnswerCondition<V = any, R = any, Q extends Question = Question> = (value: V,
                                                                                context: { [key: string]: any } | null,
                                                                                question: Question) => { [errorKey: string]: R };

export interface QuestionEntry<T extends Question = Questions> {
  question: T;

  /**
   * expression, that fills in a default value, if the field is untouched
   */
  defaultValue?: (context: any) => any;
  /**
   * expression, to decide whether or not the question should be shown
   * @param context Current context of already answered questions.
   * Having the questionId as key and it's answer as value. If unanswered, the value is null
   */
  isHidden?: (context: { [key: string]: any }) => boolean;

  /**
   * expressions, verifying the answer of the question
   * @value current answer to be verified
   * @param context Current context of already answered questions.
   * Having the questionId as key and it's answer as value. If unanswered, the value is null
   */
  conditions?: (AnswerCondition)[];
}

export interface LoadedQuestionEntry<Q extends Question = Questions> extends QuestionEntry<Q> {
  getValue(context: any): any;
}

export function isLoadedQuestionEntry<Q extends Question>(questionEntry: QuestionEntry<Q>): questionEntry is LoadedQuestionEntry<Q> {
  return questionEntry && questionEntry.hasOwnProperty("getValue") && typeof questionEntry["getValue"] === "function";
}
