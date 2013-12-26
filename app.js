var magnum = require('./bin/index.js')

//---------------------------------------
// parse on the fly
//---------------------------------------


//---------------------------------------
// compile and save
//---------------------------------------

var template = magnum.compile('./template.html', {a: 10});

var html = template.render({title: 'my page', method: function() {return 'hello there'}})

console.log(html)