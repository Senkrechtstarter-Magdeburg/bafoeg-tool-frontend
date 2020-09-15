import {ValidatorFactory} from "./validatorFactory";
import {AnswerCondition, Question, Questionary, QuestionEntry} from "@models";
import {ValidatorFn} from "@angular/forms";
import {QuestionaryFormGroup} from "./questionaryFormGroup";
import {Injectable} from "@angular/core";

@Injectable()
export class QuestionValidatorFactory implements ValidatorFactory {
  public createFromQuestionary(questionary: Questionary): ValidatorFn[] {
    return questionary.questionContainers.flatMap(c => c.questionEntries.flatMap(e => this.createFromEntry(e)));
  }

  public createFromEntry(entry: QuestionEntry): ValidatorFn | ValidatorFn[] {
    return (entry.conditions || []).filter(x => !!x).flatMap(c => this.createFromFunction(c, entry.question));
  }

  public createFromFunction(condition: AnswerCondition, question: Question): ValidatorFn | ValidatorFn[] {
    return control => control.root instanceof QuestionaryFormGroup ? condition(control.value, control.root.value, question) : null;
  }

}
