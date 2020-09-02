import {Pipe, PipeTransform} from "@angular/core";

interface Hidable {
  isHidden?: (context: { [key: string]: any }) => boolean;
}

@Pipe({
  name: "visible"
})
export class VisiblePipe implements PipeTransform {

  transform<T extends Hidable>(value: T[], context: { [key: string]: any }): T[];
  transform<T extends Hidable>(value: T, context: { [key: string]: any }): boolean;
  transform<T extends Hidable>(value: T | T[], context: { [key: string]: any }): boolean | T[] {
    if (Array.isArray(value)) {
      return value.filter(val => !(val.isHidden && val.isHidden(context)));
    }

    return value.isHidden(context);
  }

}
