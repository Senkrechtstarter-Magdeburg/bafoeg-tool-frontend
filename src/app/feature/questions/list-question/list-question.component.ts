import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {ListQuestion} from "@models/questions/listQuestion";
import {FormArray} from "@angular/forms";
import {QuestionFormControlFactory} from "../shared/questionFormControlFactory";

@Component({
  selector: "app-list-question",
  templateUrl: "./list-question.component.html",
  styleUrls: ["./list-question.component.scss"]
})
export class ListQuestionComponent<T> extends QuestionBaseComponent<ListQuestion, T[], FormArray> implements OnInit {

  constructor(private formControlFactory: QuestionFormControlFactory) {
    super();
  }

  ngOnInit(): void {
  }

  public addItem() {
    this.control.push(this.formControlFactory.createQuestionEntryFormGroup(this.question.itemQuestions, this.control.root.value));
  }
}
