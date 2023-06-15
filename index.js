const fs = require('fs');
const Handlebars = require('handlebars');
const parse = require('date-fns/parse');
const formatDate = require('date-fns/format');

Handlebars.registerHelper('friendlyDate', function(datestamp) {
  const date = parse(datestamp);
  return datestamp ? formatDate(date, 'Do MMM YYYY') : 'present';
});

function render(resume) {
  const tpl = fs.readFileSync(__dirname + '/src/resume.hbs', 'utf-8');
  return Handlebars.compile(tpl)({
    resume: resume
  });
}

module.exports = {
  render: render
};
