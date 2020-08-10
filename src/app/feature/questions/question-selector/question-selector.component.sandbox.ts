import {sandboxOf} from "angular-playground";
import {QuestionSelectorComponent} from "./question-selector.component";
import {QuestionsModule} from "../questions.module";
import {FormControl} from "@angular/forms";
import {MultipleChoiceQuestion} from "../../../models/questions/multipleChoiceQuestion";
import {TextQuestion} from "../../../models/questions/textQuestion";

export default sandboxOf(QuestionSelectorComponent, {
  imports: [QuestionsModule],
  declareComponent: false
})
  .add("multiple choice", {
    template: `<app-question-selector [control]="formControl" [question]="question"></app-question-selector>
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
  })
  .add("text", {
    template: `<app-question-selector [control]="formControl" [question]="question"></app-question-selector>
               <br><pre>Value: {{formControl.value | json}}</pre>`,
    context: {
      formControl: new FormControl(),
      question: new TextQuestion({id: "testId", text: "whatDoYouChoose"})
    }
  });
