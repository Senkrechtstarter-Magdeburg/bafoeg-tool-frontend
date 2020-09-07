import {TextBlockQuestion} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionContextFactory} from "@shared/builder/questionContextFactory";

export class TextBlockQuestionBuilder<TAliases extends string> extends QuestionBuilder<TextBlockQuestion, TAliases> {


  constructor(id: string,
              namespace: string,
              formBuilder: { [alias: string]: FormBuilder },
              protected questionContextFactory: QuestionContextFactory) {
    super(id, namespace, formBuilder, questionContextFactory);

    this.hidePlaceholder();
    this.optional();
  }

  public build(): TextBlockQuestion {
    return new TextBlockQuestion(this.buildBaseOptions());
  }
}
