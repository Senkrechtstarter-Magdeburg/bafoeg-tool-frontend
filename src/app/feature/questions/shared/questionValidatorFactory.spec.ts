import {QuestionValidatorFactory} from "./questionValidatorFactory";
import {DisplayType, TextQuestion} from "@models";
import {buildQuestionary} from "@shared";
import {QuestionaryFormGroup} from "./questionaryFormGroup";
import {QuestionFormControlFactory} from "./questionFormControlFactory";
import {TestBed} from "@angular/core/testing";
import {DefaultQuestionFormControlFactory} from "./defaultQuestionFormControlFactory";
import {ValidatorFactory} from "./validatorFactory";

describe("QuestionValidatorFactory", () => {
  let controlFactory: QuestionFormControlFactory;
  let factory: QuestionValidatorFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ValidatorFactory, useClass: QuestionValidatorFactory},
        {provide: QuestionFormControlFactory, useClass: DefaultQuestionFormControlFactory}
      ]
    });
    factory = TestBed.inject(ValidatorFactory);
    controlFactory = TestBed.inject(QuestionFormControlFactory);
  });
  it("should create no validators for no conditions", () => {
    const actual = factory.createFromEntry({
      question: new TextQuestion({text: "Text", id: "text", displayType: DisplayType.Inline})
    });

    expect(actual).toEqual([]);
  });
  it("should create validators", () => {
    const questionary = buildQuestionary("test")
      .addQuestionContainer("test", b => b
        .askText("text", f => f
          .validate.required()))
      .build();

    const formGroup = controlFactory.createQuestionaryFormGroup(questionary, null) as QuestionaryFormGroup;
    const control = formGroup.controls["questions.test.test"].controls["questions.test.test.text"];
    control.updateValueAndValidity();

    expect(control.errors).toBeTruthy("There should be errors on the form control");
    expect(Object.keys(control.errors)).toEqual(["required"]);
  });
});
