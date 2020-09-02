import {QuestionContextInternal} from "@shared";

describe("QuestionContextInternal", () => {
  it("should allow access to the raw element", () => {
    const data = {};
    const context = new QuestionContextInternal(data, "def");
    expect(context.raw).toEqual(data);
  });

  it("should extract all default namespaces", () => {
    const context = new QuestionContextInternal({}, "namespace1.namespace2.namespace3.namespace4");
    const expected = [
      "namespace1.namespace2.namespace3.namespace4",
      "namespace1.namespace2.namespace3",
      "namespace1.namespace2",
      "namespace1",
      "",
    ];
    const {namespaces: actual} = context.extractPossibleNamespacesAndId("id");

    expect(actual).toEqual(expected);
  });

  it("should extract all namespaces", () => {
    const context = new QuestionContextInternal({}, "namespace1.namespace2");
    const expected = [
      "namespace1.namespace2.namespace2.namespace3.namespace4",
      "namespace1.namespace2.namespace3.namespace4",
      "namespace2.namespace3.namespace4",
    ];
    const {namespaces: actual} = context.extractPossibleNamespacesAndId("namespace2.namespace3.namespace4.id");

    expect(actual).toEqual(expected);
  });

  it("should get values from the same namespace", () => {
    const data = {"namespace1.namespace2.namespace3.field": 1};
    const context = new QuestionContextInternal(data, "namespace1.namespace2.namespace3");
    expect(context.get("field")).toEqual(data["namespace1.namespace2.namespace3.field"]);
  });

  it("should get values by complete namespace", () => {
    let field = "namespace1.namespace2.namespace3.field";
    let data = {[field]: 1};
    let context = new QuestionContextInternal(data, "");
    expect(context.get(field)).toEqual(data[field]);

    field = "namespace1.namespace2.namespace3.field";
    data = {[field]: 1};
    context = new QuestionContextInternal(data, "namespace1.namespace2.namespace3.namespace4");
    expect(context.get(field)).toEqual(data[field]);

    field = "namespace1.namespace2.namespace3.field";
    data = {[field]: 1};
    context = new QuestionContextInternal(data, "namespace9.namespace0.namespace7.namespace8");
    expect(context.get(field)).toEqual(data[field]);
  });

  it("should get values by partial namespace", () => {
    let field = "namespace1.namespace2.namespace3.field";
    let data = {[field]: 1};
    let context = new QuestionContextInternal(data, "namespace1.namespace2");
    expect(context.get("namespace3.field")).toEqual(data[field]);

    field = "namespace1.namespace2.namespace3.field";
    data = {[field]: 1};
    context = new QuestionContextInternal(data, "namespace1.namespace2.namespace3.namespace4");
    expect(context.get("namespace3.field")).toEqual(data[field]);

    field = "namespace1.namespace2.namespace3.field";
    data = {[field]: 1};
    context = new QuestionContextInternal(data, "namespace1.namespace2.namespace3.namespace4.namespace5");
    expect(context.get("namespace3.field")).toEqual(data[field]);
  });


});
