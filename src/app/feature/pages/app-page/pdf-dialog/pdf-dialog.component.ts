import {Component, Inject, OnInit} from "@angular/core";
import {FormService} from "@shared/form-service/form.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Questionary} from "@models";
import {Dict} from "@shared";
import {catchError, filter, first, map, mapTo, startWith} from "rxjs/operators";
import {merge, Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: "app-pdf-dialog",
  templateUrl: "./pdf-dialog.component.html",
  styleUrls: ["./pdf-dialog.component.scss"]
})
export class PdfDialogComponent implements OnInit {

  public link$: Observable<SafeUrl>;
  public error$: Observable<any>;
  public loading$: Observable<boolean>;

  constructor(
    public ref: MatDialogRef<PdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionary: Questionary, data: Dict },
    private formService: FormService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.link$ = this.formService.fill(this.data.questionary, this.data.data)
      .pipe(
        first(),
        map(data => window.URL.createObjectURL(new Blob([data], {type: "application/pdf"}))),
        map(link => this.sanitizer.bypassSecurityTrustUrl(link))
      );

    this.error$ = this.link$.pipe(filter(() => false), catchError(e => of(e)));
    this.loading$ = merge(this.link$).pipe(catchError(() => of(false)), mapTo(false), startWith(true));
  }

}
