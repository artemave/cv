const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const parseISO = require("date-fns/parseISO");
const formatDate = require("date-fns/format");

Handlebars.registerHelper("friendlyDate", function (datestamp) {
  if (datestamp) {
    const date = parseISO(datestamp);
    return formatDate(date, "do MMM yyyy");
  }
  return "present";
});

function render(resume) {
  const tpl = fs.readFileSync(
    path.join(__dirname, "src", "resume.hbs"),
    "utf-8"
  );
  const compile = Handlebars.compile(tpl);
  return compile({ resume });
}

module.exports = {
  render,
};
