import {Dict} from "@shared/dict";

export abstract class StorageService {
  abstract store(data: Dict);

  abstract restore(): Dict;
}

