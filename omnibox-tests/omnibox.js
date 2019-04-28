/* 

"Omnibox" 
	sublimetextlike menu for all user functions
	many search engines

	gotta use a state machine for this one.

	1) Box Open
		Iterate Actions
		Render Actions
		Display Box

	2) Action Select
		Set pointer P to Action.behavior[0]

		2a)
			Render Action.behavior[p]

		p++

	3) Box Close

	structure:
*/
class Omnibox {

	constructor() {
		// 'constants' for legibility 
		this.StepPopBox = 0;
		this.StepIterateModules = 1;
		this.StepIterateAction = 2;
		this.StepModuleSuccess = 1000;

		this.stepPointer = 0;
		this.modulePointer;
		this.actionPointer;
		this.behaviorPointer;

		this.gui = document.createElement("div");
		this.gui.id = "omnibox";
		document.body.appendChild(this.gui);

		this.step = function() {
			if (this.stepPointer == this.StepPopBox) {
				this.gui.setAttribute("style","display:block");
				this.stepPointer = this.StepIterateModules;
				this.step();
			} else if (this.stepPointer == this.StepIterateModules) {
				// iterate all modules and their actions
				let mod = this.Modules;

				for (var key in mod){
					if (mod.hasOwnProperty(key)){
						for (var actionKey in mod[key]["Actions"]) {
							if (mod[key]["Actions"].hasOwnProperty(actionKey)){
								let title = mod[key]["Actions"][actionKey]["title"];
								let shortDesc = mod[key]["Actions"][actionKey]["shortDesc"];
								console.log(key, actionKey, title, shortDesc);
							}
						}	
					}
					
				}
			} else if (this.stepPointer == this.StepIterateAction) {

			}
		}

		this.Modules = {
			"Links": {
		
				"Actions": {
		
					"makeLink": {
						"title":"Make Link",
						"shortDesc":"Add a link to homepage",
						"behavior": [ // a sorted list walking through all steps of action
							function(){
								// ask for title
							},
							function() {
								// ask for href
							},
							function() {
								// ask for hotkey, assume coherent default
							},
							function() {
								// return something to show that we're done?? idk
								return OmniBox.ModuleSuccess;
							}
						]
					}
				}
			},

			//etc.
		};
	}
}


let ob;

function init() {

	ob = new Omnibox();

}