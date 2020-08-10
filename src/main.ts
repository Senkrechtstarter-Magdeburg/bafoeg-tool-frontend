import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {AppModule} from "./app/app.module";
import {environment} from "./environments/environment";
import * as runtimeUtil from "./app/runtime-util/translations";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const r = {...runtimeUtil};
for (const key in r) {
  if (r.hasOwnProperty(key)) {
    window[key] = r[key];
  }
}

