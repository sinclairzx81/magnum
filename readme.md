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

var html = magnum.render('./view.html', { title: 'my page'})

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

### api

#### render

compiles and renders the output.

```javascript
var magnum = require('magnum')

var output = magnum.render('./view.html')

```

#### compile

compiles the template and returns a template object. users can use this compile once, and prevent extra reads to disk.

```javascript

var magnum   = require('magnum')

var template = magnum.compile('./view.html') // save for later

var html     = template.render({title: 'my page'})

console.log(html)
```

