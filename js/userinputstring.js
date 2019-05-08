class UserInputString {
	/*

	Catch user input and construct a string buffer with it.
	
	Return user input intact for compatibility, also return contents 
	of string buffer.

	Input should be reasonably sanitized by our keyhandler by the 
	time it gets here

	*/

	constructor() {
		this.inputString = "";

		this.keyDown = function (keyEvent) {
			if (keyEvent == 9001) {
				// Catch cases where there has been no key input
				// or we're choosing to sanitize out key input
				return [-1, this.inputString];
			}

			var kc = keyEvent.keyCode;
			var key = keyEvent.key;
			var keyBlackList = [9, 13, 16, 17, 145, 19, 45, 36, 33, 46, 35, 34, 37, 38, 39, 40];

			switch (kc) {
				case 8: // backspace
					this.inputString = this.inputString.substr(0, this.inputString.length - 1);
					break;
				default:
					// exclude special function keys from stringbuffer
					if (keyBlackList.indexOf(kc) == -1) {
						this.inputString += key;
					}
					break;
			}
			return [keyEvent, this.inputString];
        }
        
        this.getBuffer = function() {
            return this.inputString;
		}
		
		this.clearBuffer = function() {
			this.inputString = "";
		}
	}
}