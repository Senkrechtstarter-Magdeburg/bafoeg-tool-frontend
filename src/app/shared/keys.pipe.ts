import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "keys"
})
export class KeysPipe implements PipeTransform {

  transform(value: { [key: number]: any } | { [key: string]: any }): string[] {
    if (!value || typeof value != "object") {
      return [];
    }
    return Object.keys(value);
  }

}
