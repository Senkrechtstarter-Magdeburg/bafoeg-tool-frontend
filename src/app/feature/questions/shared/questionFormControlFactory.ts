import {AbstractControl, FormGroup} from "@angular/forms";
import {Questionary, QuestionEntry} from "@models/questions";
import {QuestionaryFormGroup} from "./questionaryFormGroup";
import {CrossValidatingFormGroup} from "./crossValidatingFormGroup";

export abstract class QuestionFormControlFactory {
  public createQuestionaryFormGroup(questionary: Questionary, initialData: any): FormGroup {
    return new QuestionaryFormGroup(questionary, questionary.questionContainers.reduce((prev, cur) =>
      ({
        ...prev,
        [cur.namespace]: this.createQuestionEntryFormGroup(cur.questionEntries, initialData)
      }), {}));
  }

  public createQuestionEntryFormGroup(entries: QuestionEntry[], initialData: any): FormGroup {
    return new CrossValidatingFormGroup(entries.reduce((p, c) => ({
      ...p,
      [c.question.id]: this.createFormControl(c, initialData)
    }), {}));
  }

  public abstract createFormControl(entry: QuestionEntry, initialData: any): AbstractControl;
}
