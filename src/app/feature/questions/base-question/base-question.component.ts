import {Component, Input} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {Question} from "@models/questions";

@Component({
  selector: "app-base-question",
  templateUrl: "./base-question.component.html",
  styleUrls: ["./base-question.component.scss"]
})
export class BaseQuestionComponent<T extends Question, A> extends QuestionBaseComponent<T, A> {

  @Input()
  public showHint = true;
}
