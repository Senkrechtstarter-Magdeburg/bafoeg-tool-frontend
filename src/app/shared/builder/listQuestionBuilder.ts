import {ListQuestion} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionContextFactory} from "@shared";
import {BasicQuestionEntryBuilder} from "@shared/builder/basicQuestionEntryBuilder";

export class ListQuestionBuilder<TAliases extends string> extends QuestionBuilder<ListQuestion, TAliases> {

  private readonly _entries: BasicQuestionEntryBuilder<TAliases>;
  private elementCaption: string;
  private addCaption: string;


  constructor(id: string,
              namespace: string,
              formBuilder: { [alias: string]: FormBuilder<TAliases> },
              protected questionContextFactory: QuestionContextFactory) {
    super(id, namespace, formBuilder, questionContextFactory);
    this._entries = new BasicQuestionEntryBuilder(``, formBuilder, {
      translationPrefix: `${this.fqn}.listEntries`,
      listId: this.fqn
    });
  }

  public entries(callback: (builder: BasicQuestionEntryBuilder<TAliases>) => void): this {
    callback(this._entries);
    return this;
  }

  public showElementCaption(elementCaption: string = `${this.translationPrefix}.${this.id}.elementCaption`): this {
    this.elementCaption = elementCaption;
    return this;
  }

  public insteadOfAddMoreShow(addCaption: string): this {
    this.addCaption = addCaption;
    return this;
  }

  public build(): ListQuestion {
    return new ListQuestion({
      ...this.buildBaseOptions(),
      itemQuestions: this._entries.entries,
      addCaption: this.addCaption,
      itemCaption: this.elementCaption
    });
  }
}


