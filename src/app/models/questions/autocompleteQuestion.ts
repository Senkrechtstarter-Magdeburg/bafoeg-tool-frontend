import {BaseQuestion} from "./baseQuestion";
import {QuestionOptions} from "./questionOptions";

export interface AutocompleteOption {
  title: string;
  value: any;
}

export class AutocompleteQuestion extends BaseQuestion {
  public readonly type: "autocomplete" = "autocomplete";

  public options: AutocompleteOption[];


  constructor(config: QuestionOptions & {
    options: AutocompleteOption[]
  }) {
    super(config);

    this.options = config.options;
  }
}
