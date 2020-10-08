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
}

export function validatorFactory<T extends Question = Question>(
  validatorFn: QuestionValidatorFn<T>,
  errorKey: string): QuestionValidator<T> {
  return {
    validate: validatorFn,
    defaultErrorKey: errorKey,
  };
}

export function maxLengthValidator(maxLength: number, errorKey: string = "maxLength") {
  return validatorFactory(val => typeof val !== "string" || {
    valid: val.length <= maxLength,
    additional: {
      actualLength: val.length,
      maxLength
    }
  }, errorKey);
}

export function minLengthValidator(minLength: number, errorKey: string = "minLength") {
  return validatorFactory(val => typeof val !== "string" || ({
    valid: val.length >= minLength,
    additional: {
      actualLength: val.length,
      maxLength: minLength
    }
  }), errorKey);
}

export function requiredValidator(errorKey: string = "required") {
  return validatorFactory(val => !(val === "" || val === undefined || val === null), errorKey);
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
  }), errorKey);
}

export function isAutocompleteOptionValidator(errorKey: string = "autocompleteInvalidOption") {
  const valid = (res: { valid: boolean } | boolean) => typeof res === "boolean" ? res : res?.valid;

  return validatorFactory<AutocompleteQuestion>((val, ctx, question) => valid(ofSelectionValidator(
    question.options, (a, b) => b.value === a
  ).validate(val, ctx, question)), errorKey);
}
