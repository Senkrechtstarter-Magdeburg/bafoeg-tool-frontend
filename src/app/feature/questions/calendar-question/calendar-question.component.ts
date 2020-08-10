import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {CalendarQuestion} from "../../../models/questions/calendarQuestion";

@Component({
  selector: "app-calendar-question",
  templateUrl: "./calendar-question.component.html",
  styleUrls: ["./calendar-question.component.scss"]
})
export class CalendarQuestionComponent extends QuestionBaseComponent<CalendarQuestion, string> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
