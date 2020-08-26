import {Component, OnInit} from "@angular/core";
import {combineLatest, Observable} from "rxjs";
import {filter, first, map} from "rxjs/operators";
import {ROUTE_PARAMETER_CURRENT_QUESTIONARY, ROUTE_PARAMETER_CURRENT_STEP} from "./routing-params";
import {ActivatedRoute, Router} from "@angular/router";
import {Questionary, QuestionContainer} from "@models/questions";
import {questions} from "../../../questions/questions";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {Dict} from "@shared/dict";
import {StorageService} from "@shared";
import {MatDialog} from "@angular/material/dialog";
import {PdfDialogComponent} from "./pdf-dialog/pdf-dialog.component";
import {FileExchangeService, FilesError} from "@shared/file-exchange.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: "app-app-page",
  templateUrl: "./app-page.component.html",
  styleUrls: ["./app-page.component.scss"]
})
export class AppPageComponent extends SafeSubscriptionComponent implements OnInit {

  public questionary$: Observable<Questionary>;
  public currentStep$: Observable<QuestionContainer>;
  public data = {};

  public window = window;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public storageService: StorageService,
              private dialog: MatDialog,
              private fileExchangeService: FileExchangeService,
              private translateService: TranslateService,
              private snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.restore();

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

  public restore() {
    this.data = this.storageService.restore();
  }


  public dataChanged(data: Dict) {
    this.data = data;
    this.storageService.store(data);
  }

  public export() {
    const date = new Date();

    this.fileExchangeService.downloadJSON(this.data,
      `${this.translateService.instant(
        "app.import_export.export_data_file_name",
        {date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`})}.json`);
  }

  public import() {
    this.fileExchangeService.uploadJson().subscribe({
      error: (err: Error) => {
        let msg: { text: string, interpolateParams?: object } = null;

        if (!(err instanceof FilesError && err.actualFiles < 1)) {
          msg = {text: "app.import_export.error_opening_file", interpolateParams: {msg: err.message}};
        } else if (err.actualFiles > 1) {
          msg = {text: "app.import_export.error_opening_too_many_files"};
        }

        if (msg) {
          this.snackBar.open(
            this.translateService.instant(msg.text, msg.interpolateParams),
            this.translateService.instant("app.import_export.error_panel_retry"), {
              duration: 20_000,
              panelClass: "error-bg"
            }).onAction().pipe(
            first()
          ).subscribe(() => this.import());
        } else {
          console.error(err);
        }
      },
      next: content => {
        this.data = content;
        this.storageService.store(this.data);

        this.snackBar.open(
          this.translateService.instant("app.import_export.successfully_imported"),
          this.translateService.instant("app.import_export.snackbar_close"),
          {
            duration: 20_000,
            panelClass: "success-bg"
          }
        );
      }
    });
  }
}
