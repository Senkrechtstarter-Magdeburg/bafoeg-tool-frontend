import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {TextBlockQuestion} from "../../../models/questions/textBlockQuestion";

@Component({
  selector: "app-text-block-question",
  templateUrl: "./text-block-question.component.html",
  styleUrls: ["./text-block-question.component.scss"]
})
export class TextBlockQuestionComponent extends QuestionBaseComponent<TextBlockQuestion, string> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
