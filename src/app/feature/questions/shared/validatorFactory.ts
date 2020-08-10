import {AnswerCondition, Questionary, QuestionEntry} from "@models";
import {ValidatorFn} from "@angular/forms";

export abstract class ValidatorFactory {
  public abstract createFromQuestionary(questionary: Questionary): ValidatorFn[];

  public abstract createFromEntry(entry: QuestionEntry): ValidatorFn | ValidatorFn[];

  public abstract createFromFunction(condition: AnswerCondition): ValidatorFn | ValidatorFn[];
}
