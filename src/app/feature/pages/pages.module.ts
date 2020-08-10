import {NgModule} from "@angular/core";
import {MainPageComponent} from "./main-page/main-page.component";
import {SharedModule} from "../../shared/shared.module";
import {AboutPageComponent} from "./about-page/about-page.component";
import {AppBarModule} from "../app-bar/app-bar.module";
import {AppPageModule} from "./app-page/app-page.module";

@NgModule({
  declarations: [
    MainPageComponent,
    AboutPageComponent
  ],
  imports: [
    SharedModule,
    AppBarModule,
    AppPageModule
  ],
  exports: [
    MainPageComponent,
    AboutPageComponent
  ]
})
export class PagesModule {
}
