import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {TextQuestion} from "../../../models/questions/textQuestion";

@Component({
  selector: "app-text-question",
  templateUrl: "./text-question.component.html",
  styleUrls: ["./text-question.component.scss"]
})
export class TextQuestionComponent extends QuestionBaseComponent<TextQuestion, string> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
