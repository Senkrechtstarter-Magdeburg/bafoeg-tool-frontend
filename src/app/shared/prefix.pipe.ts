import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "prefix"
})
export class PrefixPipe implements PipeTransform {

  transform(value: string, prefix: string): string;
  transform(value: string[], prefix: string): string[];
  transform(value: string | string[], prefix: string): string | string[] {
    if (typeof value == "string") {
      return prefix + value;
    } else if (Array.isArray(value)) {
      return value.map(e => prefix + e);
    }
    return prefix;
  }

}
