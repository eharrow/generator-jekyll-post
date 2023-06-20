"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const moment = require("moment");
const path = require("path");

/**
 * This generator prompts for the minimum metadata that a jekyll post requires before passing through
 * ejs and the markdown template.
 */
module.exports = class extends Generator {
  initializing() {
    this.env.adapter.promptModule.registerPrompt("datetime", require("inquirer-datepicker-prompt"));
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the spectacular ${chalk.red("generator-jekyll-post")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "title",
        message: "Your post title?",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "tags",
        message: "Your post tags separated by commas?",
      },
      {
        type: "confirm",
        name: "comments",
        message: "Would you like to enable comments?",
        default: false
      },
      {
        type: "datetime",
        name: "date",
        message: 'Pick the post date',
        format: ['yyyy', '-', 'mm', '-', 'dd']
      },
      {
        type: "list",
        name: "copy",
        message: "Would you like to generate the file in the following directory?",
        choices: ["_drafts", "_posts", "drop it here"],
        default: "_drafts"
      },
    ];

    this.answers  = await this.prompt(prompts);
  }

  writing() {
    this.log("post title", this.answers.title);
    const csvToArray = (data, delimiter = ',', omitFirstRow = false) =>
      data
        .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
        .split('\n')
        .map(v => v.split(delimiter));

    const toKebabCase = str =>
      str &&
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join("-");

    const CSVToString = (acc, item) => {
      return `${acc} ${item}`
    }

    const toTitleCase = str =>
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
        .join(' ');

    const kebabTags = csvToArray(this.answers.tags)[0].map((item) => toKebabCase(item)).reduce(CSVToString);
    const kebabDate = moment(this.answers.date).format("YYYY-MM-DD");
    const kebabPostTitle = toKebabCase(this.answers.title);
    const title = toTitleCase(this.answers.title);
    const dir = this.answers.copy === "drop it here" ? "" : this.answers.copy + path.sep;

    this.fs.copyTpl(
      this.templatePath("template-post.md"),
      this.destinationPath(`${dir}${kebabDate}-${kebabPostTitle}.md`),
      {
        title: title,
        tags: kebabTags,
        comments: this.answers.comments
      }
    );
  }
};
