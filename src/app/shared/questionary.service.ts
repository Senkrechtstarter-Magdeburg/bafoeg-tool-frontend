import {Injectable} from "@angular/core";
import {Dict} from "./dict";
import {BehaviorSubject} from "rxjs";
import {QuestionaryFormGroup} from "../feature/questions/shared/questionaryFormGroup";
import {Questionary} from "@models";
import {PdfDialogComponent} from "../feature/pages/app-page/pdf-dialog/pdf-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class QuestionaryService<T = any> {

  private dataSource = new BehaviorSubject<Dict<T>>(null);

  constructor(private dialog: MatDialog) {
  }

  public get data$() {
    return this.dataSource.asObservable();
  }

  public get data(): Dict<T> {
    return this.dataSource.getValue();
  }

  public updateData(data: Dict<T>): void {
    this.dataSource.next(data);
  }

  public listenTo(formGroup: QuestionaryFormGroup) {
    formGroup.valueChanges.subscribe(this.dataSource);
  }

  public showPdfDialog(questionary: Questionary): MatDialogRef<PdfDialogComponent, { name: string, link: SafeUrl }[]> {
    return this.dialog.open(PdfDialogComponent, {
      data: {
        questionary,
        data: this.data
      }
    });
  }
}
