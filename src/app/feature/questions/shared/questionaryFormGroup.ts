import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormGroup, ValidatorFn} from "@angular/forms";
import {ListQuestion, Questionary, QuestionEntry} from "@models";
import {Dict} from "@shared";
import {CrossValidatingFormGroup} from "./crossValidatingFormGroup";

export class QuestionaryFormGroup extends CrossValidatingFormGroup {
  controls: {
    [key: string]: FormGroup;
  };

  public constructor(private questionary: Questionary, controls: { [p: string]: AbstractControl },
                     validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  private _value: Dict;

  public get value(): Dict {
    return this._value;
  }

  public set value(val: Dict) {
    this._value = Object.values(val).reduce((prev: object, cur: object) => ({...prev, ...cur}), {});
  }

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }) {
    super.updateValueAndValidity(opts);

    for (const container of this.questionary && this.questionary.questionContainers || []) {
      const group = this.controls[container.namespace] as FormGroup;
      this.formGroupDefaultValueEvaluation(container.questionEntries, group, this.value);
    }

    // this.dataChanged.emit(Object.values(this.value).reduce((prev: object, cur: object) => ({...prev, ...cur}), {}));
  }


  private formGroupDefaultValueEvaluation(entries: QuestionEntry[], group: FormGroup, context) {
    for (const question of entries) {
      const control = group.controls[question.question.id];

      // reevaluate the default value
      this.questionDefaultValueEvaluation(question, control, context);
    }
  }

  private questionDefaultValueEvaluation(entry: QuestionEntry, control: AbstractControl, context: any) {
    switch (entry.question.type) {
      case "list":
        const question = entry.question as ListQuestion;
        const arr = control as FormArray;

        for (let itemControl of arr.controls) {
          this.formGroupDefaultValueEvaluation(question.itemQuestions, itemControl as FormGroup, context);
        }
        break;

      default:
        if (entry.defaultValue && control.pristine) {
          const defaultValue = entry.defaultValue(context);
          if (defaultValue !== control.value) {
            control.setValue(defaultValue);
          }
        }
    }
  }

}
