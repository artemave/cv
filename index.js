var fs = require('fs');
var Handlebars = require('handlebars');

function render(resume) {
  var tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
  return Handlebars.compile(tpl)({
    resume: resume
  });
}

module.exports = {
  render: render
};
