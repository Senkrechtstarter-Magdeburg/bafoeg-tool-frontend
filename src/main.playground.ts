import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";
import {Component, NgModule} from "@angular/core";
import {PlaygroundModule} from "angular-playground";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {CustomMissingTranslationHandler} from "./app/custom-missing-translation-handler";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

PlaygroundModule
  .configure({
    selector: "app-root",
    overlay: false,
    modules: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        missingTranslationHandler: {
          provide: MissingTranslationHandler,
          useClass: CustomMissingTranslationHandler
        }
      }),
    ],
  });

@Component({
  selector: "playground-app",
  template: "<playground-root></playground-root>"
})
export class AppComponent {
}


@NgModule({
  imports: [
    BrowserModule,
    PlaygroundModule,

  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
