import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Questionary, QuestionContainer} from "@models/questions";
import {FormGroup} from "@angular/forms";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {prevCurNextAnimation} from "./questionary.animation";
import {Dict} from "@shared/dict";
import {QuestionFormControlFactory} from "../shared/questionFormControlFactory";
import {getEntries} from "@shared/objectHelper";

@Component({
  selector: "app-questionary",
  templateUrl: "./questionary.component.html",
  styleUrls: ["./questionary.component.scss"],
  animations: [prevCurNextAnimation]
})
export class QuestionaryComponent extends SafeSubscriptionComponent implements OnInit {

  @Input()
  public questionary: Questionary;
  @Output()
  public dataChanged: EventEmitter<{ [key: string]: any }> = new EventEmitter();
  public formGroup: FormGroup;
  @Input()
  public currentStep: QuestionContainer;
  @Output()
  public stepChanged: EventEmitter<QuestionContainer> = new EventEmitter<QuestionContainer>();
  public state: "next" | "cur" | "prev" = "cur";
  @ViewChild("containerRef")
  public containerRef: ElementRef;

  constructor(private controlFactory: QuestionFormControlFactory) {
    super();
  }

  private _data: Dict;

  @Input()
  public set data(value: Dict) {
    if (this.formGroup && this.formGroup.value !== value) {
      for (const container of this.questionary.questionContainers) {
        if (this.formGroup.controls[container.namespace]) {
          const updateObj = getEntries(value).filter(([k]) => k.startsWith(container.id)).collect();
          (this.formGroup.controls[container.namespace] as FormGroup).patchValue(updateObj, {emitEvent: false});
        } else {
          this.formGroup.controls[container.namespace] = this.controlFactory.createQuestionEntryFormGroup(container.questionEntries, value);
        }
      }
    }
    this._data = value;

  }

  public get next(): QuestionContainer | null {
    return this.nextVisible();
  }

  public get previous(): QuestionContainer | null {
    return this.nextVisible(-1);
  }

  public get context(): { [key: string]: any } {
    return this.formGroup && Object.values(this.formGroup.controls)
      .reduce((prev, cur: FormGroup) => ({...prev, ...cur.value}), {});
  }

  ngOnInit() {
    this.formGroup = this.controlFactory.createQuestionaryFormGroup(this.questionary, this._data);

    this.formGroup.valueChanges.subscribe(this.dataChanged);
  }

  public animationStarting() {
    this.containerRef.nativeElement.scrollTo({top: 0, behavior: "smooth"});
  }

  public animationDone() {
    if (this.state === "cur") {
      return;
    }

    const next = this.nextVisible(this.state === "next" ? 1 : -1);

    this.stepChanged.emit(next);
    this.state = "cur";
  }

  public nextVisible(amount: number = 1): QuestionContainer | null {
    if (!this.questionary.questionContainers) {
      return null;
    }

    if (amount === 0) {
      return this.currentStep;
    }

    const direction = amount < 0 ? -1 : 1;
    let next = this.questionary.questionContainers.indexOf(this.currentStep);
    while (amount !== 0) {
      next += direction;

      if (next < 0 || next >= this.questionary.questionContainers.length) {
        return null;
      }

      if (!(this.questionary.questionContainers[next].isHidden && this.questionary.questionContainers[next].isHidden(this.context))) {
        amount -= direction;
      }
    }

    return this.questionary.questionContainers[next];
  }


}
