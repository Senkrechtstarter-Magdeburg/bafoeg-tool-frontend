import {sandboxOf} from "angular-playground";
import {ListQuestionComponent} from "./list-question.component";
import {QuestionsModule} from "../questions.module";
import {FormArray, FormControl} from "@angular/forms";
import {ListQuestion} from "@models/questions/listQuestion";
import {TextQuestion} from "@models/questions";
import {CrossValidatingFormGroup} from "../shared/crossValidatingFormGroup";


export default sandboxOf(ListQuestionComponent, {
  declareComponent: false,
  imports: [
    QuestionsModule
  ]
})
  .add("default", {
    template: `<app-list-question [control]="formControl" [question]="question"></app-list-question>
               <br><pre>Value: {{formControl.value | json}}</pre>`,
    context: {
      formControl: new FormArray([
        new CrossValidatingFormGroup({
          line1: new FormControl(),
          line2: new FormControl()
        })
      ]),
      question: new ListQuestion({
        id: "testId", text: "Items", itemQuestions: [
          {
            question: new TextQuestion({id: "line1", text: "Line1", placeholder: "Line 1"})
          },
          {
            question: new TextQuestion({id: "line2", text: "Line2", placeholder: "Line 2"})
          }
        ]
      })
    }
  });
