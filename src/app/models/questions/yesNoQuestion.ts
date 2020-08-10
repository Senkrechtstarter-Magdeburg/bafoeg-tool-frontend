import {QuestionOptions} from "./questionOptions";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class YesNoQuestion extends BaseQuestion {
  public readonly type: "yesno" = "yesno";
  public yesText: string;
  public noText: string;

  constructor(config: QuestionOptions & { yesText?: string, noText?: string }) {
    super(config);

    this.yesText = config.yesText;
    this.noText = config.noText;
  }
}
