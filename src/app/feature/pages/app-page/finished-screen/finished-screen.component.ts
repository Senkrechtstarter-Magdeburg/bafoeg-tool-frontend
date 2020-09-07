import {Component, OnInit} from "@angular/core";
import {DocumentRequest, Questionary} from "@models";
import {QuestionaryService} from "@shared/questionary.service";
import {Observable, Subject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {getData} from "../guards/routeHelpers";
import {filter, map} from "rxjs/operators";
import {ROUTE_DATA_QUESTIONARY} from "../routing-params";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: "app-finished-screen",
  templateUrl: "./finished-screen.component.html",
  styleUrls: ["./finished-screen.component.scss"]
})
export class FinishedScreenComponent implements OnInit {

  public questionary$: Observable<Questionary>;
  private documentSource$ = new Subject<{ name: string, link: SafeUrl }[]>();
  public documents$: Observable<{ name: string, link: SafeUrl }[]> = this.documentSource$.asObservable();


  constructor(public questionaryService: QuestionaryService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.questionary$ = getData(this.activatedRoute).pipe(map(data => data[ROUTE_DATA_QUESTIONARY] as Questionary));
  }


  public save(questionary: Questionary) {
    this.questionaryService.showPdfDialog(questionary).afterClosed().pipe(
      filter(x => !!x)
    ).subscribe(
      next => this.documentSource$.next(next)
    );
  }

  public requiredDocuments(questionary: Questionary): DocumentRequest[] {
    return questionary.documents.filter(x => typeof x.required === "function" ? x.required(this.questionaryService.data) : x.required);
  }
}
