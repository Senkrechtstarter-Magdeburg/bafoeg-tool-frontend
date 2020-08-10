import {sandboxOf} from "angular-playground";
import {QuestionsModule} from "../questions.module";
import {FormControl} from "@angular/forms";
import {YesNoQuestionComponent} from "./yes-no-question.component";
import {YesNoQuestion} from "../../../models/questions/yesNoQuestion";
import {AppModule} from "../../../app.module";

export default sandboxOf(YesNoQuestionComponent, {
  declareComponent: false,
  imports: [QuestionsModule, AppModule]
})
  .add("default", {
    template: `<app-yes-no-question [question]="question" [control]="formControl"></app-yes-no-question>`,
    context: {
      question: new YesNoQuestion({id: "testTextId1", text: "testTextText"}),
      formControl: new FormControl()
    }
  });
