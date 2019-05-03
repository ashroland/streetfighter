/* 

"Omnibox" 

sublimetextlike menu for all user functions
many search engines
tooled for extensibility


TO-DO:

default action - selected until moving through options
up/down action cycles through modules
devise a search method which actually works lol


*/



class Omnibox {

	constructor(modules) {
		this.Modules = modules;

		// 'constants' for legibility 
		this.BOX_CLOSED = 0;
		this.BOX_OPEN = 1;

		this.STEP_POP_BOX = 0;
		this.STEP_ITERATE_MODULES = 1;
		this.STEP_ITERATE_ACTION = 2;
		this.STEP_MODULE_SUCCESS = 1000;

		this.KEY_ENTER = 13;
		this.KEY_ARROW_UP = 38;
		this.KEY_ARROW_DOWN = 40;
		this.KEY_SPACE = 32;
		this.KEY_IMAGINARY = 9001;

		// Internal pointers to keep state
		this.boxState = this.BOX_CLOSED;
		this.stepPointer = this.STEP_POP_BOX;
		this.modulePointer;
		this.userInputString = new UserInputString();

		// Build GUI 
		this.guiParentDiv = document.createElement("div");
		this.guiParentDiv.id = "omnibox";
		this.guiParentDiv.style = "display: none";
		this.guiInput = document.createElement("input");
		this.guiInput.id = "omniInput";
		this.searchResultArea = document.createElement("div");
		this.searchResultArea.id = "omniSearchResults";

		this.guiParentDiv.appendChild(this.guiInput);
		this.guiParentDiv.appendChild(this.searchResultArea);
		document.body.appendChild(this.guiParentDiv);

		this.loop = function(key = this.KEY_IMAGINARY) {

			var modResults;

			if (this.stepPointer == this.STEP_POP_BOX) {
				if (key.keyCode == this.KEY_SPACE) {
					// open box and advance state
					if (this.boxState == this.BOX_CLOSED) {
						key = this.KEY_IMAGINARY;
						this.boxState = this.BOX_OPEN;
						this.guiParentDiv.setAttribute("style", "display: block;");
						this.stepPointer = this.STEP_ITERATE_MODULES;
					} else {
						this.boxState = this.BOX_CLOSED;
						this.guiParentDiv.setAttribute("style", "display: none;");
						this.stepPointer = this.STEP_POP_BOX;
					}
				}
			}

			if (this.stepPointer == this.STEP_ITERATE_MODULES) {
				// user is either searching a term (default behavior) 
				// or looking for a module to use

				// Omnibox open, pass user input into keybuffer
				var keyResult = this.userInputString.keyDown(key);
				var keyCode = keyResult[0].key;
				var inputBuffer = keyResult[1];

				// take action based on key 
				if (keyCode == this.KEY_ENTER) {
					// module selected
					this.stepPointer = this.STEP_ITERATE_ACTION;
				} else if (keyCode == this.KEY_ARROW_UP) {
					modResults = this.moduleScroll(modResults, this.KEY_ARROW_UP);
				} else if (keyCode == this.KEY_ARROW_DOWN) {
					modResults = this.moduleScroll(modResults, this.KEY_ARROW_DOWN);
				} else {
					// either searching a term or for a module.

					// gui reflects state of inputBuffer
					this.guiInput.value = inputBuffer;
					modResults = this.moduleSearch(inputBuffer);

					// remove old results, if any
					for (var x = this.searchResultArea.children.length - 1; x >= 0; x--) {
						this.searchResultArea.removeChild(this.searchResultArea.children[x]);
					}

					// draw new results
					modResults.forEach(element => {
						var sr = document.createElement("div");
						sr.class = "searchResult";

						var title = document.createElement("h1");
						title.innerHTML = element.title;

						var desc = document.createElement("p");
						desc.innerHTML = element.shortDesc;

						sr.appendChild(title);
						sr.appendChild(desc);
						this.searchResultArea.appendChild(sr);
					});
				}
			}

			// Debugging info reflects final state
			console.log("State", this.stepPointer);
			console.log("Input Buffer", "\"" + this.userInputString.getBuffer() + "\"");

		}


		this.moduleSearch = function (searchTerm) {
			// return a subset of actions which contain the provided string
			// in any of their constituent parts 

			let modResults = [];

			// return nothing if searchTerm is empty
			if (searchTerm.length == 0) {
				return modResults;
			}

			// iterate all modules and their actions
			let mod = this.Modules;

			for (var key in mod) {
				if (mod.hasOwnProperty(key)) {
					for (var actionKey in mod[key]["Actions"]) {
						if (mod[key]["Actions"].hasOwnProperty(actionKey)) {
							// check title and description for search term
							var title = mod[key]["Actions"][actionKey]["title"];
							var shortDesc = mod[key]["Actions"][actionKey]["shortDesc"];
							var titleResult = title.indexOf(searchTerm);
							var descResult = shortDesc.indexOf(searchTerm);

							if (titleResult != -1 || descResult != 1) {
								// if we find our search text in either the title or description
								// of the module, add it to the results.
								var mr = mod[key]["Actions"][actionKey];

								// avoid duplicates
								if (modResults.indexOf(mr) == -1) {

									// add module to results
									modResults.push(mr);
								}
							}
						}
					}
				}
			}
			return modResults;
		}

		this.moduleScroll = function (modules, direction) {
			// transform a list and return it
			var modCopy = modules.slice();

			if (direction == this.KEY_ARROW_UP) {
				// take last member of list and add it to the top
				var last = modCopy.pop();
				modCopy.unshift(last);
			} else {
				// take top member of list and add it to bottom
				var first = modCopy.shift();
				modCopy.push(first);
			}

			return modCopy;
		}
	}
}