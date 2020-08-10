import {FormGroup} from "@angular/forms";

export class CrossValidatingFormGroup extends FormGroup {

  public updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean }) {
    super.updateValueAndValidity(opts);

    for (const child in this.controls) {
      if (child in this.controls) {
        this.controls[child].updateValueAndValidity({onlySelf: true});
      }
    }
  }
}
