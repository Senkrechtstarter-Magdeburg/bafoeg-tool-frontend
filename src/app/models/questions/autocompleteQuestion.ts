import {BaseQuestion} from "./baseQuestion";
import {QuestionOptions} from "./questionOptions";

export interface TranslatableAutocompleteOption {
  title: { translateKey: string };
  value: any;
}

export interface TranslatedAutocompleteOption {
  title: string;
  value: any;
}

export type AutocompleteOption = TranslatedAutocompleteOption | TranslatableAutocompleteOption;

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
