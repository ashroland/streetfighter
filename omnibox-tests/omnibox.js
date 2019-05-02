/* 

"Omnibox" 

sublimetextlike menu for all user functions
many search engines
tooled for extensibility

*/
class Omnibox {

	constructor() {
		// 'constants' for legibility 
		this.StepPopBox = 0;
		this.StepIterateModules = 1;
		this.StepIterateAction = 2;
		this.StepModuleSuccess = 1000;
		this.ENTER = 13;
		this.ARROW_UP = 38;
		this.ARROW_DOWN = 40;
		this.SPACE = 32;

		// Internal pointers to keep state
		this.stepPointer = this.StepPopBox;
		this.modulePointer;

		// Build GUI 
		this.guiParentDiv = document.createElement("div");
		this.guiParentDiv.id = "omnibox";
		this.guiParentDiv.style = "display:none";
		this.guiInput = document.createElement("input");
		this.guiInput.id = "omniInput";
		this.searchResultArea = document.createElement("div");
		this.searchResultArea.id = "omniSearchResults";

		this.guiParentDiv.appendChild(this.guiInput);
		this.guiParentDiv.appendChild(this.searchResultArea);
		document.body.appendChild(this.guiParentDiv);

		this.loop = function (key) {

			this.keyCode = key;
			this.modResults;

			console.log("State", this.stepPointer);

			if (this.stepPointer == this.StepPopBox) {

				if (this.keyCode == this.SPACE) {
					// open box and iterate modules.
					// start sorting based on input in box
					if (this.guiParentDiv.getAttribute("style") == "display:none") {
						this.guiParentDiv.setAttribute("style", "display:block");
						this.guiInput.focus();
						this.stepPointer = this.StepIterateModules;
						this.loop(this.keyCode);
					} else {
						this.guiParentDiv.setAttribute("style", "display:none");
						this.stepPointer = this.StepPopBox;
					}
				}

			} else if (this.stepPointer == this.StepIterateModules) {
				// user is either searching a term (default behavior) 
				// or looking for a module to use

				// take action based on key 
				if (this.keyCode == this.ENTER) {
					// module selected
					this.stepPointer = this.StepIterateAction;
				} else if (this.keyCode == this.ARROW_UP) {
					this.moduleScroll(this.modResults, this.ARROW_UP);
				} else if (this.keyCode == this.ARROW_DOWN) {
					this.moduleScroll(this.modResults, this.ARROW_DOWN);
				} else {
					console.log("key", this.keyCode);

					// either searching a term or for a module
					var val = this.guiInput.value;
					console.log("val", "\"" + val + "\"", val.length);
					this.modResults = this.moduleSearch(val);
					console.log(this.modResults);

					// show results
					for (var x = 0; x < this.searchResultArea.children.length; x++) {
						this.searchResultArea.removeChild(this.searchResultArea.children[x]);
					}

					this.modResults.forEach(element => {
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
			} else if (this.stepPointer == this.StepIterateAction) {
				// action selected, step through its behavior
				// 
			}
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
							let title = mod[key]["Actions"][actionKey]["title"];
							let shortDesc = mod[key]["Actions"][actionKey]["shortDesc"];

							// in python we'd do: 
							// if searchTerm is in title or if searchTerm is in shortDesc:

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

			if (direction == this.ARROW_UP) {
				// take last member of list and add it to the top
				var last = modCopy.pop(modCopy.length - 1);
				modCopy.push(last, 0);
			} else {
				// take top member of list and add it to bottom
				var first = modCopy.pop(0);
				modCopy.push(first, modCopy.length - 1);
			}

			return modCopy;
		}

		this.Modules = {
			"Links": {

				"Actions": {

					"makeLink": {
						"title": "Make Link",
						"shortDesc": "Add a link to homepage",
						"behavior": [ // a sorted list walking through all steps of action
							function () {
								// ask for title
							},
							function () {
								// ask for href
							},
							function () {
								// ask for hotkey, assume coherent default
							},
							function () {
								// return something to show that we're done?? idk
								return OmniBox.ModuleSuccess;
							}
						]
					},

					"removeLink": {
						"title": "Remove Link",
						"shortDesc": "Remove a link from a category",
						"behavior": [ // a sorted list walking through all steps of action
							function () {
								// ask for title
							},
							function () {
								// ask for href
							},
							function () {
								// ask for hotkey, assume coherent default
							},
							function () {
								// return something to show that we're done?? idk
								return OmniBox.ModuleSuccess;
							}
						]
					},
					"addCategory": {
						"title": "Make Category",
						"shortDesc": "Add a category to homepage",
						"behavior": [ // a sorted list walking through all steps of action
							function () {
								// ask for title
							},
							function () {
								// ask for href
							},
							function () {
								// ask for hotkey, assume coherent default
							},
							function () {
								// return something to show that we're done?? idk
								return OmniBox.ModuleSuccess;
							}
						]
					},
				}
			},

			//etc.
		};
	}
}


var ob;

function init() {

	ob = new Omnibox();
	ob.loop();

}

window.onkeydown = function (event) {
	var key = event.keyCode;
	// console.log(event);
	ob.loop(key);
}