import {Component, OnInit} from "@angular/core";
import {Question} from "../../../models/questions/question";
import {QuestionBaseComponent} from "../question-base-component";

@Component({
  selector: "app-question-selector",
  templateUrl: "./question-selector.component.html",
  styleUrls: ["./question-selector.component.scss"]
})
export class QuestionSelectorComponent extends QuestionBaseComponent<Question, any> implements OnInit {


  constructor() {
    super();
  }

  ngOnInit() {
  }

}
