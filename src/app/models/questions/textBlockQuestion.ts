import {QuestionOptions} from "./questionOptions";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class TextBlockQuestion extends BaseQuestion {

  public readonly type: "textBlock" = "textBlock";

  constructor(config: QuestionOptions) {
    super(config);
  }
}
