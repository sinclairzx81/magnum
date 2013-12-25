# magnum templates

A easy to use, general purpose template engine for nodejs. 

layout.html
```html
<html>
	<head>
		@section header
	</head>
	<body>
		@section body
	</body>
</html>
```

view.html
```html
@import 'layout.html'

@section header {
	<title>@(context.title)</html>
}

@section body {
	<h1>Welcome</h1>
}
```
app.js
```javascript
var magnum = require('magnum')

var html = magnum.render('./view.html, { title: 'my page'})

console.log(html)
```
outputs:
```html
<html>
	<head>
		<title>my page</html>
	</head>
	<body>
		<h1>Welcome</h1>
	</body>
</html>
```


### install

	npm install magnum

### example

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


