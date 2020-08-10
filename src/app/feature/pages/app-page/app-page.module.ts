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


@NgModule({
  declarations: [
    AppPageComponent
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
    }
  ]
})
export class AppPageModule {
}
