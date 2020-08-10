import {QuestionOptions} from "./questionOptions";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class TextQuestion extends BaseQuestion {
  public readonly type: "text" = "text";

  public constructor(config: QuestionOptions) {
    super(config);

  }
}
