import {QuestionContainerBuilder} from "@shared/builder/questionContainerBuilder";
import {Questionary, QuestionContainer} from "@models/questions";
import {FormBuilder} from "@shared/builder/formBuilder";
import {PDF_FORMS} from "../../questions/pdfForms";

export interface Block<T, S> {
  blockId: string;
  callback: (builder: T, args: S) => T;
}

export function defineBlock<T = QuestionContainerBuilder, S = never>(id: string, callback: (builder: T, args: S) => T): Block<T, S> {
  return {
    blockId: `questions.blocks.${id}`,
    callback: callback
  };
}

export function buildQuestionary(id: string, title: string = id): QuestionaryBuilder {
  return new QuestionaryBuilder(title);
}

export class QuestionaryBuilder {
  private containers: QuestionContainer[] = [];
  private formBuilder: FormBuilder;
  private namespace = "questions." + this.id;

  public constructor(private id: string, private title: string = id) {
    this.formBuilder = new FormBuilder(`${this.namespace}.__form`);
  }

  public withTitle(title: string) {
    this.title = title;
  }

  public useForm(formName: keyof typeof PDF_FORMS, callback?: (formBuilder: FormBuilder) => void): QuestionaryBuilder {
    this.formBuilder.setFormName(formName);

    callback && callback(this.formBuilder);

    return this;
  }

  public addQuestionContainer(namespace: string,
                              callback: (builder: QuestionContainerBuilder) => QuestionContainerBuilder): QuestionaryBuilder {
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
      formMapping: this.formBuilder.used ? this.formBuilder.build() : undefined
    };
  }
}
