import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {Questionary} from "@models/questions";
import {SafeSubscriptionComponent} from "@shared/safe-subscription-component";
import {StorageService} from "@shared";
import {MatDialog} from "@angular/material/dialog";
import {FileExchangeService, FilesError} from "@shared/file-exchange.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {QuestionaryService} from "@shared/questionary.service";
import {ROUTE_DATA_QUESTIONARY} from "./routing-params";

@Component({
  selector: "app-app-page",
  templateUrl: "./app-page.component.html",
  styleUrls: ["./app-page.component.scss"]
})
export class AppPageComponent extends SafeSubscriptionComponent implements OnInit {

  public questionary$: Observable<Questionary>;

  public window = window;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public storageService: StorageService,
              private dialog: MatDialog,
              private fileExchangeService: FileExchangeService,
              private translateService: TranslateService,
              private questionaryService: QuestionaryService,
              private snackBar: MatSnackBar) {
    super();
  }


  public export() {
    const date = new Date();

    this.fileExchangeService.downloadJSON(this.questionaryService.data,
      `${this.translateService.instant(
        "app.import_export.export_data_file_name",
        {date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`})}.json`);
  }


  public save(questionary: Questionary) {
    this.questionaryService.showPdfDialog(questionary);
  }


  public restore() {
    this.questionaryService.updateData(this.storageService.restore());
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
        this.questionaryService.updateData(content);
        this.storageService.store(this.questionaryService.data);

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

  public ngOnInit(): void {
    this.restore();

    this.questionary$ = this.activatedRoute.data.pipe(map(data => data[ROUTE_DATA_QUESTIONARY] as Questionary));

  }
}
