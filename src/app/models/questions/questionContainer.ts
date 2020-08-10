import {QuestionEntry} from "@models/questions/questionEntry";


export interface QuestionContainer {
  id: string;
  title: string;
  description: string;
  questionEntries: QuestionEntry[];
  namespace: string;
  nextText: string;
  previousText: string;
  /**
   * expression, to decide whether or not the question container should be shown
   * @param context Current context of already answered questions.
   * Having the questionId as key and it's answer as value. If unanswered, the value is null
   */
  isHidden?: (context: { [key: string]: any }) => boolean;

}

