﻿![](https://raw.github.com/sinclairzx81/magnum/master/logo.png)

A fast, easy to use, general purpose template view engine for nodejs.

### install

	npm install magnum

### contents
* [overview](#overview)
* [example](#example)
* [api](#api)
	* [render](#render)
	* [compile](#compile)
	* [context](#context)
* [syntax](#syntax)
	* [expressions](#expressions)
	* [if statements](#if)
	* [for statements](#for)
	* [comments](#commentblock)
	* [code blocks](#codeblock)
* [layouts](#layouts)
	* [import](#import)
	* [render](#render)
* [express](#express)

<a name='overview' />
## overview

Magnum is a general purpose logic driven templating engine for nodejs developers. Magnum templates allow developers to easily script 
complex view logic with a javascript like syntax. Magnum focuses on being general purpose to enable developers can leverage it for 
code generation, html templates, xml or other niche template scenarios.

Inspired by Microsoft Razor

<a name='example' />
## example

The following is a quick example demonstrating rendering a template.

#### layout.html
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

#### view.html
```html

@import 'layout.html'

@section header {

	<title>@(context.title)</html>
}

@section body {

	<h1>Welcome</h1>
}
```

#### app.js
```javascript
var magnum = require('magnum')

var context = { title: 'my page'}

var html = magnum.render('./view.html', context)

console.log(html)
```

#### outputs

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
## api

The following outlines magnums methods.

<a name='compile' />
### compile

The compile() method compiles the template file and returns a template object. 

```javascript

var magnum   = require('magnum')

var template = magnum.compile('./view.html')  // store for later

//...later

var context = {title: 'my page'}

var html     = template.render(context) // render 

console.log(html)
```

<a name='render' />
### render

To quickly compile and render a view, call the magnum.render() method.

```javascript
var magnum = require('magnum')

var output = magnum.render('./view.html')

```

### context

When calling render() on a template (or via magnum itself), you can optionally pass a data context object to be rendered. 
Magnum encapulates all data passed on the "context"
object which is passed to magnum template on the render() method. Consider the following..

#### template.html
```html

<p>Hi @(context.name)</p>

<ul>

	@for(var i = 0; i < context.fruits.length; i++) {

		<li>@(context.fruits[i])</li>
	}

</ul>
```

#### app.js
```javascript

var magnum   = require('magnum')

var context = {name   : 'dave', 
		       fruits : ['apples', 
						 'oranges', 
						 'kiwifruit', 
						 'mangos', 
						 'grapes' ]}

var html = magnum.render('./template.html', context)
```

the context can be accessed in the following way...



<a name='syntax' />
## syntax

The following syntax is available inside magnum templates.

<a name='expressions' />
### expressions

The expression syntax allows a user to emit the value within. The following are examples. 

```
@* strings *@
@('hello world')

@* numbers *@
@(123)

@* conditions: displays false) *@
@(10 > 20)

@* ternary: displays 'cat' *@
@(true ? 'cat' : 'dog')

@* variables *@
@(myvariable)

@* functions: displays 'hello world' *@
@{ var message = function() { return 'hello world' } }

@(message())

```

<a name='if' />
### if statement

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
### for statement

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
### code

code blocks can be useful for adding template side rendering logic.

```
@{
	var message = 'hello'
}

@(message)
```

<a name='commentblock' />
### comments
```
@*
	this comment will not be rendered!
*@
```

<a name="template_layouts_and_sections" />
### layouts and sections

Mangum supports layouts and sections. This section describes how to use them.

### import

Use the import statement to have one template inheriate from another. This will allow the child template to (optionally) override the 
sections of the parent. 

#### layout.html
layout.html will be the parent template, here we define three sections.. header, body and footer. 

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

#### view.html
Inside view.html, we inheriate from layout.html with the import keyword. Inside view.html, we define sections for header and body. Note that
the default content for the footer not overridden. If the child template does not override a parents section, the parents section will be used
instead.

```html
@import 'layout.html'

@section header {

	<title>@(context.title)</html>
}

@section body {

	<h1>Welcome</h1>
}
```

### render

Magnum templates allow the user to render snippets of content in place. The following renders a template named navigation.html in place. 

#### navigation.html
```html

	<ul>

		<li><a href='#'>home</a></li>

		<li><a href='#'>about</a></li>

		<li><a href='#'>contact</a></li>

	</ul>
```

#### layout.html
```html
<html>

	<head>

	</head>

	<body>

		@render 'navigation.html'

		@section content

	</body>

</html>
```

<a name='express' />
##express
Magnum does not provide any built in middleware for specifically for express, however it is trivial for developers to 'snap in' utility 
methods on the express response to acheive desireable results. consider the following...

```javascript

var express = require('express')

var magnum  = require('magnum')

//----------------------------------------------
// setup: create and apply render method
//----------------------------------------------

var app     = express()

app.use(function (req, res, next) {

    res.render = function (path, context) {

        var output = magnum.render(path, context)

        res.setHeader('Content-Type', 'text/html')

        res.setHeader('Content-Length', Buffer.byteLength(output))

        res.send(output)
    }
	
    next()
})


//----------------------------------------------
// render the template...
//----------------------------------------------

app.get('/', function(req, res) {
	
	res.render('./index.html') 
})
```

