import {Injectable} from "@angular/core";
import {fromEvent, merge, Observable, zip} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FileExchangeService {

  constructor() {
  }

  public downloadJSON(obj: object, fileName: string) {
    return this.downloadString(JSON.stringify(obj), fileName, "application/json");
  }

  public downloadString(str: string, fileName: string, fileType: string = "text") {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(str);
    return this.download(buffer, fileName, fileType);
  }

  public download(buffer: Uint8Array, fileName: string, type: string) {
    const url = window.URL.createObjectURL(new Blob([buffer], {type}));

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  }

  public uploadJsonMultiple<T extends object = object>(): Observable<T[]> {
    return this.upload(["json"]).pipe(
      map(contents => contents.map(content => new TextDecoder("utf-8").decode(content))),
      map(strings => strings.map(str => JSON.parse(str) as T))
    );
  }

  public uploadJson<T extends object = object>(): Observable<T> {
    return this.uploadJsonMultiple<T>().pipe(
      map(r => {
        if (r.length === 1) {
          return r[0];
        } else {
          throw new FilesError(r.length, 1);
        }
      })
    );
  }

  public upload(acceptedFileTypes: string[]): Observable<Uint8Array[]> {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileTypes.map(x => `.${x}`).join(", ");
    input.click();


    return fromEvent(input, "change", {once: true}).pipe(
      switchMap(e => {
        if (input.files.length <= 0) {
          throw new FilesError(input.files.length);
        }

        const results$ = Array.from(input.files).map(file => {
          const reader = new FileReader();


          const file$ = merge(
            fromEvent(reader, "load", {once: true}).pipe(map(load =>
              // @ts-ignore
              load.target.result as Uint8Array
            )),
            fromEvent(reader, "abort", {once: true}).pipe(map(r => {
              throw new FileLoadError(r);
            })),
            fromEvent(reader, "error", {once: true}).pipe(map(r => {
              throw new FileLoadError(r);
            })),
          );

          reader.readAsArrayBuffer(file);

          return file$;
        });
        return zip(...results$);
      }),
    );

  }
}

export class FilesError extends Error {

  constructor(public readonly actualFiles: number,
              public readonly expectedFiles?: number | undefined,
              message: string = `Expected ${expectedFiles ?? "some"} files but got ${actualFiles}!`) {
    super(message);
  }
}

export class FileLoadError extends Error {

  constructor(public info: any) {
    super("An error occurred while loading the file");
  }
}
