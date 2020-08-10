import {Component, EventEmitter, Input, OnInit, Output, TrackByFunction} from "@angular/core";
import {QuestionContainer} from "../../../models/questions/questionContainer";
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../question.service";
import {SafeSubscriptionComponent} from "../../../shared/safe-subscription-component";
import {QuestionEntry} from "@models/questions/questionEntry";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: "app-question-container",
  templateUrl: "./question-container.component.html",
  styleUrls: ["./question-container.component.scss"],
})
export class QuestionContainerComponent extends SafeSubscriptionComponent implements OnInit {

  @Input()
  public questionContainer: QuestionContainer;
  @Input()
  public allowNext = false;
  @Input()
  public allowPrevious = false;
  @Input()
  public context: any;
  @Input()
  public group: FormGroup;
  @Output()
  public goBack = new EventEmitter();
  @Output()
  public continue = new EventEmitter();

  constructor(private questionService: QuestionService) {
    super();
  }

  public trackByQuestionEntryId: TrackByFunction<QuestionEntry> = (index, entry) => entry && entry.question.id;

  ngOnInit() {
    this.group.valueChanges
      .pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y)))
      .subscribe(
        () => this.group.updateValueAndValidity({onlySelf: false})
      );
  }

}
