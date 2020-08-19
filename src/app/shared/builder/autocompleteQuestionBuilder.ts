import {QuestionBuilder} from "./questionBuilder";
import {AutocompleteOption, AutocompleteQuestion} from "../../models/questions/autocompleteQuestion";

export class AutocompleteQuestionBuilder extends QuestionBuilder<AutocompleteQuestion> {
  private options: AutocompleteOption[] = [];

  public build(): AutocompleteQuestion {
    return new AutocompleteQuestion({
      ...super.buildBaseOptions(),
      options: this.options
    });
  }

  public option(...option: AutocompleteOption[]): this {
    this.options.push(...option);

    return this;
  }

}
