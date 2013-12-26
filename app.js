var magnum = require('./bin/index.js')

var template = magnum.compile('./template.html');

var html = template.render()

console.log(html)