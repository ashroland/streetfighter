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
		// 'constants'
		this.ModuleSuccess = 1000;

		this.stepPointer = 0;
		this.modulePointer;
		this.actionPointer;
		this.behaviorPointer;

		this.gui = document.createElement("div");
		this.gui.id = "omnibox";
		document.body.appendChild(this.gui);

		this.step = function() {
			if (this.stepPointer == 0) {

			} else if (this.stepPointer == 1) {

			} else if (this.stepPointer == 2) {

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

			"Settings": {
				"Actions": {
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