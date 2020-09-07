import {
  CalendarQuestion,
  ListQuestion,
  MultipleChoiceQuestion,
  QuestionEntry,
  Questions,
  TextBlockQuestion,
  TextQuestion,
  YesNoQuestion
} from "@models/questions";
import {FormBuilder} from "@shared/builder/formBuilder";
import {Block} from "@shared/builder/questionaryBuilder";
import {TextQuestionBuilder} from "@shared/builder/textQuestionBuilder";
import {TextBlockQuestionBuilder} from "@shared/builder/textBlockQuestionBuilder";
import {YesNoQuestionBuilder} from "@shared/builder/yesNoQuestionBuilder";
import {ListQuestionBuilder} from "@shared/builder/listQuestionBuilder";
import {MultipleChoiceQuestionBuilder} from "@shared/builder/multipleChoiceQuestionBuilder";
import {CalendarQuestionBuilder} from "@shared/builder/calendarQuestionBuilder";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {BlockedQuestionContainerBuilder, QuestionContainerBuilder} from "@shared/builder/questionContainerBuilder";
import {BuilderCallBack} from "@shared/builder/builderCallBack";
import {QuestionBuilderType} from "@shared/builder/questionBuilderType";
import {DefaultQuestionContextFactory} from "@shared/builder/defaultQuestionContextFactory";

export class QuestionEntryBuilder<TAliases extends string> {
  private questionEntries: QuestionEntry[] = [];

  constructor(protected id: string,
              protected namespace: string = id,
              protected formBuilder: { [alias: string]: FormBuilder }) {
  }

  public get entries(): QuestionEntry[] {
    return this.questionEntries;
  }

  public requireAll() {

  }

  public block<S>(id: string, block: Block<QuestionContainerBuilder<TAliases>, S>, args: S): this {
    const {blockId, callback} = block;

    const namespace = `${this.namespace}.${id}`;

    const builder = new BlockedQuestionContainerBuilder(this.id, namespace, this.formBuilder, blockId);

    callback(builder, args);

    this.questionEntries = [...this.questionEntries, ...builder.build().questionEntries];

    return this;
  }

  public askText(id: string, callback?: BuilderCallBack<TextQuestion, TAliases, TextQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, TextQuestionBuilder, callback);
  }

  public printInfo(id: string, callback?: BuilderCallBack<TextBlockQuestion, TAliases, TextBlockQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, TextBlockQuestionBuilder, callback);
  }

  public askYesNoQuestion(id: string, callback?: BuilderCallBack<YesNoQuestion, TAliases, YesNoQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, YesNoQuestionBuilder, callback);
  }

  public askForList(id: string, callback?: BuilderCallBack<ListQuestion, TAliases, ListQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, ListQuestionBuilder, callback);
  }

  public askMultipleChoiceQuestion(
    id: string,
    callback?: BuilderCallBack<MultipleChoiceQuestion, TAliases, MultipleChoiceQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, MultipleChoiceQuestionBuilder, callback);
  }

  public askForDate(id: string, callback?: BuilderCallBack<CalendarQuestion, TAliases, CalendarQuestionBuilder<TAliases>>): this {
    return this.askWithBuilder(id, CalendarQuestionBuilder, callback);
  }

  protected askWithBuilder<Q extends Questions, B extends QuestionBuilder<Q, TAliases>>(
    id: string,
    builderConstructor: QuestionBuilderType<Q, TAliases>,
    callback?: BuilderCallBack<Q, TAliases, B>): this {
    return this.ask(new builderConstructor(id, this.namespace, this.formBuilder, new DefaultQuestionContextFactory()), callback);
  }

  protected ask<Q extends Questions>(builder: QuestionBuilder<Q, TAliases>,
                                     callback?: BuilderCallBack<Q, TAliases, QuestionBuilder<Q, TAliases>>): this {
    const entry = (callback ? callback(builder) : builder).buildEntry();
    this.questionEntries.push(entry);
    return this;
  }
}
