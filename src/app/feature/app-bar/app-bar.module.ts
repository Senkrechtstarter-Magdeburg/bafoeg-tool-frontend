import {NgModule} from "@angular/core";
import {AppBarComponent} from "./app-bar.component";
import {SharedModule} from "@shared";
import {MatToolbarModule} from "@angular/material/toolbar";
import {PortalModule} from "@angular/cdk/portal";
import {AppBarElementDirective} from "./app-bar-element.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    AppBarComponent,
    AppBarElementDirective
  ],
  imports: [
    SharedModule,
    MatToolbarModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  exports: [
    AppBarComponent,
    AppBarElementDirective
  ]
})
export class AppBarModule {
}
