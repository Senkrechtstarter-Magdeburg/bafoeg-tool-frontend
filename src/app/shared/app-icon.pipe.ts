import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Pipe({
  name: "appIcon"
})
export class AppIconPipe implements PipeTransform {


  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: string): SafeResourceUrl {
    return `/assets/icons/${value}.png`;
  }

}
