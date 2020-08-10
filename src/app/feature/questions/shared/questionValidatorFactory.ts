import {ValidatorFactory} from "./validatorFactory";
import {AnswerCondition, Questionary, QuestionEntry} from "@models";
import {ValidatorFn} from "@angular/forms";
import {QuestionaryFormGroup} from "./questionaryFormGroup";
import {Injectable} from "@angular/core";

@Injectable()
export class QuestionValidatorFactory implements ValidatorFactory {
  public createFromQuestionary(questionary: Questionary): ValidatorFn[] {
    return questionary.questionContainers.flatMap(c => c.questionEntries.flatMap(e => this.createFromEntry(e)));
  }

  public createFromEntry(entry: QuestionEntry): ValidatorFn | ValidatorFn[] {
    return (entry.conditions || []).filter(x => !!x).flatMap(c => this.createFromFunction(c));
  }

  public createFromFunction(condition: AnswerCondition): ValidatorFn | ValidatorFn[] {
    return control => control.root instanceof QuestionaryFormGroup ? condition(control.value, control.root.value) : null;
  }

}
