import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {AppPageRoutingModule} from "./app-page-routing.module";
import {AppPageComponent} from "./app-page.component";
import {QuestionsModule} from "../../questions/questions.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {LocalStorageStorageService, StorageService} from "@shared";
import {QuestionFormControlFactory} from "../../questions/shared/questionFormControlFactory";
import {DefaultQuestionFormControlFactory} from "../../questions/shared/defaultQuestionFormControlFactory";
import {ValidatorFactory} from "../../questions/shared/validatorFactory";
import {QuestionValidatorFactory} from "../../questions/shared/questionValidatorFactory";
import {MatButtonModule} from "@angular/material/button";
import {FormService} from "@shared/form-service/form.service";
import {WasmFormService} from "@shared/form-service/wasm-form.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {PdfDialogComponent} from "./pdf-dialog/pdf-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    AppPageComponent,
    PdfDialogComponent
  ],
  exports: [
    AppPageComponent
  ],
  imports: [
    CommonModule,
    AppPageRoutingModule,
    QuestionsModule,
    MatToolbarModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  providers: [
    {
      provide: StorageService,
      useClass: LocalStorageStorageService
    },
    {
      provide: QuestionFormControlFactory,
      useClass: DefaultQuestionFormControlFactory
    },
    {
      provide: ValidatorFactory,
      useClass: QuestionValidatorFactory
    },
    {
      provide: FormService,
      useClass: WasmFormService
    }
  ]
})
export class AppPageModule {
}
