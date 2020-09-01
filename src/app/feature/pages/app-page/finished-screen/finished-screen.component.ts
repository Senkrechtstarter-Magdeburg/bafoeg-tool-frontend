import {Component, OnInit} from "@angular/core";
import {DocumentRequest, Questionary} from "@models";
import {QuestionaryService} from "@shared/questionary.service";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {getData} from "../guards/routeHelpers";
import {map} from "rxjs/operators";
import {ROUTE_DATA_QUESTIONARY} from "../routing-params";
import {nextVisible} from "../../../questions/shared/nextVisible";

@Component({
  selector: "app-finished-screen",
  templateUrl: "./finished-screen.component.html",
  styleUrls: ["./finished-screen.component.scss"]
})
export class FinishedScreenComponent implements OnInit {

  public questionary$: Observable<Questionary>;


  constructor(public questionaryService: QuestionaryService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.questionary$ = getData(this.activatedRoute).pipe(map(data => data[ROUTE_DATA_QUESTIONARY] as Questionary));
  }


  public save(questionary: Questionary) {
    this.questionaryService.showPdfDialog(questionary);
  }

  public requiredDocuments(questionary: Questionary): DocumentRequest[] {
    return questionary.documents.filter(x => typeof x.required === "function" ? x.required(this.questionaryService.data) : x.required);
  }

  public back(questionary: Questionary) {
    const last = nextVisible(questionary, "end", this.questionaryService.data, -1);
    this.router.navigate(["..", last.id], {relativeTo: this.activatedRoute});
  }
}
