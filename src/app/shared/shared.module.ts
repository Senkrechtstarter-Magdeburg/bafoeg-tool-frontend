import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {KeysPipe} from "./keys.pipe";
import {PrefixPipe} from "./prefix.pipe";
import {AppIconPipe} from "./app-icon.pipe";

@NgModule({
  declarations: [KeysPipe, PrefixPipe, AppIconPipe],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    KeysPipe,
    PrefixPipe,
    AppIconPipe
  ]
})
export class SharedModule {
}
