import {FormBuilder} from "@shared/builder/formBuilder";
import {BuilderCallBack} from "@shared/builder/builderCallBack";
import {ListQuestion} from "@models";
import {ListQuestionBuilder} from "@shared/builder/listQuestionBuilder";
import {BasicQuestionEntryBuilder} from "@shared/builder/basicQuestionEntryBuilder";

export class QuestionEntryBuilder<TAliases extends string> extends BasicQuestionEntryBuilder<TAliases> {

  constructor(namespace: string,
              formBuilder: { [alias: string]: FormBuilder<TAliases> },
              translationPrefix: string | null = null) {
    super(namespace, formBuilder, {translationPrefix});
  }

  public askForList(id: string, callback?: BuilderCallBack<ListQuestion, TAliases, ListQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, ListQuestionBuilder, callback);
  }
}
