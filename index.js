var fs = require('fs');
var Handlebars = require('handlebars');
var parse = require('date-fns/parse')
var isValid = require('date-fns/is_valid')
var formatDate = require('date-fns/format')

Handlebars.registerHelper('friendlyDate', function(datestamp) {
  var date = parse(datestamp);
  return isValid(date) ? formatDate(date, 'Do MMM YYYY') : datestamp
});

function render(resume) {
  var tpl = fs.readFileSync(__dirname + '/src/resume.hbs', 'utf-8');
  return Handlebars.compile(tpl)({
    resume: resume
  });
}

module.exports = {
  render: render
};
