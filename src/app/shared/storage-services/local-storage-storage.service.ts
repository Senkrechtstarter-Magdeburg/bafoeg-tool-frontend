import {Injectable} from "@angular/core";
import {Dict} from "@shared/dict";
import {StorageService} from "@shared";

@Injectable()
export class LocalStorageStorageService implements StorageService {

  constructor() {
  }

  public store(data: Dict) {
    localStorage.setItem("data", JSON.stringify(data));
  }

  public restore(): Dict {
    return JSON.parse(
      localStorage.getItem("data") || "{}",
      function (this, key: string, value: any) {
        return typeof value ===
               "string" &&
               value.match(/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\d\Z/) ?
               new Date(value) :
               value;
      });
  }

  public clear() {
    localStorage.removeItem("data");
  }
}
