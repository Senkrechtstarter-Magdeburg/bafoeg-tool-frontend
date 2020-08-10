import {QuestionaryFormGroup} from "./questionaryFormGroup";
import {buildQuestionary} from "@shared";
import {QuestionFormControlFactory} from "./questionFormControlFactory";
import {TestBed} from "@angular/core/testing";
import {DefaultQuestionFormControlFactory} from "./defaultQuestionFormControlFactory";

describe("QuestionaryFormGroup", () => {
  let factory: QuestionFormControlFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [{provide: QuestionFormControlFactory, useClass: DefaultQuestionFormControlFactory}]});
    factory = TestBed.inject(QuestionFormControlFactory);
  });

  it("should fill simple default values", () => {
    const questionary = buildQuestionary("test")
      .addQuestionContainer("test", b => b
        .askText("text", f => f
          .defaultTo("default")))
      .build();

    const formGroup = factory.createQuestionaryFormGroup(questionary, null) as QuestionaryFormGroup;

    const ctl = Object.values(formGroup.controls)[0].controls["questions.test.test.text"];

    expect(ctl.value).toEqual("default");
  });

  it("should update the default value of non touched fields on change", () => {
    const questionary = buildQuestionary("test")
      .addQuestionContainer("test", b => b
        .askText("text")
        .askText("text2", f => f
          .defaultTo(ctx => ctx.get("text") + "_suf")))
      .build();

    const formGroup = factory.createQuestionaryFormGroup(questionary, null) as QuestionaryFormGroup;

    const ctl1 = Object.values(formGroup.controls)[0].controls["questions.test.test.text"];
    const ctl2 = Object.values(formGroup.controls)[0].controls["questions.test.test.text2"];


    ctl1.setValue("pre");
    expect(ctl2.value).toEqual("pre_suf");
  });

  it("should set the correct value", () => {
    const questionary = buildQuestionary("test")
      .addQuestionContainer("test", b => b
        .askText("text", f => f
          .defaultTo("default")))
      .build();

    const formGroup = factory.createQuestionaryFormGroup(questionary, null) as QuestionaryFormGroup;

    expect(formGroup.value).toEqual({"questions.test.test.text": "default"});
  });
});
