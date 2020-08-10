import {KeysPipe} from "./keys.pipe";

describe("KeysPipe", () => {
  it("create an instance", () => {
    const pipe = new KeysPipe();
    expect(pipe).toBeTruthy();
  });
  it("should extract nothing from an empty object", () => {
    const pipe = new KeysPipe();
    expect(pipe.transform({})).toEqual([]);
  });
  it("should extract nothing from invalid object", () => {
    const pipe = new KeysPipe();
    expect(pipe.transform(null)).toEqual([]);
    expect(pipe.transform(undefined)).toEqual([]);
    expect(pipe.transform("{}")).toEqual([]);
  });

  it("should extract keys from object", () => {
    const pipe = new KeysPipe();
    const keys = ["a", "b", "!45"];
    expect(pipe.transform({[keys[0]]: 1, [keys[1]]: [], [keys[2]]: []})).toEqual(keys);
  });
});
