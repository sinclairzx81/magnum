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

/// <reference path="../references.ts" />

module magnum.util {

	export class Path 
	{
		public static isAbsoluteUrl (path:string) : boolean 
		{
			var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp[s]?:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
			
			return regex.test(path);
		}
		
		public static isAbsoluteUrn (path:string) : boolean 
		{
			var regex = new RegExp("^(?:[a-xA-Z]:(/|\))|(?:file://)");
			
			return regex.test(path);	
			
		}
		
		public static isRootRelative(path:string) : boolean 
		{
			return path.indexOf('/') == 0 && path.indexOf('//') != 0;
		}

        public static isAbsolute(path:string) : boolean {
        
            if(!magnum.util.Path.isAbsoluteUrl(path)) {
            
                if(!magnum.util.Path.isAbsoluteUrn(path)) {
            
                    return false;
                }                
            }

            return true;
		}

		public static isRelative(path:string) : boolean 
		{
			if(!Path.isAbsoluteUrl(path)) 
			{
				if(!Path.isAbsoluteUrn(path)) 
				{
					if(!(path.indexOf('/') == 0)) 
					{
						return true;
					}
				}
			}
			return false;				
		}
		
		public static toForwardSlashes(path:string) : string 
		{
			return path.replace(/\\/gi, "/");
		}
		
		
		public static relativeToAbsolute (absolute_parent_path:string, relative_path:string) : string 
		{
			if( Path.isRelative(relative_path) ) 
			{
				var absolute_parent_directory = node.path.dirname(absolute_parent_path);
				
				return node.path.join(absolute_parent_directory, relative_path);			
			}
			
			return relative_path;
		}

        public static makeAbsolute(path:string) : string {
        
            if(!magnum.util.Path.isAbsolute(path)) {
            
                return node.path.resolve('./', path);
            }

            return path;
        }
	}
}