import {Component, OnInit} from "@angular/core";
import {QuestionBaseComponent} from "../question-base-component";
import {AutocompleteOption, AutocompleteQuestion} from "@models/questions/autocompleteQuestion";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {delay, map} from "rxjs/operators";
import {compareTwoStrings} from "string-similarity";

@Component({
  selector: "app-autocomplete-question",
  templateUrl: "./autocomplete-question.component.html",
  styleUrls: ["./autocomplete-question.component.scss"]
})
export class AutocompleteQuestionComponent extends QuestionBaseComponent<AutocompleteQuestion, FormControl> implements OnInit {


  public filteredOptions: Observable<AutocompleteOption[]>;

  constructor() {
    super();
  }

  public ngOnInit(): void {
    this.filteredOptions = this.control.valueChanges.pipe(
      map(value => value.length >= 2 ? this.filterOptions(value) : []),
      delay(0)
    );
  }

  private filterOptions(filterValue: string) {
    return this.question.options
      .map(option => ({
          ...option,
          match: .25 * compareTwoStrings(filterValue, option.value) + .75 * compareTwoStrings(filterValue, option.title)
        })
      )
      .sort((a, b) => b.match - a.match)
      .filter((x, i, self) => self.reduce((prev, cur) => prev >= cur.match ? prev : cur.match, 0) - 0.2 <= x.match)
      .slice(0, 20);
  }
}
