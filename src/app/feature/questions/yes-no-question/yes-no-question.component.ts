import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {YesNoQuestion} from "../../../models/questions/yesNoQuestion";

@Component({
  selector: "app-yes-no-question",
  templateUrl: "./yes-no-question.component.html",
  styleUrls: ["./yes-no-question.component.scss"]
})
export class YesNoQuestionComponent extends QuestionBaseComponent<YesNoQuestion, string> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
