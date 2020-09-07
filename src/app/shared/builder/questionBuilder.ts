import {v4 as uuid} from "uuid";
import {AnswerCondition, DisplayType, Question, QuestionEntry, QuestionOptions} from "@models/questions";
import {QuestionContext} from "@shared/builder/questionContext";
import {FormBuilder} from "@shared/builder/formBuilder";
import {Dict} from "@shared/dict";
import {QuestionContextFactory} from "@shared/builder/questionContextFactory";

export abstract class QuestionBuilder<T extends Question, TAliases extends string> {
  protected text: string;
  protected hintText: string;
  protected hiddenCondition: QuestionEntry["isHidden"];
  protected defaultValue: QuestionEntry["defaultValue"];
  protected conditions: Dict<AnswerCondition> = {};
  public validate = {
    regex: (pattern: RegExp, key: string = "matchRegex", id = uuid()): this => {
      return this.validate.custom(key, val => typeof val !== "string" || ({
        valid: !!val.match(pattern),
        additional: {
          pattern
        }
      }), id);
    },
    exactLength: (requiredLength: number, key: string = "exactLength", id = uuid()): this => {
      return this.validate.custom(key, val => typeof val !== "string" || ({
        valid: val.length === requiredLength,
        additional: {
          actualLength: val.length,
          requiredLength
        }
      }), id);
    },
    maxLength: (maxLength: number, key: string = "maxLength", id = uuid()): this => {
      return this.validate.custom(key, val => typeof val !== "string" || ({
        valid: val.length <= maxLength,
        additional: {
          actualLength: val.length,
          maxLength
        }
      }), id);
    },
    minLength: (minLength: number, key: string = "minLength", id = uuid()): this => {
      return this.validate.custom(key, val => typeof val !== "string" || ({
        valid: val.length >= minLength,
        additional: {
          actualLength: val.length,
          maxLength: minLength
        }
      }), id);
    },
    required: (key: string = "required", id = uuid()): this => this.validate.custom(key,
      val => !(val === "" || val === undefined || val === null),
      id),
    custom: <Z = any>(errorKey: string,
                      condition: (value: Z, context: QuestionContext) => boolean | { valid: boolean, additional?: Dict },
                      id: string = uuid()): this => {
      this.conditions[id] = (v, ctx) => {
        if (this.hiddenCondition && this.hiddenCondition(ctx)) {
          return null;
        }

        const result = condition(v, this.questionContextCallback(ctx));

        const resultObj = typeof result === "boolean" ? {valid: result} : result;

        return resultObj.valid ? null : {
          [errorKey]: resultObj.additional === undefined ? true : resultObj.additional
        };

      };
      return this;
    }
  };
  protected touched = false;
  protected placeholder: string;
  protected translationPrefix: string;
  protected displayType: DisplayType = DisplayType.Inline;
  private requiredValidatorUid: string;

  public constructor(protected readonly id: string,
                     protected namespace: string,
                     private formBuilder: { [alias: string]: FormBuilder<TAliases> },
                     protected questionContextFactory: QuestionContextFactory) {
    this.hintText = null;
    this.translationPrefix = this.namespace;

    this.showText();
    this.showPlaceholder();

    this.requiredValidatorUid = uuid();
    this.validate.required("required", this.requiredValidatorUid);

    this.touched = false;
  }

  protected get questionContextCallback(): <Z>(ctx: Z) => QuestionContext {
    return this.questionContextFactory.create(this.namespace, this.id);
  }

  protected get fqn(): string {
    return this.namespace ? `${this.namespace}.${this.id}` : this.id;
  }

  public optional(): this {
    delete this.conditions[this.requiredValidatorUid];
    return this;
  }

  public setNamespace(namespace: string): this {
    if (this.touched) {
      throw new Error("Namespace cannot be set after the builder has been used! It would invalidate previously called methods!");
    }

    this.namespace = namespace;
    return this;
  }

  public setTranslationPrefix(prefix: string): this {
    this.translationPrefix = prefix;

    if (this.placeholder) {
      this.showPlaceholder();
    }
    if (this.hintText) {
      this.showHint();
    }
    if (this.text) {
      this.showText();
    }

    return this;
  }

  /**
   * Connects the field in the questionary to a field in a generated pdf
   * @param form Name or alias of the form, added at the beginning with
   * `buildQuestionary(name, q => q.addForm(formName, f => f.setAlias(alias)))`
   * Can be used e.g. for custom date formats.
   * @param formFieldName Name of the Field in the PDF Form
   * @param formatter Optional function that is applied before inserting the value to the PDF form.
   */
  public withFormName(form: TAliases, formFieldName: string, formatter: (value: any) => string = (a => a)): this {
    this.touched = true;
    this.formBuilder[form].addFieldMapping(formFieldName, this.fqn, formatter);
    return this;
  }

  public hidePlaceholder(): this {
    this.touched = true;
    this.placeholder = null;
    return this;
  }

  public showPlaceholder(placeholder: string = `${this.translationPrefix}.${this.id}.placeholder`): this {
    this.touched = true;
    this.placeholder = placeholder;
    return this;
  }

  public hideText(): this {
    this.touched = true;
    this.text = null;
    return this;
  }

  public showText(text: string = `${this.translationPrefix}.${this.id}.text`): this {
    this.touched = true;
    this.text = text;
    return this;
  }

  public showHint(hint: string = `${this.translationPrefix}.${this.id}.hint`): this {
    this.touched = true;
    this.hintText = hint;
    return this;
  }

  public hideIf(callback: (context: QuestionContext) => boolean): this {
    this.touched = true;
    this.hiddenCondition = this.contextCallback(callback);

    return this;
  }

  public showIf(callback: (context: QuestionContext) => boolean): this {
    this.touched = true;
    this.hiddenCondition = this.contextCallback(ctx => !callback(ctx));

    return this;
  }

  public displayAs(displayType: DisplayType): this {
    this.touched = true;
    this.displayType = displayType;
    return this;
  }

  public defaultTo<Z>(defaultValue: ((context: QuestionContext) => Z) | Z): this {
    this.touched = true;
    if (defaultValue instanceof Function && typeof defaultValue === "function") {
      this.defaultValue = ctx => defaultValue(this.questionContextCallback(ctx));
    } else {
      this.defaultValue = () => defaultValue;
    }

    return this;
  }

  public abstract build(): T;

  public buildEntry(): QuestionEntry<T> {
    return {
      question: this.build(),
      defaultValue: this.defaultValue,
      isHidden: this.hiddenCondition,
      conditions: Object.values(this.conditions)
    };
  }

  protected buildBaseOptions(): QuestionOptions {
    return {
      id: this.fqn,
      text: this.text,
      hint: this.hintText,
      placeholder: this.placeholder,
      displayType: this.displayType
    };
  }

  protected contextCallback(callback: (context: QuestionContext) => boolean): (ctx) => boolean {
    return ctx => callback(this.questionContextCallback(ctx));
  }
}
