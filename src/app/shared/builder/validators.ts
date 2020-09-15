import {v4 as uuid} from "uuid";
import {Dict} from "@shared/dict";
import {Question} from "@models";
import {AutocompleteQuestion} from "@models/questions/autocompleteQuestion";

export type QuestionValidatorFn<T extends Question = Question> = (value: any, context: Dict, question: T) => boolean | {
  valid: boolean,
  additional?: Dict
};
export type QuestionValidator<T extends Question = Question> = {
  validate: QuestionValidatorFn<T>,
  defaultErrorKey?: string;
  id?: string;
}

export function validatorFactory<T extends Question = Question>(
  validatorFn: QuestionValidatorFn<T>,
  errorKey: string,
  id: string = uuid()): QuestionValidator<T> {
  return {
    validate: validatorFn,
    defaultErrorKey: errorKey,
    id
  };
}

export function maxLengthValidator(maxLength: number, errorKey: string = "maxLength", id: string = uuid()) {
  return validatorFactory(val => typeof val !== "string" || {
    valid: val.length <= maxLength,
    additional: {
      actualLength: val.length,
      maxLength
    }
  }, errorKey, id);
}

export function minLengthValidator(minLength: number, errorKey: string = "minLength", id: string = uuid()) {
  return validatorFactory(val => typeof val !== "string" || ({
    valid: val.length >= minLength,
    additional: {
      actualLength: val.length,
      maxLength: minLength
    }
  }), errorKey, id);
}

export function requiredValidator(errorKey: string = "required", id: string = uuid()) {
  return validatorFactory(val => !(val === "" || val === undefined || val === null), errorKey, id);
}

export function ofSelectionValidator<T>(selection: T[],
                                        comparer?: (a: string, b: T) => boolean,
                                        errorKey: string = "selection",
                                        id: string = uuid()) {
  comparer = comparer ?? ((a, b) => typeof b === "string" && a === b);
  return validatorFactory(val => ({
    valid: !!selection.find(option => comparer(val, option)),
    additional: {
      selection: selection.map(String).join(", ")
    }
  }), errorKey, id);
}

export function isAutocompleteOptionValidator(errorKey: string = "autocompleteInvalidOption", id: string = uuid()) {
  const valid = (res: { valid: boolean } | boolean) => typeof res === "boolean" ? res : res?.valid;

  return validatorFactory<AutocompleteQuestion>((val, ctx, question) => valid(ofSelectionValidator(
    question.options, (a, b) => b.value === a
  ).validate(val, ctx, question)), errorKey, id);
}
