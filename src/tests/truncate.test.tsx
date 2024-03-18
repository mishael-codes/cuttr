import truncate from "../components/dashboard/truncate";

it("Should truncate to specified length with ellipsis", () => {
  expect(truncate("AltSchool Africa", 10)).toEqual("AltSchool...");
  expect(truncate("Hello World", 8)).toEqual("Hello W...");
});
