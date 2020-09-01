import {Component, OnInit} from "@angular/core";
import {combineLatest, Observable} from "rxjs";
import {Questionary, QuestionContainer} from "@models";
import {delay, map} from "rxjs/operators";
import {ROUTE_DATA_QUESTIONARY, ROUTE_DATA_STEP} from "../routing-params";
import {ActivatedRoute, Router} from "@angular/router";
import {Dict, StorageService} from "@shared";
import {nextVisible} from "../../../questions/shared/nextVisible";
import {QuestionaryService} from "@shared/questionary.service";
import {getData} from "../guards/routeHelpers";

@Component({
  selector: "app-questionary-screen",
  templateUrl: "./questionary-screen.component.html",
  styleUrls: ["./questionary-screen.component.scss"]
})
export class QuestionaryScreenComponent implements OnInit {

  public currentStep$: Observable<QuestionContainer>;
  public questionary$: Observable<Questionary>;
  public visibleSteps$: Observable<QuestionContainer[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private questionaryService: QuestionaryService,
              public storageService: StorageService) {
  }

  public get data() {
    return this.questionaryService.data;
  }

  public ngOnInit(): void {
    this.currentStep$ = getData(this.activatedRoute).pipe(map(data => data[ROUTE_DATA_STEP] as QuestionContainer));
    this.questionary$ = getData(this.activatedRoute).pipe(map(data => data[ROUTE_DATA_QUESTIONARY] as Questionary));
    this.visibleSteps$ = combineLatest([this.questionary$, this.questionaryService.data$]).pipe(
      delay(0),
      map(([questionary, data]) => questionary.questionContainers.filter(x => !(x.isHidden && x.isHidden(data))))
    );
  }

  public dataChanged(data: Dict) {
    this.questionaryService.updateData(data);
    this.storageService.store(data);
  }

  public stepChanged(container: QuestionContainer) {
    this.router.navigate(["../", container.id], {relativeTo: this.activatedRoute});
  }

  public formFilled() {
    this.router.navigate(["../", "finished"], {relativeTo: this.activatedRoute});
  }


  public back(questionary: Questionary) {
    this.stepChanged(nextVisible(questionary, "end", this.data, -1));
  }

}
