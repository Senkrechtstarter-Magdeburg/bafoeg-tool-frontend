import {Directive, EventEmitter, Input, Output} from "@angular/core";
import {Question} from "../../models/questions/question";
import {AbstractControl, FormControl} from "@angular/forms";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {DisplayType} from "@models";

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class QuestionBaseComponent<TQuestion extends Question, TAnswer, TControl extends AbstractControl = FormControl>
  extends SafeSubscriptionComponent {

  public DisplayType = DisplayType;


  @Input()
  public translationContext: any;

  @Input()
  public context: any;

  @Output()
  public questionAnswered: EventEmitter<TAnswer> = new EventEmitter<TAnswer>();

  @Input()
  public question: TQuestion;

  @Input()
  public control: TControl;

  public get isPrompted(): boolean {
    return !!(this.question.displayType & DisplayType.Promoted);
  }

  public get isInline(): boolean {
    return !!(this.question.displayType & DisplayType.Inline);
  }

  public expandTranslationContext(add: object) {
    return ({...this.translationContext, ...add});
  }

  protected answer(answer?: TAnswer): void {
    if (answer === undefined) {
      answer = this.control.value;
    }

    this.questionAnswered.emit(answer);
  }

  protected reset(): void {
    this.control.reset();
  }
}
