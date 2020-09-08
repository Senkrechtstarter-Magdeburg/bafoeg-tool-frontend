import {Dict} from "@shared/dict";
import {FormMapping} from "@models/forms";
import {QuestionContext} from "@shared/builder/questionContext";
import {QuestionContextInternal} from "@shared/builder/questionContextInternal";

export class FormBuilder<TAliases extends string> {
  public used = false;
  public formName: string;
  public alias: string;
  private mappings: Dict<{ fieldId: string, formatter: (val: any) => string }> = {};
  private calculatedMappings: Dict<(ctx: any) => any> = {};

  public constructor(private namespace: string, private getAliases: () => string[]) {
  }

  public setFormName(formName: string): this {
    this.formName = formName;
    this.alias = this.alias ?? formName;
    this.used = true;
    return this;
  }

  public setAlias(alias: TAliases): this {
    if (this.getAliases().indexOf(alias) >= 0) {
      throw new Error(`Alias "${alias}" for form "${this.formName}" is already taken.`);
    }

    this.alias = alias;

    this.used = true;
    return this;
  }

  public addFieldMapping<T = any>(formFieldName: string, fieldId: string, formatter: (val: T) => string = (a => a?.toString())): this {
    this.mappings = {...this.mappings, [formFieldName]: {fieldId, formatter}};
    this.used = true;
    return this;
  }

  public addCalculatedMapping(formFieldName: string, calculation: (ctx: QuestionContext) => any): this {
    this.calculatedMappings =
      {...this.calculatedMappings, [formFieldName]: (raw => calculation(new QuestionContextInternal(raw, this.namespace)))};
    this.used = true;
    return this;
  }

  public build(): FormMapping {
    if (!this.formName) {
      throw new Error("Cannot build a form mapping without formname!");
    }

    const mappings = this.mappings;
    const calculatedMappings = this.calculatedMappings;

    return {
      formName: this.formName,
      getFormField(formFieldName: string, context: any): string {
        if (formFieldName in mappings) {
          return mappings[formFieldName].formatter(context[mappings[formFieldName].fieldId]);
        }

        if (formFieldName in calculatedMappings) {
          return calculatedMappings[formFieldName](context);
        }

        return null;
      },
      getMappings(context: any): Dict {
        return {
          ...Object.entries(mappings).reduce((prev, [name, field]) => ({...prev, [name]: field.formatter(context[field.fieldId])}), {}),
          ...Object.entries(calculatedMappings).reduce((prev, [name, fn]) => ({...prev, [name]: fn(context)}), {})
        };
      }
    };
  }
}
