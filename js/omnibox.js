/*jshint esversion: 6 */

/* 

"Omnibox" 

sublimetextlike menu for all user functions
many search engines
tooled for extensibility


TO-DO:


REASONABLE DEFAULT BEHAVIOR FOR SEARCHING MODULES

1) 	Make a list based on search term
2) 	User can arrow up and down thru that list
3) 	If user gets to something like Google search or w/e, 
	clear the search bar (preserving results) and use
	the contents of the bar to act on selected item.

SO

results list
-	resultIndex used to highlight results

-	only four results render, fourth "greys out" with CSS
	to imply more results exist

-	modResults only modified when
	a)	more results exists "above" or "beneath" pointer and
	b)	pointer already == 2 or == 0


module refactor / implementation
-	Modules need to declare whether they accept user input
-	When they do, a secondary stringbuffer is used to 
	capture input for that module
-	Except in cases where the default action accepts user
	input, because that would cause complications, like
	partial user input getting handed to the default action,
	etc. 




	


*/

function itemInList(child, parent) {
	return parent.indexOf(child) == -1 ? false : true;
}


class Omnibox {

	constructor(modules) {
		this.Modules = modules;

		// 'constants' for legibility 

		// States the omnibox GUI can be in
		this.BOX_CLOSED = 0;
		this.BOX_OPEN = 1;

		// States the omnibox can be in
		this.STEP_POP_BOX = 0;
		this.STEP_ITERATE_MODULES = 1;
		this.STEP_ITERATE_ACTION = 2;

		// Module states
		this.MODULE_OPEN = 1;
		this.MODULE_SUCCESS = 9000;

		// Keybinding
		this.KEY_ENTER = 13;
		this.KEY_ARROW_UP = 38;
		this.KEY_ARROW_DOWN = 40;
		this.KEY_SPACE = 32;
		this.KEY_IMAGINARY = 9001;

		// Internal pointers to keep state
		this.boxState = this.BOX_CLOSED;
		this.stepPointer = this.STEP_POP_BOX;
		this.modulePointer = 0; // which step of the module are we on
		this.moduleStatus = 0;
		this.moduleStepDone = false; // have we finished everything on module step

		// Specific to function of STEP_ITERATE_MODULES
		this.userInputString = new UserInputString();
		this.secondaryBuffer = new UserInputString();
		this.modResults = [];
		this.resultsPointer = 0;

		// lol, later...
		"YXJyb3d1cGFycm93dXBhcnJvd2Rvd25hcnJvd2Rvd25hcnJvd2xlZnRhcnJvd3JpZ2h0YXJyb3dsZWZ0YXJyb3dyaWdodGJh";

		// Build GUI 
		this.guiParentDiv = document.createElement("div");
		this.guiParentDiv.id = "omnibox";
		this.guiParentDiv.style = "display: none";

		this.guiInput = document.createElement("input");
		this.guiInput.id = "omniInput";

		this.guiBreadcrumb = document.createElement("div");
		this.guiBreadcrumb.id = "breadcrumb";

		this.searchResultArea = document.createElement("div");
		this.searchResultArea.id = "omniSearchResults";

		// Create DOM elements
		this.guiParentDiv.appendChild(this.guiInput);
		this.guiParentDiv.appendChild(this.guiBreadcrumb);
		this.guiParentDiv.appendChild(this.searchResultArea);
		document.body.appendChild(this.guiParentDiv);

		this.openCloseOmnibox = function (hardclose = false) {
			// open box and advance state

			if (hardclose) {
				// regardless of state, close box and return quietly
				this.boxState = this.BOX_CLOSED;
				this.guiParentDiv.setAttribute("style", "display: none;");
				this.stepPointer = this.STEP_POP_BOX;
				this.userInputString.clearBuffer();
				document.querySelector("#menuReminder").innerHTML = "[space] for menu";
				return;
			}

			if (this.boxState == this.BOX_CLOSED) {
				this.boxState = this.BOX_OPEN;
				this.guiParentDiv.setAttribute("style", "display: block;");
				this.guiInput.focus();
				this.stepPointer = this.STEP_ITERATE_MODULES;
				document.querySelector("#menuReminder").innerHTML = "[ctrl]+[space] to exit";
				this.step();
			} else {
				this.boxState = this.BOX_CLOSED;
				this.guiParentDiv.setAttribute("style", "display: none;");
				this.stepPointer = this.STEP_POP_BOX;
				document.querySelector("#menuReminder").innerHTML = "[space] for menu";
			}
		}

		this.step = function (key = this.KEY_IMAGINARY) {

			if (this.stepPointer == this.STEP_ITERATE_MODULES) {
				// user is either searching a term (default behavior) 
				// or looking for a module to use

				// Omnibox open, pass user input into keybuffer
				var keyResult = this.userInputString.keyDown(key);
				var keyCode = keyResult[0].keyCode;
				var inputBuffer = keyResult[1];

				// do something meaningful w user input
				if (keyCode == this.KEY_ENTER) {
					// module selected
					this.stepPointer = this.STEP_ITERATE_ACTION;
				} else if (keyCode == this.KEY_ARROW_UP) {
					// can only arrow up if index > 0
					if (this.resultsPointer > 0) {
						this.resultsPointer -= 1;
					} else {
						this.modResults = this.moduleScroll(this.modResults, this.KEY_ARROW_UP);
					}

					
				} else if (keyCode == this.KEY_ARROW_DOWN) {
					if (this.resultsPointer < 2) {
						this.resultsPointer += 1;
					} else {
						this.modResults = this.moduleScroll(this.modResults, this.KEY_ARROW_DOWN);
					}
					
				} else {
					// either searching a term or for a module.

					// gui reflects state of inputBuffer
					this.guiInput.value = inputBuffer;
					this.modResults = this.moduleSearch(inputBuffer);
				}

				// if default action not in list, in on front of list
				// TO-DO:
				// once user prefs implemented, pull default action from prefs
				// for now, default to google search	
				var defaultModule = this.Modules.Search.google;

				if (!itemInList(defaultModule, this.modResults)) {
					this.modResults.unshift(defaultModule);
				}

				// Draw module selector
				// remove old results, if any
				for (var x = this.searchResultArea.children.length - 1; x >= 0; x--) {
					this.searchResultArea.removeChild(this.searchResultArea.children[x]);
				}

				// draw new results

				// result 0 is our selected module,
				// draw in breadcrumb area
				this.guiBreadcrumb.innerHTML = ">> " + this.modResults[0].title;

				// make subset of modresults less 0th element
				var subSetResults = this.modResults.slice(0, this.modResults.length);

				for (var i = 0; i < subSetResults.length; i++) {
					var element = subSetResults[i];
					var sr = document.createElement("div");

					if (this.resultsPointer == i) {
						sr.setAttribute("class", "searchResult searchSelected");
					} else {
						sr.setAttribute("class", "searchResult");
					}

					var title = document.createElement("h1");
					title.innerHTML = element.title;

					var desc = document.createElement("p");
					desc.innerHTML = element.shortDesc;

					sr.appendChild(title);
					sr.appendChild(desc);
					this.searchResultArea.appendChild(sr);

				}
			}

			if (this.stepPointer == this.STEP_ITERATE_ACTION) {
				// selected module always 0th item
				var mod = this.modResults[this.resultsPointer];

				// progress when we have a success
				if (this.moduleStepDone == true) this.modulePointer += 1;

				if (this.modulePointer < mod.behavior.length) {
					// pass stringbuffer and stepdone supervisor into selected module
					this.moduleStatus = mod.behavior[this.modulePointer](this.userInputString, this.moduleStepDone);
				} else {
					// we have performed an action, 
					// reset all counters to closed state
					// and flush stringbuffer
				}

				if (this.moduleStatus == this.MODULE_SUCCESS) {
					this.stepPointer = this.STEP_ITERATE_MODULES;
				}

			}

			// Debugging info reflects final state
			console.log("State", this.stepPointer);
			console.log("Input Buffer", this.userInputString.getBuffer().length, "\"" + this.userInputString.getBuffer() + "\"");
			console.log("Search Results", this.modResults == undefined ? 0 : this.modResults.length, this.modResults);
			console.log("Results Pointer", this.resultsPointer, this.modResults == undefined ? "none" : this.modResults[this.resultsPointer]);
			

		}


		this.moduleSearch = function (searchTerm) {
			// return a subset of actions which contain the provided string
			// in any of their constituent parts 

			var modResults = [];

			// return nothing if searchTerm is empty
			if (searchTerm.length == 0) {
				return modResults;
			}

			// iterate all modules and their actions
			var mod = this.Modules;

			for (var key in mod) { // i 
				if (mod.hasOwnProperty(key)) { // hate
					for (var actionKey in mod[key]) { // this 
						if (mod[key].hasOwnProperty(actionKey)) { // so much 

							var action = mod[key][actionKey];

							// check title and description for search term
							var lowerTitle = action.title.toLowerCase();
							var lowerShortDesc = action.shortDesc.toLowerCase();
							var lowerSearch = searchTerm.toLowerCase();

							var inTitle = itemInList(lowerSearch, lowerTitle);
							var inDescription = itemInList(lowerSearch, lowerShortDesc);

							// if we find our search text in either the title or description
							// of the module, add it to the results.

							if (inTitle || inDescription) {
								// avoid duplicates
								if (!itemInList(action, modResults)) {
									modResults.push(action);
								}
							}
						}
					}
				}
			}
			return modResults;
		}

		this.moduleScroll = function (modList, direction) {
			// transform a list

			var modCopy = modList.slice();

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