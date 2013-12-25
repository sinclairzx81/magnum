var magnum = require('./bin/index.js')

//console.log(magnum.render('./template.txt'))

var m = magnum.compile('./template.txt', {a: 10});

console.log(m.toString())