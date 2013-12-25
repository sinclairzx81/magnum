﻿/*--------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2013 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

module magnum {

    //---------------------------------------------------
    // Scope
    //---------------------------------------------------
    export class Declaration {

        public declarations:Declaration[];

        constructor(public type        : string,
                    
                    public start       : number, 

                    public length      : number,

                    public body_start  : number,
             
                    public body_length : number) {

              this.declarations = [];
        }
    }

    //---------------------------------------------------
    // Document
    //---------------------------------------------------
    export class Document extends magnum.Declaration {

        public filename : string;

        public content  : string;

        constructor(filename:string, content:string) {

            super('document', 0, content.length, 0, content.length);

            this.content  = content;

            this.filename = filename;

            var scanner = new magnum.Scanner(this, content);

            this.declarations = scanner.declarations;
        }
    }

    //---------------------------------------------------
    // Import
    //---------------------------------------------------

    export class ImportDeclaration extends magnum.Declaration {

        public filename : string;

        constructor(filename      : string,

                    start         : number, 
        
                    length        : number) {

            this.filename = filename;

            super('import', start, length, 0, 0);
        }
    }

    //---------------------------------------------------
    // Render
    //---------------------------------------------------

    export class RenderDeclaration extends magnum.Declaration {

        public filename : string;

        constructor(filename      : string,

                    start         : number, 
        
                    length        : number) {

            this.filename = filename;

            super('render', start, length, 0, 0);
        }
    }

    //---------------------------------------------------
    // Section
    //---------------------------------------------------
    export class SectionDeclaration extends magnum.Declaration {

        public name : string;

        constructor(content     : string,
                    
                    name        : string,

                    start       : number,
        
                    length      : number, 

                    body_start  : number, 

                    body_length : number) {

            this.name = name;

            super('section', start, length, body_start, body_length);

            var scanner = new magnum.Scanner(this, content);

            this.declarations = scanner.declarations;
        }
    }

    //---------------------------------------------------
    // For
    //---------------------------------------------------
    export class ForDeclaration extends magnum.Declaration {

        public expression :   string;

        constructor(content     : string,
                
                    expression  : string,

                    start       : number, 

                    length      : number, 

                    body_start  : number, 

                    body_length : number) {

            this.expression = expression;

            super('for', start, length, body_start, body_length);

            var scanner = new magnum.Scanner(this, content);

            this.declarations = scanner.declarations;
        }
    }

    //---------------------------------------------------
    // If
    //---------------------------------------------------
    export class IfDeclaration extends magnum.Declaration {

        public expression :   string;

        constructor(content     : string, 
            
                    expression  : string,

                    start       : number, 

                    length      : number, 

                    body_start  : number, 

                    body_length : number) {

            this.expression = expression;

            super('if', start, length, body_start, body_length);

            var scanner = new magnum.Scanner(this, content);

            this.declarations = scanner.declarations;
        }
    }
    
    //---------------------------------------------------
    // Code
    //---------------------------------------------------
    export class CodeDeclaration extends magnum.Declaration {

        constructor(content     : string,

                    start       : number, 

                    length      : number,
                    
                    body_start  : number,
                    
                    body_length : number) {

            super('code', start, length, body_start, body_length);
        }        
    }
    
    //---------------------------------------------------
    // Expression
    //---------------------------------------------------
    export class ExpressionDeclaration extends magnum.Declaration {

        public expression :   string;

        constructor(content    : string, 
            
                    expression : string,

                    start      : number, 

                    length     : number) {

            this.expression = expression;

            super('expression', start, length, 0, 0);
        }        
    }

    //---------------------------------------------------
    // Comment
    //---------------------------------------------------
    export class CommentDeclaration    extends magnum.Declaration {
        
        public comment :   string;

        constructor(content     : string, 
            
                    comment     : string,

                    start       : number, 

                    length      : number) {

            this.comment = comment;

            super('comment', start, length, 0, 0);
        } 
    }

    //---------------------------------------------------
    // Content
    //---------------------------------------------------
    export class ContentDeclaration extends magnum.Declaration {

        constructor(start         : number, 

                    length        : number) {
            
            super('content', start, length, 0, 0);
        }    
    }

    //---------------------------------------------------
    // Scanner
    //---------------------------------------------------
    
    export class Scanner {

        public declarations : magnum.Declaration[];

        constructor(public declaration : magnum.Declaration, public content : string) {
            
            this.declarations = [];

            this.scan();
        }

        private max             () : number {
            
            return (this.declaration.body_start + this.declaration.body_length);
        }

        private read            (start:number, length:number) : string {
            
            return this.content.substr(start, length);
        }
        
        private advance         (index:number) : number {

            // 48 - 57  - numeric 
            // 65 - 122 - alpha
            // 32       - space
            // 64       - @
            // 123      - {
            // 125      - }  
            // 10       - \r      
            // 13       - \n
            // 40       - (
            // 41       - )
            // 39       - '
            // 34       = "
            // 42       = *

            for(var i = index; i < this.max(); i++) {
            
                var code = this.content.charCodeAt(i);

                if((code >= 48 && code <= 57) || 
                   (code >= 65 && code <= 122) || 
                    code == 123 || 
                    code == 125 || 
                    code == 64  ||
                    code == 40  ||
                    code == 41  ||
                    code == 34  ||
                    code == 39) {
                    return i;
                }
            }

            return this.max();
        }

        private advanceto       (index:number, code:number) : number {

            for(var i = index; i < this.max(); i++) {
                
                var _code = this.content.charCodeAt(i);

                if(_code == code) {
                    
                    return (i);
                }
            }

            return this.max();
        }

        private scan_section    (index:number) : number {
            
            var name          = '';
            
            var start         = index;
            
            var length        = 0;
            
            var body_start    = 0;
            
            var body_length   = 0;
            
            var cursor       = (index + 8);

            // ensure there is a space between 
            // @section and its name. otherwise return.
            if(this.content.charCodeAt(cursor) != 32) {

                return index;
            }
            
            // ensure that the next character is not a 
            // opening brace, as @sections require names.
            // if this is the case, return.
            cursor = this.advance(cursor);
            
            if(this.content.charAt(cursor) == '{') {
                
                return index;
            }

            // scan ahead to obtain the section name.
            // once found, update the cursor. terminate
            // return the index if we reach the end 
            // of the scope first.
            for(var i = cursor; i < this.max(); i++) {

                var code = this.content.charCodeAt(i);

                if(i == (this.max() - 1)) {

                    return index;
                }

                if((code < 48 || code > 57) && (code < 65 || code > 122)) {
                    
                    name = this.read(cursor, i - cursor);
                     
                    cursor = i;

                    break;
                }
            }
            
            // if the next char is 'not' a open body token, we
            // treat this as a bodyless section declartion.
            // we add the section and return with the end 
            // compoents set to the cursor.

            var peek = this.advance(cursor);
            
            if(this.content.charAt(peek) != '{') {
                
                var declaration = new magnum.SectionDeclaration(this.content, name, start, (cursor - index), 0, 0);

                this.declarations.push(declaration);

                return cursor;
            }

            // scan ahead looking for the body content. keep
            // a count of the opening and closing braces, and
            // only completing when the braces return to 0.

            var count = 0;

            for(var i = cursor; i < this.max(); i++) {
            
                var ch = this.content.charAt(i);

                if(ch == '{') {

                    if(count == 0) {

                        body_start = i + 1;
                    }

                    count += 1;
                }

                if(ch == '}') {
                
                    count -= 1;

                    if(count == 0) {
                    
                        body_length = (i - body_start)

                        length      = (i - index) + 1;

                        break;
                    }
                }
            }

            var declaration = new magnum.SectionDeclaration(this.content, name, start, length, body_start, body_length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_import     (index:number) : number {
        
            var filename  = '';

            var start     = index;
            
            var length    = 0;
            
            var cursor    = (index + 7);

            cursor = this.advance(cursor);

            var quote_flag = 0;

            // ensure that the next character after
            // @import is either a single or double
            // qoute. if detected, then set the quote
            // flag to be that value, otherwise return.
            var code = this.content.charCodeAt(cursor);

            if(code == 39 || code == 34) {

                quote_flag = code;
            }
            else {

                return (index);
            }

            // advance one and scan through the @import 
            // filename and gather the content. if we recieve 
            // a newline or other invalid character along the 
            // way, then terminate and return the index starting 
            // location.

            cursor += 1;

            for(var i = cursor; i < this.max(); i++) {
            
                var code = this.content.charCodeAt(i);

                if(code == 10 || code == 13) {
                
                    return index;
                }

                if(code == quote_flag) {
                    
                    filename = this.read(cursor, i - cursor);

                    length   = (i - index) + 1;

                    break;
                }
            }

            var declaration = new magnum.ImportDeclaration(filename, start, length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_render     (index:number) : number {

            var filename  = '';
            var start     = index;
            var length    = 0;
            var cursor    = (index + 7);

            cursor = this.advance(cursor);

            var quote_flag = 0;

            // ensure that the next character after
            // @render is either a single or double
            // qoute. if detected, then set the quote
            // flag to be that value, otherwise return.
            var code = this.content.charCodeAt(cursor);

            if(code == 39 || code == 34) {

                quote_flag = code;
            }
            else {

                return (index);
            }

            // advance one and scan through the @render 
            // filename and gather the content. if we recieve 
            // a newline or other invalid character along the 
            // way, then terminate and return the index starting 
            // location.

            cursor += 1;

            for(var i = cursor; i < this.max(); i++) {
            
                var code = this.content.charCodeAt(i);

                if(code == 10 || code == 13) {
                
                    return index;
                }

                if(code == quote_flag) {
                    
                    filename = this.read(cursor, i - cursor);

                    length   = (i - index) + 1;

                    break;
                }
            }

            var declaration = new magnum.RenderDeclaration(filename, start, length);

            this.declarations.push(declaration);

            return index + declaration.length;          
        }

        private scan_for        (index:number) : number {

            var expression  = '';
            var start       = index;
            var length      = 0;
            var body_start  = 0;
            var body_length = 0;

            var cursor      = index + 4;

            cursor = this.advance(cursor);
            
            // ensure that the next charactor found
            // after @for is the opening brace for the
            // expression.
            if(this.content.charCodeAt(cursor) != 40) {
                
                return index;
            }

            // scan forward looking for the expression.
            // if at any time we encounter something suspicious, 
            // like newline returns, we escape.
            for(var i = cursor; i < this.max(); i++) {
            
                var code = this.content.charCodeAt(i);

                // newlines not supported.
                if(code == 10 || code == 13) {
                    
                    return index;
                }

                if(code == 41) {
                
                    expression = this.read(cursor, (i - cursor) + 1);

                    cursor = (i + 1);

                    break;
                }
            }

            // ensure that the next charactor after the expression
            // is the opening body brace. if not found, this is 
            // not a valid @for, return the original index.
            cursor = this.advance(cursor);

            if(this.content.charCodeAt(cursor) != 123) {
                
                return index;
            }
            
            // scan ahead looking for the body content. keep
            // a count of the opening and closing braces, and
            // only completing when the braces return to 0.

            var count = 0;

            for(var i = cursor; i < this.max(); i++) {
            
                var ch = this.content.charAt(i);
                
                if(ch == '{') {

                    if(count == 0) {
                
                        body_start = (i + 1);
                    }   

                    count += 1;
                }
                
                if(ch == '}') {
                    
                     count -= 1;

                    if(count == 0) {
                    
                        body_length = (i - body_start)

                        length      = (i - index) + 1;

                        break;
                    }
                }
            }

            var declaration = new magnum.ForDeclaration(this.content, expression, start, length, body_start, body_length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_if         (index:number) : number {

            var expression  = '';
            var start       = index;
            var length      = 0;
            var body_start  = 0;
            var body_length = 0;
            var cursor      = index + 3;

            cursor = this.advance(cursor);
            
            // ensure that the next charactor found
            // after @if is the opening brace for the
            // expression.

            if(this.content.charCodeAt(cursor) != 40) {
                
                return index;
            }

            // scan forward looking for the expression.
            // if at any time we encounter something suspicious, 
            // like newline returns, we escape.

            for(var i = cursor; i < this.max(); i++) {
            
                var code = this.content.charCodeAt(i);

                // newlines not supported.
                if(code == 10 || code == 13) {
                    
                    return index;
                }

                if(code == 41) {
                
                    expression = this.read(cursor, (i - cursor) + 1);

                    cursor = (i + 1);

                    break;
                }
            }

            // ensure that the next charactor after the expression
            // is the opening body brace. if not found, this is 
            // not a valid @if, return the original index.

            cursor = this.advance(cursor);

            if(this.content.charCodeAt(cursor) != 123) {
                
                return index;
            }
            
            // scan ahead looking for the body content. keep
            // a count of the opening and closing braces, and
            // only completing when the braces return to 0.

            var count = 0;

            for(var i = cursor; i < this.max(); i++) {
            
                var ch = this.content.charAt(i);
                
                if(ch == '{') {

                    if(count == 0) {
                
                        body_start = (i + 1);
                    }   

                    count += 1;
                }
                
                if(ch == '}') {
                    
                     count -= 1;

                    if(count == 0) {
                    
                        body_length = (i - body_start)

                        length      = (i - index) + 1;

                        break;
                    }
                }
            }

            var declaration = new magnum.IfDeclaration(this.content, expression, start, length, body_start, body_length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_code       (index:number) : number {

            var start       = index;
            
            var length      = 0;
            
            var body_start  = index + 2;
            
            var body_length = 0;

            var cursor      = index + 1;
            
            // scan ahead looking for the body of the code. keep
            // a count of the opening and closing braces, and
            // only complete when the braces return to 0.

            var count = 0;

            for(var i = cursor; i < this.max(); i++) {
            
                var ch = this.content.charAt(i);
                
                if(ch == '{') { 

                    count += 1;
                }
                
                if(ch == '}') {
                    
                     count -= 1;

                    if(count == 0) {
                    
                        body_length = (i - body_start)

                        length      = (i - index) + 1;

                        break;
                    }
                }
            }

            var declaration = new magnum.CodeDeclaration(this.content, start, length, body_start, body_length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_expression (index:number) : number {
            
            var expression = '';
            var start      = index;
            var length     = 0;
            var cursor     = (index + 1);
            
            cursor = this.advance(cursor);
            
            // check to see if the next character is
            // a opening brace for the expression. if
            // not, we need to return the index.
            var code = this.content.charCodeAt(cursor);

            if(code != 40) {
            
                return index;
            }

            // scan through the content reading the body
            // of the expression. if we encounter a newline
            // or other invalid syntax, we need to return.
            for(var i = cursor; i < this.max(); i++) {
                
                var code = this.content.charCodeAt(i);
                
                // newlines not supported.
                if(code == 10 || code == 13) {
                    
                    return index;
                }

                if(code == 41) {
                
                    expression = this.read(cursor, (i - cursor) + 1);

                    length     = (i - index) + 1;

                    break;
                }
            }

            var declaration = new magnum.ExpressionDeclaration(this.content, expression, start, length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_comment    (index:number) : number {
        
            var comment    = '';

            var start      = index;
            
            var length     = 0;
            
            var cursor     = index + 2;

            // scan through the content reading the body
            // of the comment. we are checking for the
            // pattern *@, indicating the end of the 
            // comment.

            for(var i = cursor; i < this.max(); i++) {
                
                var code = this.content.charCodeAt(i);

                if(code == 42) { // *
                    
                    if(this.content.charCodeAt(i+1) == 64) { // @
                        
                        i = i + 1;

                        comment    = this.read(index, (i - cursor) + 2);

                        length     = (i - index) + 1;

                        break;
                    }
                }
            }

            var declaration = new magnum.CommentDeclaration(this.content, comment, start, length);

            this.declarations.push(declaration);

            return index + declaration.length;
        }

        private scan_content    (index:number) : number {
            
            // here we scan to the next @. however, we
            // skip +1 from the index to prevent getting
            // stuck on subsequent calls. in the string "123@123" 
            // this will match "123" on first pass and "@123" on 
            // the subsequent pass.

            var cursor = this.advanceto(index + 1, 64);

            var declaration = new magnum.ContentDeclaration(index, cursor - index);

            if(declaration.length > 0) {
                
                this.declarations.push(declaration);
            }

            return (index + declaration.length);
        }

        private scan() : void {

            var index = this.declaration.body_start;

            do {
                    
                //---------------------------------------------
                // scan section
                //--------------------------------------------- 
                if(this.content.substr(index, 8) === '@section') {
                    
                    var next = this.scan_section(index);
                    
                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan import
                //---------------------------------------------                     
                if(this.content.substr(index, 7) === '@import') {

                    var next = this.scan_import(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan render
                //--------------------------------------------- 
                if(this.content.substr(index, 7) === '@render') {

                    var next = this.scan_render(index);
 
                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan for
                //---------------------------------------------                                         
                if(this.content.substr(index, 4) === '@for') {

                    var next = this.scan_for(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan if
                //--------------------------------------------- 
                if(this.content.substr(index, 3) === '@if') {

                    var next = this.scan_if(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan code
                //--------------------------------------------- 
                if(this.content.substr(index, 2) === '@{') {

                    var next = this.scan_code(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }


                //---------------------------------------------
                // scan expression
                //--------------------------------------------- 
                if(this.content.substr(index, 2) === '@(') {

                    var next = this.scan_expression(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }

                //---------------------------------------------
                // scan code
                //--------------------------------------------- 
                if(this.content.substr(index, 2) === '@*') {

                    var next = this.scan_comment(index);

                    if(next > index) {
                        
                        index = next;

                        continue;
                    }
                }
                           
                //---------------------------------------------
                // scan content
                //---------------------------------------------
                
                index = this.scan_content(index);
            
            } while(index < this.max());
        }
    }
}