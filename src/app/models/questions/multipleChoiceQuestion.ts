import {Choice} from "./choice";
import {QuestionOptions} from "./questionOptions";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class MultipleChoiceQuestion<T = string> extends BaseQuestion {
  public type: "multipleChoice" = "multipleChoice";
  public choices: Choice<T>[];

  public constructor(config: QuestionOptions & {
    choices: Choice<T>[]
  }) {
    super(config);

    this.choices = config.choices;
  }
}
