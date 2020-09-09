import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Questionary, QuestionContainer} from "@models/questions";
import {FormGroup} from "@angular/forms";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {Dict} from "@shared/dict";
import {QuestionFormControlFactory} from "../shared/questionFormControlFactory";
import {getEntries} from "@shared/objectHelper";
import {nextVisible} from "../shared/nextVisible";
import {slideInAnimation} from "../../pages/app-page/routes.animations";

@Component({
  selector: "app-questionary",
  templateUrl: "./questionary.component.html",
  styleUrls: ["./questionary.component.scss"],
  animations: [slideInAnimation]
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
  @Output()
  public formFilled: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public visibleSteps: QuestionContainer[];

  public state: "next" | "cur" | "prev" = "cur";
  @ViewChild("containerRef")
  public containerRef: ElementRef;

  constructor(private controlFactory: QuestionFormControlFactory) {
    super();
  }

  private _data: Dict;

  @Input()
  public set data(value: Dict) {
    this.updateFormGroup(value);
    this._data = value;

  }

  public get next(): QuestionContainer | null {
    return nextVisible(this.questionary, this.currentStep, this.context);
  }

  public get previous(): QuestionContainer | null {
    return nextVisible(this.questionary, this.currentStep, this.context, -1);
  }

  public get context(): { [key: string]: any } {
    return this.formGroup && Object.values(this.formGroup.controls)
      .reduce((prev, cur: FormGroup) => ({...prev, ...cur.value}), {});
  }

  ngOnInit() {
    this.formGroup = this.controlFactory.createQuestionaryFormGroup(this.questionary, null);
    this.updateFormGroup(this._data);

    this.formGroup.valueChanges.subscribe(this.dataChanged);
  }

  public animationStarting() {
    this.containerRef.nativeElement.scrollTo({top: 0, behavior: "smooth"});
  }

  public animationDone() {
    if (this.state === "cur") {
      return;
    }

    const next = nextVisible(this.questionary, this.currentStep, this.context, this.state === "next" ? 1 : -1);

    if (next) {
      this.stepChanged.emit(next);
    } else {
      this.formFilled.emit();
    }
    this.state = "cur";
  }

  public nextStep() {
    const next = nextVisible(this.questionary, this.currentStep, this.context, 1);
    if (next) {
      this.stepChanged.emit(next);
    } else {
      this.formFilled.emit();
    }
  }

  public prevStep() {
    const next = nextVisible(this.questionary, this.currentStep, this.context, -1);
    if (next) {
      this.stepChanged.emit(next);
    }
  }


  private updateFormGroup(value: Dict) {
    if (this.formGroup && JSON.stringify(this.formGroup.value) !== JSON.stringify(value)) {
      for (const container of this.questionary.questionContainers) {
        if (!this.formGroup.controls[container.namespace]) {
          this.formGroup.controls[container.namespace] = this.controlFactory.createQuestionEntryFormGroup(container.questionEntries, null);
        }

        const updateObj = getEntries(value).filter(([k]) => k.startsWith(container.namespace)).collect();
        (this.formGroup.controls[container.namespace] as FormGroup).patchValue(updateObj, {emitEvent: false});
      }
    }
  }
}
