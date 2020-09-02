import {NgModule} from "@angular/core";
import {MainPageComponent} from "./main-page/main-page.component";
import {SharedModule} from "@shared";
import {AboutPageComponent} from "./about-page/about-page.component";
import {AppBarModule} from "../app-bar/app-bar.module";
import {AppPageModule} from "./app-page/app-page.module";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    MainPageComponent,
    AboutPageComponent
  ],
  imports: [
    SharedModule,
    AppBarModule,
    AppPageModule,
    MatButtonModule,
    RouterModule
  ],
  exports: [
    MainPageComponent,
    AboutPageComponent
  ]
})
export class PagesModule {
}
