import {PrefixPipe} from "./prefix.pipe";

describe("PrefixPipe", () => {
  it("create an instance", () => {
    const pipe = new PrefixPipe();
    expect(pipe).toBeTruthy();
  });
  it("should do return only the prefix on invalid values", () => {
    const pipe = new PrefixPipe();
    expect(pipe.transform(null, "prefix")).toEqual("prefix");
    expect(pipe.transform(undefined, "prefix")).toEqual("prefix");
  });
  it("should prefix strings", () => {
    const pipe = new PrefixPipe();
    expect(pipe.transform("", "prefix.")).toEqual("prefix.");
    expect(pipe.transform("asd", "prefix.")).toEqual("prefix.asd");
  });
  it("should do nothing for empty arrays", () => {
    const pipe = new PrefixPipe();
    expect(pipe.transform([], "prefix.")).toEqual([]);
  });
  it("should prefix string arrays", () => {
    const pipe = new PrefixPipe();
    expect(pipe.transform(["", "asd"], "prefix.")).toEqual(["prefix.", "prefix.asd"]);
  });
});
