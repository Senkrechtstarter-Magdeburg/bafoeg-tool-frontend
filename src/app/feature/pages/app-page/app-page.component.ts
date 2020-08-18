import {Component, OnInit} from "@angular/core";
import {combineLatest, Observable} from "rxjs";
import {filter, map} from "rxjs/operators";
import {ROUTE_PARAMETER_CURRENT_QUESTIONARY, ROUTE_PARAMETER_CURRENT_STEP} from "./routing-params";
import {ActivatedRoute, Router} from "@angular/router";
import {Questionary, QuestionContainer} from "@models/questions";
import {questions} from "../../../questions/questions";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {Dict} from "@shared/dict";
import {StorageService} from "@shared";
import {MatDialog} from "@angular/material/dialog";
import {PdfDialogComponent} from "./pdf-dialog/pdf-dialog.component";


@Component({
  selector: "app-app-page",
  templateUrl: "./app-page.component.html",
  styleUrls: ["./app-page.component.scss"]
})
export class AppPageComponent extends SafeSubscriptionComponent implements OnInit {

  public questionary$: Observable<Questionary>;
  public currentStep$: Observable<QuestionContainer>;
  public data = {};

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private storageService: StorageService,
              private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.data = this.storageService.restore();

    this.questionary$ = this.activatedRoute.paramMap.pipe(
      map(params => questions.find(q => q.id === params.get(ROUTE_PARAMETER_CURRENT_QUESTIONARY))),
    );

    const step$ = combineLatest([
      this.activatedRoute.paramMap.pipe(map(params => params.get(ROUTE_PARAMETER_CURRENT_STEP))),
      this.questionary$
    ]);

    this.currentStep$ = step$.pipe(
      filter(([id]) => id !== "start"),
      map(([currentStep, questionary]) => questionary.questionContainers.find(c => c.id === currentStep)),
    );

    this.subscribe(step$.pipe(
      filter(([id]) => id === "start"),
    ), ([, questionary]) => {
      this.router.navigate(["../", questionary.questionContainers[0].id], {relativeTo: this.activatedRoute});
    });
  }

  public stepChanged(container: QuestionContainer) {
    this.router.navigate(["../", container.id], {relativeTo: this.activatedRoute});
  }

  public save(questionary: Questionary) {
    this.dialog.open(PdfDialogComponent, {
      data: {
        questionary,
        data: this.data
      }
    });
  }


  public dataChanged(data: Dict) {
    this.data = data;
    this.storageService.store(data);
  }
}
