"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const moment = require("moment");

/**
 * This generator prompts for the minimum metadata that a jekyll post requires before passing through
 * ejs and the markdown template.
 */
module.exports = class extends Generator {
  prompting() {
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
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // this.log("post title", this.props.title);

    const toKebabCase = str =>
      str &&
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join("-");
    const kebabDate = moment(new Date()).format("YYYY-MM-DD");
    const kebabPostTitle = toKebabCase(this.props.title);

    this.fs.copyTpl(
      this.templatePath("template-post.md"),
      this.destinationPath(`${kebabDate}-${kebabPostTitle}.md`),
      {
        title: this.props.title,
        tags: this.props.tags,
        comments: this.props.comments
      }
    );
  }

  install() {
    //this.installDependencies();
  }
};
