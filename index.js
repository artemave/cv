var fs = require('fs');
var Handlebars = require('handlebars');
var formatDate = require('date-fns/format')

Handlebars.registerHelper('friendlyDate', function(datestamp) {
  var date = new Date(datestamp);
  return formatDate(date, 'Do MMM YYYY');
});

function render(resume) {
  var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  return Handlebars.compile(tpl)({
    resume: resume
  });
}

module.exports = {
  render: render
};
