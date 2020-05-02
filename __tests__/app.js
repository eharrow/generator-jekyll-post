"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const moment = require("moment");

describe("generator-jekyll-post:app", () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({ title: "hello world" });
  });

  it("creates files", () => {
    const kebabDate = moment(new Date()).format("YYYY-MM-DD");
    assert.file([`${kebabDate}-hello-world.md`]);
  });
});
