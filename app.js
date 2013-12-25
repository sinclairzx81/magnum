var magnum = require('./bin/index.js')

//---------------------------------------
// parse on the fly
//---------------------------------------

var html = magnum.render('./template.html', {title: 'my page'})

console.log(html)

//---------------------------------------
// compile and save
//---------------------------------------

var template = magnum.compile('./template.html', {a: 10});

var html = template.render({title: 'my page'})

console.log(html)


