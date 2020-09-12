import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {AutocompleteOption, AutocompleteQuestion} from "@models/questions/autocompleteQuestion";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {delay, map} from "rxjs/operators";
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

  public ngOnInit(): void {
    this.filteredOptions = this.control.valueChanges.pipe(
      map(value => value.length >= 2 ? this.filterOptions(value) : []),
      delay(0)
    );
  }

  public displayFnFactory(): (value: any) => string {
    const self = this;
    return ((value) => {
      return self.getTitle(self.question.options.find(x => x.value === value)?.title);
    });
  }

  public getTitle(title: string | { [p: string]: string } | null): string | null {
    return typeof title === "object" ? title?.[this.translateService.currentLang] ?? title.en ?? title.de : title;
  }

  private filterOptions(filterValue: string) {
    return this.question.options
      .map(option => {
          const title = this.getTitle(option.title);

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
