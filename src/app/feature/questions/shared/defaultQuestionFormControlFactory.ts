import {isLoadedQuestionEntry, ListQuestion, QuestionEntry} from "@models/questions";
import {AbstractControl, FormArray, FormControl, ValidatorFn} from "@angular/forms";
import {QuestionFormControlFactory} from "./questionFormControlFactory";
import {Injectable} from "@angular/core";
import {ValidatorFactory} from "./validatorFactory";

@Injectable()
export class DefaultQuestionFormControlFactory extends QuestionFormControlFactory {

  public constructor(private validatorFactory: ValidatorFactory) {
    super();
  }


  private static getStoredValue(entry: QuestionEntry, initialData: any) {
    if (isLoadedQuestionEntry(entry)) {
      return initialData && entry.getValue(initialData);
    } else {
      return initialData && initialData[entry.question.id];
    }
  }

  public createFormControl(entry: QuestionEntry, initialData: any): AbstractControl {
    const validators = this.validatorFactory.createFromEntry(entry);

    switch (entry.question.type) {
      case "list":
        return this.createListQuestionFormControl(entry.question, initialData, validators);
      default:
        return this.createDefaultFormControl(entry, initialData, validators);
    }
  }

  protected createDefaultFormControl(entry: QuestionEntry, initialData: any, validators: ValidatorFn | ValidatorFn[]) {
    return new FormControl(entry.defaultValue &&
      entry.defaultValue(initialData) ||
      DefaultQuestionFormControlFactory.getStoredValue(entry, initialData), validators);
  }

  protected createListQuestionFormControl(question: ListQuestion, initialData: any, validators: ValidatorFn | ValidatorFn[]) {
    let arr = initialData && initialData[question.id];

    if (!Array.isArray(arr)) {
      arr = [];
    }

    return new FormArray(arr.map((_, i) => this.createQuestionEntryFormGroup(question.itemQuestions.map(entry => ({
      ...entry,
      getValue: context => context && context[question.id] && context[question.id][i][entry.question.id]
    })), initialData)), validators);
  }
}
