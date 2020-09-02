import {Component} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Bafoeg";

  constructor(translate: TranslateService, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg"));

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("de");

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use("de");

    const theme = localStorage.getItem("theme");
    if (theme) {
      this.setTheme(theme);
    }
  }

  public get isDarkMode(): boolean {
    return document.body.classList.contains("theme-dark");
  }


  public setTheme(theme: string) {
    document.body.classList.remove(...Array.from(document.body.classList).filter(x => x.startsWith("theme-")));
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }
}
