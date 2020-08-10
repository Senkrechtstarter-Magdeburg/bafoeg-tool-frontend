import {Choice, DisplayType, MultipleChoiceQuestion} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {QuestionContext} from "@shared/builder/questionContext";
import {QuestionContextFactory} from "@shared/builder/questionContextFactory";
import {FormBuilder} from "@shared/builder/formBuilder";

export class MultipleChoiceQuestionBuilder<T = any> extends QuestionBuilder<MultipleChoiceQuestion<T>> {

  private choices: Choice<T>[] = [];


  constructor(id: string, namespace: string, formBuilder: FormBuilder, questionContextFactory: QuestionContextFactory) {
    super(id, namespace, formBuilder, questionContextFactory);

    this.displayType = DisplayType.Dropdown;
  }

  public option(text: string, value: T, config: {
    hideIf?: (context: QuestionContext) => boolean,
    icon?: string
  } = {}): MultipleChoiceQuestionBuilder {
    this.choices.push({
      text: `${this.fqn}.choices.${text}`,
      value,
      hideIf: config.hideIf && this.contextCallback(config.hideIf),
      icon: config.icon
    });
    return this;
  }

  public build(): MultipleChoiceQuestion<T> {
    return new MultipleChoiceQuestion({
      ...this.buildBaseOptions(),
      choices: this.choices
    });
  }

}
