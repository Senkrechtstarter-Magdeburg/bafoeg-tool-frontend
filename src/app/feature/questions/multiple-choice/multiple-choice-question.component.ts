import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {MultipleChoiceQuestion} from "../../../models/questions/multipleChoiceQuestion";

@Component({
  selector: "app-multiple-choice-question",
  templateUrl: "./multiple-choice-question.component.html",
  styleUrls: ["./multiple-choice-question.component.scss"]
})
export class MultipleChoiceQuestionComponent extends QuestionBaseComponent<MultipleChoiceQuestion, string> implements OnInit {

  public constructor() {
    super();
  }

  public ngOnInit() {
  }

}
