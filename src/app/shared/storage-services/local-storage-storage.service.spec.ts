import {TestBed} from "@angular/core/testing";

import {StorageService} from "./storage.service";
import {LocalStorageStorageService} from "@shared/storage-services/local-storage-storage.service";
import {Dict} from "@shared";

describe("LocalStorageStorageService", () => {
  let service: LocalStorageStorageService;
  let stubStore: Dict;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [{provide: StorageService, useClass: LocalStorageStorageService}]});
    service = TestBed.inject(StorageService);

    stubStore = {};
    spyOn(localStorage, "getItem").and.callFake(key => stubStore[key]);
    spyOn(localStorage, "setItem").and.callFake((key, value) => stubStore[key] = value);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should store and load the simple data", () => {
    const data = {asd: 1, dfg: 2};
    service.store(data);
    const actual = service.restore();
    expect(actual).toEqual(data);
  });

  it("should store and load the nested data", () => {
    const data = {asd: 1, dfg: 2, qwe: [123, 123, 345], rty: {uio: [1, 2, 3]}};
    service.store(data);
    const actual = service.restore();
    expect(actual).toEqual(data);
  });
});
