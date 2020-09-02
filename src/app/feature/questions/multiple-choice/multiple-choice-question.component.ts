import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {DisplayType, MultipleChoiceQuestion} from "@models";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Observable, zip} from "rxjs";
import {map} from "rxjs/operators";


function minDisplayType(a: DisplayType, b: DisplayType): DisplayType {
  const typeMap = {
    [DisplayType.Inline]: 2,
    [DisplayType.Dropdown]: 1,
    [DisplayType.Promoted]: 3,
  };

  return typeMap[a] - typeMap[b] < 0 ? a : b;
}

@Component({
  selector: "app-multiple-choice-question",
  templateUrl: "./multiple-choice-question.component.html",
  styleUrls: ["./multiple-choice-question.component.scss"]
})
export class MultipleChoiceQuestionComponent extends QuestionBaseComponent<MultipleChoiceQuestion, string> implements OnInit {
  public displayType$: Observable<DisplayType>;

  public constructor(private observer: BreakpointObserver) {
    super();
  }

  public ngOnInit() {
    this.displayType$ = zip(
      this.observer.observe([Breakpoints.Small]).pipe(map(state => state.matches ? 2 : -1)),
      this.observer.observe([Breakpoints.XSmall]).pipe(map(state => state.matches ? 1 : -1))
    ).pipe(
      // it appears as both states (small and xsmall) can be matched at the same time.
      // In that case xsmall should dominate. To keep -1 as not matched inverting max(a, b) to -min(-a, -b)
      map(([a, b]) => -Math.min(-a, -b)),
      map(state => state === -1 ?
                   this.question.displayType :
                   (state === 1 ? this.preferred(DisplayType.Dropdown) : this.preferred(DisplayType.Inline))),
    );
  }

  private preferred(other: DisplayType): DisplayType {
    return minDisplayType(other, this.question.displayType);
  }

}
