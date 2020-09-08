import {QuestionContainer, Questions} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {QuestionContext} from "@shared/builder/questionContext";
import {QuestionContextInternal} from "@shared/builder/questionContextInternal";
import {FormBuilder} from "@shared/builder/formBuilder";
import {BuilderCallBack} from "@shared/builder/builderCallBack";
import {QuestionBuilderType} from "@shared/builder/questionBuilderType";
import {BlockedQuestionContextFactory} from "@shared/builder/blockedQuestionContextFactory";
import {QuestionEntryBuilder} from "@shared/builder/questionEntryBuilder";


export class QuestionContainerBuilder<TAliases extends string> extends QuestionEntryBuilder<TAliases> {
  protected questionContextCallback: (ctx: any) => QuestionContext;
  protected hiddenCondition: QuestionContainer["isHidden"];
  private description: string;
  private title: string;
  private nextText = "app.next";
  private previousText = "app.previous";

  public constructor(private id: string, namespace: string, formBuilder: { [alias: string]: FormBuilder<TAliases> }) {
    super(namespace, formBuilder);
    this.questionContextCallback = ctx => new QuestionContextInternal(ctx, namespace);

    this.withTitle();
  }

  public withTitle(title?: string): this {
    this.title = `${this.namespace}.${title || "__title"}`;
    return this;
  }

  public withoutTitle(): this {
    this.title = "";
    return this;
  }

  public withDescription(description?: string): this {
    this.description = `${this.namespace}.${description || "__description"}`;
    return this;
  }

  public insteadOfNextSay(nextText: string): this {
    this.nextText = `${this.namespace}.${nextText}`;
    return this;
  }

  public insteadOfPreviousSay(previousText: string): this {
    this.nextText = `${this.namespace}.${previousText}`;
    return this;
  }

  public hideIf(callback: (context: QuestionContext) => boolean): this {
    this.hiddenCondition = this.contextCallback(callback);

    return this;
  }

  public build(): QuestionContainer {
    return {
      id: this.id,
      nextText: this.nextText,
      previousText: this.previousText,
      namespace: this.namespace,
      description: this.description,
      title: this.title,
      questionEntries: this.entries,
      isHidden: this.hiddenCondition
    };
  }

  protected contextCallback(callback: (context: QuestionContext) => boolean): (ctx) => boolean {
    return ctx => callback(this.questionContextCallback(ctx));
  }
}

export class BlockedQuestionContainerBuilder<TAliases extends string> extends QuestionContainerBuilder<TAliases> {
  constructor(id: string,
              namespace: string,
              formBuilder: { [alias: string]: FormBuilder<TAliases> },
              private translationNamespace: string) {
    super(id, namespace, formBuilder);
  }


  protected askWithBuilder<Q extends Questions, B extends QuestionBuilder<Q, TAliases>>(
    id: string,
    builderConstructor: QuestionBuilderType<Q, TAliases>,
    callback?: BuilderCallBack<Q, TAliases, B>): this {
    return this.ask(new builderConstructor(id, this.namespace, this.formBuilder, new BlockedQuestionContextFactory()), callback);
  }

  protected ask<Q extends Questions, B extends QuestionBuilder<Q, TAliases>>(builder: B, callback?: BuilderCallBack<Q, TAliases, B>): this {
    return super.ask(builder.setTranslationPrefix(this.translationNamespace), callback);
  }
}
