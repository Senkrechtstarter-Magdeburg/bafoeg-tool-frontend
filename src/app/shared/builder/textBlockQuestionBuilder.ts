import {TextBlockQuestion} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionContextFactory} from "@shared/builder/questionContextFactory";

export class TextBlockQuestionBuilder extends QuestionBuilder<TextBlockQuestion> {


  constructor(id: string, namespace: string, formBuilder: FormBuilder, protected questionContextFactory: QuestionContextFactory) {
    super(id, namespace, formBuilder, questionContextFactory);

    this.hidePlaceholder();
    this.optional();
  }

  public build(): TextBlockQuestion {
    return new TextBlockQuestion(this.buildBaseOptions());
  }
}
