# magnum templates

A easy to use, general purpose template engine for nodejs. 

### install

	npm install magnum

### contents
* [overview](#overview)
* [api](#api)
	* [render](#render)
	* [compile](#compile)
	* [context](#context)
* [syntax](#syntax)
	* [expressions](#expressions)
	* [if statements](#if)
	* [for statements](#if)
	* [comments](#comments)
	* [code blocks](#code blocks)
* [layouts](#layouts)
	* [import](#import)
	* [render](#render)

<a name='overview' />
### overview

The following outlines a layout, view and code required to render the output. 

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



<a name='api' />
### api

The following are the methods exposed by the magnum api.

<a name='render' />
#### render

compiles and renders the output.

```javascript
var magnum = require('magnum')

var output = magnum.render('./view.html')

```

<a name='compile' />
#### compile

compiles the template and returns a template object. users can use this compile once, and prevent extra reads to disk.

```javascript

var magnum   = require('magnum')

var template = magnum.compile('./view.html') // save for later

var html     = template.render({title: 'my page'})

console.log(html)
```

#### context

When calling render on a template, you can optionally pass data to this template to be rendered. Magnum encapulates this data in a context object which is passed
to each magnum template. Consider the following..

```javascript

var magnum   = require('magnum')

var context = {title: 'hello', numbers: [0, 1, 2, 3, 4]}

var html = magnum.render('./template.html', context)
```

can be used in the template in the following way...

template.html
```html

<span>@(context.title)</span>

<ul>
@for(var i = 0; i < context.numbers.length; i++) {
	<li>@(context.numbers[i])</li>
}
</ul>
```

refer to the syntax section for a list of valid template syntax.

<a name='syntax' />
### syntax

The following syntax is available inside magnum templates.

<a name='expressions' />
#### expressions

will emit the value contained.

```
@('hello world')

@(123)

@(some_variable)
```

<a name='if' />
#### if statement

if statments are supported.

```
@if(expression) {
	some content
}

@if(a > 10) {
	some content
}

@(user.loggedin) {
	<span>welcome</span>
}
```

<a name='for' />
#### for statement

the following for loops are supported.

```
@for(var i = i; i < 100; i++) {
	@(i)
}

@for(var n in list) {
	@(list[n])
}
```


<a name='codeblock' />
#### code blocks

code blocks can be useful for adding template side rendering logic.

```
@{
	var message = 'hello'
}

@(message)
```

<a name='comments' />
#### comments
```
@*
	this comment will not be rendered!
*@
```

<a name="template_layouts_and_sections" />
### layouts and sections

magnum templates support template inheritance and partials. T

#### import

Use the import statement to have one template inheriate from another. This will allow the child template to override the sections of the parent. 

##### layout.html
Layout is the parent template, here we define three sections, header, body and footer. note that the footer has some default content.

```html
<html>
	<head>
		@section header
	</head>
	<body>
		@section body
		@section footer {
			<span>copyright 2013</span>
		}
	</body>
</html>
```

##### view.html
Inside view.html, we inheriate from layout.html with the import keyword. Inside view.html, we define sections for header and body. Note that
the default content for the footer not overridden.

```html
@import 'layout.html'

@section header {
	<title>@(context.title)</html>
}

@section body {
	<h1>Welcome</h1>
}
```

note: if a section is not overridden, the parents content is used instead.

#### render

Magnum templates allow the user to 
