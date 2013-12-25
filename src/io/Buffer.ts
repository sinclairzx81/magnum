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

module magnum.io {

    // Microsoft Buffer Implementation.
	export class Buffer {
		
		public static process (buffer /* NodeBuffer or String */) : string {
		
			switch (buffer[0]) {
			
				case 0xFE:
				
					if (buffer[1] == 0xFF) {
					
						// utf16-be. Reading the buffer as big endian is 
						// not supported, so convert it to Little Endian first
						
						var i = 0;
						
						while ((i + 1) < buffer.length) {
						
							var temp = buffer[i];
							
							buffer[i] = buffer[i + 1];
							
							buffer[i + 1] = temp;
							
							i += 2;
						}
						
						return buffer.toString("ucs2", 2);
						
					}
					
					break;
				case 0xFF:
				
					if (buffer[1] == 0xFE) {
					
						// utf16-le 
						return buffer.toString("ucs2", 2);
					}
					
					break;
					
				case 0xEF:
				
					if (buffer[1] == 0xBB) {
					
						// utf-8
						return buffer.toString("utf8", 3);
					}
			}
			
			// Default behaviour
			return buffer.toString();
		}	
	}
}