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

/// <reference path="util/Path.ts" />
/// <reference path="io/IOSync.ts" />
/// <reference path="Scanner.ts" />

module magnum {

    export class Parser {

        public  io                  : magnum.io.IOSync;

        public  reference_document  : magnum.Document;

        public  document            : magnum.Document;

        public  output              : string[];

        constructor(public filename: string) {

            this.output    = [];

            this.io        = new magnum.io.IOSync();

            var filename   = magnum.util.Path.makeAbsolute(filename)

            var content    = this.io.load( filename )

            this.document  = new magnum.Document(filename, content)

            for(var n in this.document.declarations) {
            
                if(this.document.declarations[n].type == 'import') {
                
                    var import_declaration = <magnum.ImportDeclaration>this.document.declarations[n]

                    filename = magnum.util.Path.relativeToAbsolute(this.document.filename, import_declaration.filename)

                    var content = this.io.load(filename)

                    this.reference_document = this.document

                    this.document = new magnum.Document(filename, content)

                    return;
                }
            }
        }

        public parse(): string {

            this.write('var Template = function() {')

            this.write('    this.buffer = []')

            this.write('    this.write = function(data) {')

            this.write('        this.buffer.push(data.toString())')

            this.write('     }')

            this.write('    this.render = function(context) {')
            
            this.write('        context = context || {}')

            this.write('        this.buffer = []')

            this.emit(this.document, this.document)
            
            this.write('        return this.buffer.join(\'\')')

            this.write('     }')

            this.write('}');

            return this.output.join('')
        }

        private emit(current_document:magnum.Document, declaration:magnum.Declaration) : void {

            switch(declaration.type) {

                case 'document':



                    break;

                case 'import':

                    break;

                case 'render':

                    var render_declaration = <magnum.RenderDeclaration>declaration;
                    
                    var filename = magnum.util.Path.relativeToAbsolute(current_document.filename, render_declaration.filename);

                    var content = this.io.load( filename );

                    var document = new magnum.Document(filename, content);

                    this.emit(document, document);

                    return;

                    break;

                case 'section':

                    var section_declaration = <magnum.SectionDeclaration>declaration;

                    if(this.reference_document) {
                    
                        for(var n in this.reference_document.declarations) {
                        
                            if(this.reference_document.declarations[n].type == 'section') {
                            
                                var reference_section_declaration = <magnum.SectionDeclaration>this.reference_document.declarations[n];

                                if(reference_section_declaration.name == section_declaration.name) {
                                    
                                    for(var m in reference_section_declaration.declarations) {
                                    
                                        this.emit(this.reference_document, reference_section_declaration.declarations[m]);
                                    }

                                    return;
                                }
                            }
                        }
                    }

                    break;

                case 'for':

                    var for_declaration = <magnum.ForDeclaration>declaration;

                    this.write ('        ' + for_declaration.type + for_declaration.expression + '{')
                    
                    break;

                case 'if':
                    
                    var if_declaration = <magnum.IfDeclaration>declaration;

                    this.write ('        ' + if_declaration.type + if_declaration.expression + '{')
                    
                    break;

                case 'expression':
                    
                    var expression_declaration = <magnum.ExpressionDeclaration>declaration

                    this.write('        try {')

                    this.write('            this.write' + expression_declaration.expression)

                    this.write('        } catch (e) { ')

                    this.write('            this.write(e.message)')

                    this.write('        }')

                    break;
                
                case 'code':

                    this.write( '      ' + this.read( current_document, declaration.body_start, declaration.body_length ) );

                    break;

                case 'content':

                    this.write_literal( this.read( current_document, declaration.start, declaration.length ) );

                    break;


            }

            for(var n in declaration.declarations) {
                                    
                this.emit(current_document, declaration.declarations[n]);
            }

            switch(declaration.type) {

                case 'for':

                case 'if':

                    this.write('        }')
                    
                    break;
                
            }
        }

        private read(document:magnum.Document, start:number, length:number) : string {
            
            return document.content.substr(start, length);
        }

        private write(content:string) : void {
            
            this.output.push(content + '\n');
        }

        private write_literal(content:string) : void {
        
            content = content.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/'/g, '\\\'');

            this.write('        this.write(\'' + content + '\')');

            //this.write(content)
        }
    }
}