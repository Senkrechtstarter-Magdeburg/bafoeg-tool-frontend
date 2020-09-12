import {BaseQuestion} from "./baseQuestion";
import {QuestionOptions} from "./questionOptions";

export interface AutocompleteOption {
  title: string | { [lan: string]: string };
  value: any;
}

export class AutocompleteQuestion extends BaseQuestion {
  public readonly type: "autocomplete" = "autocomplete";

  public options: AutocompleteOption[];
  public valueWeight: number;
  public titleWeight: number;
  public startsWithWeight: number;


  constructor(config: QuestionOptions & {
    options: AutocompleteOption[],
    valueWeight?: number,
    titleWeight?: number,
    startsWithWeight?: number
  }) {
    super(config);

    this.options = config.options;
    this.valueWeight = config.valueWeight ?? .15;
    this.titleWeight = config.titleWeight ?? .65;
    this.startsWithWeight = config.startsWithWeight ?? .2;
  }
}
