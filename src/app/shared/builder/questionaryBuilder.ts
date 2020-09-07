import {QuestionContainerBuilder} from "@shared/builder/questionContainerBuilder";
import {DocumentRequest, Questionary, QuestionContainer} from "@models/questions";
import {FormBuilder} from "@shared/builder/formBuilder";
import {PDF_FORMS} from "@questions/pdfForms";
import {QuestionContext} from "@shared/builder/questionContext";
import {QuestionContextInternal} from "@shared/builder/questionContextInternal";
import {getEntries} from "@shared/objectHelper";

export interface Block<T, S> {
  blockId: string;
  callback: (builder: T, args: S) => T;
}

export function defineBlock<TFormAliases extends string,
  T = QuestionContainerBuilder<TFormAliases>,
  S = never>(id: string, callback: (builder: T, args: S) => T): Block<T, S> {
  return {
    blockId: `questions.blocks.${id}`,
    callback
  };
}

export function buildQuestionary<TFormAliases extends string>(id: string, title: string = id): QuestionaryBuilder<TFormAliases> {
  return new QuestionaryBuilder<TFormAliases>(title);
}

export class QuestionaryBuilder<TFormAliases extends string> {
  private containers: QuestionContainer[] = [];
  private formBuilder: { [alias: string]: FormBuilder };
  private namespace = "questions." + this.id;
  private documents: DocumentRequest[] = [];

  public constructor(private id: string, private title: string = id) {
    this.formBuilder = {};
  }

  public withTitle(title: string) {
    this.title = title;
  }

  public addDocument(id: string, required: boolean | ((ctx: QuestionContext) => boolean) = false): this {
    this.documents.push({
      id,
      name: `${this.namespace}.__documents.${id}.name`,
      description: `${this.namespace}.__documents.${id}.description`,
      required: typeof required === "function" ? ctx => required(new QuestionContextInternal(ctx, this.namespace)) : required,
    });

    return this;
  }

  public useForm(formName: keyof typeof PDF_FORMS, callback?: (formBuilder: FormBuilder<TFormAliases>) => void): this {
    if (Object.values(this.formBuilder).some(b => b.formName === formName)) {
      throw new Error(`A form with the name "${formName}" is already defined`);
    }

    const builder = new FormBuilder<TFormAliases>(`${this.namespace}.__form`, () => Object.keys(this.formBuilder));
    builder.setFormName(formName);

    if (callback) {
      callback(builder);
    }

    this.formBuilder[builder.alias] = builder;
    this.formBuilder[builder.formName] = builder;

    return this;
  }

  public addQuestionContainer(namespace: string,
                              callback: (builder: QuestionContainerBuilder<TFormAliases>) => QuestionContainerBuilder<TFormAliases>): this {
    const builder = new QuestionContainerBuilder(namespace, this.namespace + "." + namespace, this.formBuilder);
    const container = callback(builder).build();
    this.containers.push(container);
    return this;
  }

  public build(): Questionary {
    return {
      id: this.id,
      title: this.title,
      questionContainers: this.containers,
      formMappings: getEntries(this.formBuilder).filter(([alias, v]) => alias === v.formName && v.used).map(([, v]) => v.build()).collect(),
      documents: this.documents
    };
  }
}
