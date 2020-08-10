import {QuestionContainer, Questions} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {QuestionContext} from "@shared/builder/questionContext";
import {QuestionContextInternal} from "@shared/builder/questionContextInternal";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionEntryBuilder} from "@shared/builder/questionEntryBuilder";
import {BuilderCallBack} from "@shared/builder/builderCallBack";
import {QuestionBuilderType} from "@shared/builder/questionBuilderType";
import {BlockedQuestionContextFactory} from "@shared/builder/blockedQuestionContextFactory";


export class QuestionContainerBuilder extends QuestionEntryBuilder {
  protected questionContextCallback: (ctx: any) => QuestionContext;
  protected hiddenCondition: QuestionContainer["isHidden"];
  private description: string;
  private title: string;
  private nextText = "app.next";
  private previousText = "app.previous";

  public constructor(id: string, namespace: string = id, formBuilder: FormBuilder) {
    super(id, namespace, formBuilder);
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

export class BlockedQuestionContainerBuilder extends QuestionContainerBuilder {
  constructor(id: string, namespace: string, formBuilder: FormBuilder, private translationNamespace: string) {
    super(id, namespace, formBuilder);
  }


  protected askWithBuilder<Q extends Questions, B extends QuestionBuilder<Q>>(id: string,
                                                                              builderConstructor: QuestionBuilderType<Q>,
                                                                              callback?: BuilderCallBack<Q, B>): this {
    return this.ask(new builderConstructor(id, this.namespace, this.formBuilder, new BlockedQuestionContextFactory()), callback);
  }

  protected ask<Q extends Questions, B extends QuestionBuilder<Q>>(builder: B, callback?: BuilderCallBack<Q, B>): this {
    return super.ask(builder.setNamespace(this.namespace.substr(0, this.namespace.lastIndexOf(".")))
      .setTranslationPrefix(this.translationNamespace), callback);
  }
}
