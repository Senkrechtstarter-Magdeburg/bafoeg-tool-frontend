import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AutocompleteQuestionComponent} from "./autocomplete-question.component";

describe("AutocompleteQuestionComponent", () => {
  let component: AutocompleteQuestionComponent;
  let fixture: ComponentFixture<AutocompleteQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteQuestionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
