import {sandboxOf} from "angular-playground";
import {QuestionsModule} from "../questions.module";
import {TextQuestionComponent} from "./text-question.component";
import {TextQuestion} from "../../../models/questions/textQuestion";
import {FormControl, Validators} from "@angular/forms";

export default sandboxOf(TextQuestionComponent, {
  declareComponent: false,
  imports: [QuestionsModule]
})
  .add("default", {
    template: `<app-text-question [question]="question" [control]="formControl"></app-text-question>`,
    context: {
      question: new TextQuestion({id: "testTextId1", text: "testTextText"}),
      formControl: new FormControl()
    }
  })
  .add("verification", {
    template: `<app-text-question [question]="question" [control]="formControl"></app-text-question>`,
    context: {
      question: new TextQuestion({id: "testTextId1", text: "testTextText", hint: "max length of 2"}),
      formControl: new FormControl("asd", Validators.maxLength(2))
    }
  });
