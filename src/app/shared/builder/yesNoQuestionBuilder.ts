import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {YesNoQuestion} from "@models/questions";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionContextFactory} from "@shared/builder/questionContextFactory";

export class YesNoQuestionBuilder extends QuestionBuilder<YesNoQuestion> {
  private yesText = "answers.yes";
  private noText = "answers.no";


  constructor(id: string, namespace: string, formBuilder: FormBuilder, protected questionContextFactory: QuestionContextFactory) {
    super(id, namespace, formBuilder, questionContextFactory);

    this.placeholder = null;
  }

  public insteadOfYesSay(yesText: string): this {
    this.yesText = `${this.namespace}.${yesText}`;
    return this;
  }

  public insteadOfNoSay(noText: string): this {
    this.noText = `${this.namespace}.${noText}`;
    return this;
  }

  public build(): YesNoQuestion {
    return new YesNoQuestion({
      ...this.buildBaseOptions(),
      yesText: this.yesText,
      noText: this.noText
    });
  }
}
