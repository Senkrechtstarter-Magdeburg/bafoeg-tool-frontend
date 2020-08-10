import {Pipe, PipeTransform} from "@angular/core";

interface Hidable {
  isHidden?: (context: { [key: string]: any }) => boolean;
}

@Pipe({
  name: "visible"
})
export class VisiblePipe implements PipeTransform {

  transform(value: Hidable[], context: { [key: string]: any }): Hidable[];
  transform(value: Hidable, context: { [key: string]: any }): boolean;
  transform(value: Hidable | Hidable[], context: { [key: string]: any }): boolean | Hidable[] {
    if (Array.isArray(value)) {
      return value.filter(val => !(val.isHidden && val.isHidden(context)));
    }

    return value.isHidden(context);
  }

}
