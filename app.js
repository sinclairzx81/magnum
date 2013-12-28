var magnum = require('./bin/index.js')

var template = magnum.compile('./template.html');

var output = template.render()

console.log(output)