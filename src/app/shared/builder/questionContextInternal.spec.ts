import {QuestionContextInternal} from "@shared";

describe("QuestionContextInternal", () => {
  it("should allow access to the raw element", () => {
    const data = {};
    const context = new QuestionContextInternal(data, "def");
    expect(context.raw).toEqual(data);
  });

  it("should get values from the same namespace", () => {
    const data = {"namespace1.namespace2.namespace3.field": 1};
    const context = new QuestionContextInternal(data, "namespace1.namespace2.namespace3");
    expect(context.get("field")).toEqual(data["namespace1.namespace2.namespace3.field"]);
  });
});
