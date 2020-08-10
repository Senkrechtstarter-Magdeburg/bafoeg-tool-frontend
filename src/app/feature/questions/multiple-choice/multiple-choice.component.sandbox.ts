import {sandboxOf} from "angular-playground";
import {MultipleChoiceQuestionComponent} from "./multiple-choice-question.component";
import {FormControl} from "@angular/forms";
import {MultipleChoiceQuestion} from "../../../models/questions/multipleChoiceQuestion";
import {QuestionsModule} from "../questions.module";

export default sandboxOf(MultipleChoiceQuestionComponent, {
  declareComponent: false,
  imports: [QuestionsModule]
})
  .add("default", {
    template: `<app-multiple-choice-question [control]="formControl" [question]="question"></app-multiple-choice-question>
               <br><pre>Value: {{formControl.value | json}}</pre>`,
    context: {
      formControl: new FormControl(),
      question: new MultipleChoiceQuestion({
        id: "testId", text: "whatDoYouChoose", choices: [
          {text: "Option1", value: "option1"},
          {text: "Option2", value: "option2"},
        ]
      })
    }
  });
