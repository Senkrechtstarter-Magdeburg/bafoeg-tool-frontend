import {TextQuestion} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";

export class TextQuestionBuilder<TAliases extends string> extends QuestionBuilder<TextQuestion, TAliases> {
  public build(): TextQuestion {
    return new TextQuestion(this.buildBaseOptions());
  }
}


