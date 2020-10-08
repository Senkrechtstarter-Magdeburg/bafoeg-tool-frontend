import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {
  AutocompleteOption,
  AutocompleteQuestion,
  TranslatedAutocompleteOption
} from "@models/questions/autocompleteQuestion";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {delay, distinctUntilChanged, filter, map} from "rxjs/operators";
import {compareTwoStrings} from "string-similarity";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-autocomplete-question",
  templateUrl: "./autocomplete-question.component.html",
  styleUrls: ["./autocomplete-question.component.scss"]
})
export class AutocompleteQuestionComponent extends QuestionBaseComponent<AutocompleteQuestion, FormControl> implements OnInit {


  public filteredOptions: Observable<AutocompleteOption[]>;

  constructor(private translateService: TranslateService) {
    super();
  }

  public displayFn = value => this.getTitleInstant(this.question.options.find(x => x.value === value)) ?? value

  public ngOnInit(): void {
    this.filteredOptions = this.control.valueChanges.pipe(
      distinctUntilChanged(),
      filter(x => !!x),
      map((value) => value.length >= 2 ? this.filterOptions(
        this.question.options.map(option => ({...option, title: this.getTitleInstant(option)})),
        value) : []),
      delay(0),
    );
  }

  public getTitleInstant(option: AutocompleteOption): string {
    const title = option?.title;
    return typeof title === "object" ? this.translateService.instant(title?.translateKey) : title;
  }

  private filterOptions(options: TranslatedAutocompleteOption[], filterValue: string) {
    return options
      .map(option => {
          const title = option.title;

          return {
            ...option,
            match:
              this.question.valueWeight * compareTwoStrings(filterValue, option.value) +
              this.question.titleWeight * compareTwoStrings(filterValue, title) +
              this.question.startsWithWeight * (+title.startsWith(filterValue) * (filterValue.length / title.length))
          };
        }
      )
      .sort((a, b) => b.match - a.match)
      // .filter((x, i, self) => self.reduce((prev, cur) => prev >= cur.match ? prev : cur.match, 0) - 0.2 <= x.match)
      .slice(0, 20);
  }
}
