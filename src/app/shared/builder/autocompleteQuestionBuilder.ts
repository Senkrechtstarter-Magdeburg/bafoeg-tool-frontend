import {QuestionBuilder} from "./questionBuilder";
import {AutocompleteQuestion} from "../../models/questions/autocompleteQuestion";

export class AutocompleteQuestionBuilder extends QuestionBuilder<AutocompleteQuestion> {
  public build(): AutocompleteQuestion {
    return new AutocompleteQuestion({
      ...super.buildBaseOptions(),
      options: []
    });
  }

  public addOptionsFromFile(path: string) {

  }

}
