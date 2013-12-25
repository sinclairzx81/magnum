/*--------------------------------------------------------------------------

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

/// <reference path="Parser.ts" />
/// <reference path="ITemplate.ts" />
/// <reference path="IOptions.ts" />

module magnum {

    export class Engine {

        /** a the appex template cache. */
        public cache  : magnum.ITemplate[];
            
        constructor(public options : magnum.IOptions) {

            this.options = magnum.ParseEngineOptions(options);

            this.cache = [];
        }


        /** compiles this file into a magnum template */

        public compile(filename:string) : ITemplate {
        
            var parser = new magnum.Parser(filename);

            var code = parser.parse();

            try
            {
                var script = node.vm.createScript(code + ' exports = new template()', filename );

                var sandbox = { exports : {} };

                script.runInNewContext ( sandbox );
                
                var template = <magnum.ITemplate>sandbox.exports;

                return template
            }
            catch(e) 
            {
                return <magnum.ITemplate> {
                
                    render: (context:any) => {
                        
                        return e.toString();
                    }
                }
            }
        }
        
        /** renders this file specified as a magnum template. */

        public render(filename:string, context?:any) : string {

            if(this.options.devmode == false) {
                
                if(this.cache[filename]) {

                    var template = <magnum.ITemplate>this.cache[filename];

                    return template.render(context || {})
                }
            }
            
            var parser = new magnum.Parser(filename);

            var code   = parser.parse();

            try
            {
                var script = node.vm.createScript(code + ' exports = new template()', filename );

                var sandbox = { exports : {} };

                script.runInNewContext ( sandbox );

                var template = <magnum.ITemplate>sandbox.exports;

                var result   = template.render(context || {});  

                this.cache[filename] = template;

                return result;
            }
            catch(e) 
            {
                return e.toString();
            }
        }
    }
}