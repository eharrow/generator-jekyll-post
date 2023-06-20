"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const moment = require("moment");

jest.useFakeTimers('legacy');

describe("generator-jekyll-post:app", function () {
  beforeEach(() => {
    console.info("in here");

    const newLocal = path.join(__dirname, "../generators/app");
    console.info(`path: ${newLocal}`);

    return helpers
      .run(newLocal)
      .withPrompts({ title: "hello world", tags:"tag1,tag2"});
  });
  it('generates a project with require.js', function () {
    // Assert the file exist
    // assert the file uses AMD definition
  });

  it("creates files", function () {
      console.info("in here2");
      const kebabDate = moment(new Date()).format("YYYY-MM-DD");
      assert.file([`${kebabDate}-hello-world.md`]);


  });
});
