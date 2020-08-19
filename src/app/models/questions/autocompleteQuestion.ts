import {BaseQuestion} from "./baseQuestion";
import {QuestionOptions} from "./questionOptions";

export class AutocompleteQuestion extends BaseQuestion {
  public readonly type: "autocomplete" = "autocomplete";

  public options: { title: string, value: any }[];


  constructor(config: QuestionOptions & {
    options: { title: string, value: any }[]
  }) {
    super(config);

    this.options = config.options;
  }
}
