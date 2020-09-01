import {Component, OnInit} from "@angular/core";
import {Questionary} from "@models";
import {QuestionaryService} from "@shared/questionary.service";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {getData} from "../guards/routeHelpers";
import {map} from "rxjs/operators";
import {ROUTE_DATA_QUESTIONARY} from "../routing-params";

@Component({
  selector: "app-finished-screen",
  templateUrl: "./finished-screen.component.html",
  styleUrls: ["./finished-screen.component.scss"]
})
export class FinishedScreenComponent implements OnInit {

  public questionary$: Observable<Questionary>;


  constructor(private questionaryService: QuestionaryService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.questionary$ = getData(this.activatedRoute).pipe(map(data => data[ROUTE_DATA_QUESTIONARY] as Questionary));
  }


  public save(questionary: Questionary) {
    this.questionaryService.showPdfDialog(questionary);
  }
}
