import {Component, Inject, OnInit} from "@angular/core";
import {FormService} from "@shared/form-service/form.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Questionary} from "@models";
import {Dict} from "@shared";
import {catchError, filter, last, map, startWith} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: "app-pdf-dialog",
  templateUrl: "./pdf-dialog.component.html",
  styleUrls: ["./pdf-dialog.component.scss"]
})
export class PdfDialogComponent implements OnInit {

  public error$: Observable<any>;
  public loading$: Observable<number | boolean>;
  public links$: Observable<{ name: string, link: SafeUrl }[]>;

  constructor(
    public ref: MatDialogRef<PdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionary: Questionary, data: Dict },
    private formService: FormService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    const fill$ = this.formService.fill(this.data.questionary, this.data.data);
    this.links$ = fill$
      .pipe(
        last(),
        map(x => x.forms),
        map(forms => forms.map(form => {
          const url = window.URL.createObjectURL(new Blob([form.buffer], {type: "application/pdf"}));
          const link = this.sanitizer.bypassSecurityTrustUrl(url);

          return ({
            name: form.formName,
            link
          });
        })),
      );

    this.error$ = this.links$.pipe(filter(() => false), catchError(e => of(e)));
    this.loading$ = fill$.pipe(
      map(({progress}) => progress),
      startWith(0),
      map(x => Math.max(x, 10)),
      catchError(() => of(false)));
  }

}
