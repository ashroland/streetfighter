/*jshint esversion: 6 */

class LinkHandler {

	constructor() {

		this.links = [];

		this.loadLinks = function (tempLinks = 9001) {
			// 1) Did user provide links as a string?
			if (tempLinks != 9001) {
				this.links = JSON.parse(tempLinks);
				return;
			}

			// 2) Check storage for links
			tempLinks = localStorage.getItem("links");

			// If nothing is stored there, make assumption that
			// user is visiting for first time and populate with 
			// a variety of links
			if (tempLinks == null) {
				lh.importLinks("W3siZGlzcGxheU5hbWUiOiJHb29nbGUiLCJocmVmIjoiaHR0cHM6Ly9nb29nbGUuY29tIiwia2V5Q29tYm8iOiJnIiwiaXNMaXN0IjpmYWxzZX0seyJkaXNwbGF5TmFtZSI6Ik1haWwiLCJrZXlDb21ibyI6Im0iLCJpc0xpc3QiOnRydWUsImxpc3QiOlt7ImRpc3BsYXlOYW1lIjoiR21haWwiLCJocmVmIjoiaHR0cHM6Ly9tYWlsLmdvb2dsZS5jb20iLCJrZXlDb21ibyI6ImciLCJpc0xpc3QiOmZhbHNlfSx7ImRpc3BsYXlOYW1lIjoiWWFob28iLCJocmVmIjoiaHR0cHM6Ly9tYWlsLnlhaG9vLmNvbSIsImtleUNvbWJvIjoieSIsImlzTGlzdCI6ZmFsc2V9XX0seyJkaXNwbGF5TmFtZSI6IlNvY2lhbCIsImtleUNvbWJvIjoicyIsImlzTGlzdCI6dHJ1ZSwibGlzdCI6W3siZGlzcGxheU5hbWUiOiJUd2l0dGVyIiwiaHJlZiI6Imh0dHBzOi8vdHdpdHRlci5jb20iLCJrZXlDb21ibyI6InQiLCJpc0xpc3QiOmZhbHNlfSx7ImRpc3BsYXlOYW1lIjoiRmFjZWJvb2siLCJocmVmIjoiaHR0cHM6Ly9mYWNlYm9vay5jb20iLCJrZXlDb21ibyI6ImYiLCJpc0xpc3QiOmZhbHNlfSx7ImRpc3BsYXlOYW1lIjoiVHVtYmxyIiwiaHJlZiI6Imh0dHBzOi8vdHVtYmxyLmNvbSIsImtleUNvbWJvIjoidSIsImlzTGlzdCI6ZmFsc2V9XX0seyJkaXNwbGF5TmFtZSI6IlRpbWVzdWNrIiwia2V5Q29tYm8iOiJ0IiwiaXNMaXN0Ijp0cnVlLCJsaXN0IjpbeyJkaXNwbGF5TmFtZSI6IkhhY2tlciBOZXdzIiwiaHJlZiI6Imh0dHBzOi8vbmV3cy55Y29tYmluYXRvci5jb20iLCJrZXlDb21ibyI6ImgiLCJpc0xpc3QiOmZhbHNlfSx7ImRpc3BsYXlOYW1lIjoiRGlnZyIsImhyZWYiOiJodHRwczovL2RpZ2cuY29tIiwia2V5Q29tYm8iOiJkIiwiaXNMaXN0IjpmYWxzZX1dfSx7ImRpc3BsYXlOYW1lIjoiU2hvcHBpbmciLCJrZXlDb21ibyI6ImgiLCJpc0xpc3QiOnRydWUsImxpc3QiOlt7ImRpc3BsYXlOYW1lIjoiQW1hem9uIiwiaHJlZiI6Imh0dHBzOi8vYW1hem9uLmNvbSIsImtleUNvbWJvIjoiYSIsImlzTGlzdCI6ZmFsc2V9LHsiZGlzcGxheU5hbWUiOiJlQmF5IiwiaHJlZiI6Imh0dHBzOi8vZWJheS5jb20iLCJrZXlDb21ibyI6ImUiLCJpc0xpc3QiOmZhbHNlfSx7ImRpc3BsYXlOYW1lIjoiQWxpRXhwcmVzcyIsImhyZWYiOiJodHRwczovL2FsaWV4cHJlc3MuY29tIiwia2V5Q29tYm8iOiJsIiwiaXNMaXN0IjpmYWxzZX1dfV0=");
			} else {
				this.links = JSON.parse(tempLinks);
			}
		}

		this.saveLinks = function (links_ = this.links) {
			// Save links to storage. If link list not specified,
			// default to save contents of this.links
			var saveLinks = JSON.stringify(links_);
			localStorage.setItem("links", saveLinks);
		}

		this.exportLinks = function() {
			// Currently dumps to console
			// TODO - GUIfy this process
			// and frankly a UTF-8 JSON object might
			// be more durable than base64. fwiw
			return btoa(JSON.stringify(this.links));
		}

		this.importLinks = function( b64string ) {
			// Currently expects console interaction
			// TODO - GUIfy this process

			this.loadLinks( atob(b64string) );
			this.saveLinks();
		}

		this.makeLink = function (dName, key, href_) {
			var newLink = {
				displayName: dName,
				href: href_,
				keyCombo: key,
				isList: false
			}

			return newLink;

		}

		this.makeList = function (dName, key, links = []) {

			var newLink = {
				displayName: dName,
				keyCombo: key,
				isList: true,
				list: links
			}

			return newLink;

		}

		this.addToLinks = function (link_or_list, index=-1) {
			// Put link at specified index or default to end of list.
			index = index == -1 ? this.links.length : index;
			this.links.splice(index, 0, link_or_list);
		}

		this.renderUnderline = function (key, displayName) {
			// Find first instance of keyCombo in displayname.
			// wrap that in a span with class kcUnderline

			// get first index of result
			var searchName = displayName.toLowerCase();
			var index = searchName.indexOf(key);

			// get surrounding text boundaries
			// and catch edge cases while we're at it
			var next = index + 1 >= searchName.length - 1 ? searchName.length : index + 1;
			var beforeUnderline = (index - 1 == 0 ? displayName.slice(0, 1) : "");
			var underline = displayName.slice(index, next);
			var afterUnderline = displayName.slice(next);

			// construct underlined string and return
			underline = '<span class="kcunderline">' + underline + "</span>";
			return beforeUnderline + underline + afterUnderline;

		}

		this.renderLinks = function () {

			var colorCounter = 0;
			var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

			// Iterate list of links and create
			// DOM objects for all of them.

			for (var link of this.links) {

				if (link.isList) {

					// Parent TABLE to hold it all
					var parentUL = document.createElement("ul");
					parentUL.setAttribute("class","linkTable quicklink " + colors[colorCounter]);

					// category title gets special treatment
					var titleLI = document.createElement("li");

					titleLI.id = "link_" + this.noSpaces(link.displayName);
					titleLI.setAttribute("keyCombo", link.keyCombo);

					titleLI.innerHTML = "<h3>" + this.renderUnderline(link.keyCombo, link.displayName) + "</h3>";

					parentUL.appendChild(titleLI);

					var nestedUL = document.createElement("ul");

					for (var sublink of link.list) {
						// LI for display text
						var nestedLI = document.createElement("li");
						nestedLI.id = titleLI.id + "_" + this.noSpaces(sublink.displayName);

						// A for hyperlink and keycombo attribute
						var a = document.createElement("a");
						a.href = sublink.href;
						a.setAttribute("keyCombo", sublink.keyCombo);
						a.innerHTML = this.renderUnderline(sublink.keyCombo, sublink.displayName);
						

						// Add to DOM
						nestedLI.appendChild(a);
						nestedUL.appendChild(nestedLI);
					}

					parentUL.appendChild(nestedUL);

					document.getElementById("quicklinks").appendChild(parentUL);

				} else {
					var a = document.createElement("a");
					a.href = link.href;
					a.setAttribute("keyCombo", link.keyCombo);
					a.setAttribute("class", "quicklink " + colors[colorCounter]);

					// # build container div 
					var d = document.createElement("div");
					d.id = "link_" + this.noSpaces(link.displayName);
					d.innerHTML = this.renderUnderline(link.keyCombo, link.displayName);

					a.appendChild(d);
					document.getElementById("quicklinks").appendChild(a);
				}

				colorCounter += 1;
				colorCounter %= colors.length;
			}
		}

		this.unrenderLinks = function () {
			var ql = document.getElementById("quicklinks");
			for (var x = ql.children.length - 1; x >= 0; x--) { ql.removeChild(ql.children[x]) };
		}


		this.redraw = function () {
			this.unrenderLinks();
			this.renderLinks();
		}


		this.getCursor = function (keyCombo_) {
			// search list for key match. return
			// the JSON object for the link as well
			// as a pointer to the DOM object representing it. 

			// iterate links
			for (var link of this.links) {

				var returnLink;
				var returnId; 

				// if the link's key is the first key of our combo,
				// continue
				if (link.keyCombo == keyCombo_[0]) {

					if (link.isList == false) {
						// Easy, our link is just link
						// and the object's UID is link_linkDispNameNoSpaces

						returnLink = link;
						returnId = "link_" + this.noSpaces(link.displayName);
					}
					else {
						// automatically select first list item,
						// these are overwritten later if the keyCombo
						// is any more specific
						var parentReturnId = this.noSpaces(link.displayName);
						returnLink = link.list[0];
						var childReturnId = this.noSpaces(returnLink.displayName);
						
						for (var sublink of link.list) {
							if (sublink.keyCombo == keyCombo_[1]) {
								returnLink = sublink;

								// Parent set
								parentReturnId = this.noSpaces(link.displayName);
								
								// Child element
								childReturnId = this.noSpaces(sublink.displayName);
							}
						}

						// Assemble UID link_parentIDNoSpace_childIdNoSpace
						returnId = "link_" + parentReturnId + "_" + childReturnId;
						console.log(returnId);
					}

					return [returnLink, document.getElementById(returnId)];
				}
			}
		}

		this.noSpaces = function(string) {
			var retString = "";
			for (var x = 0; x < string.length; x++) {
				var char = string.substr(x, 1); 
				if (char != " ") {
					retString += char
				}
			}

			return retString;
		}

		this.renderCursor = function (cursor_) {
			// clear all previous selections
			var allLinks = document.getElementsByClassName("selected");

			for (var x = 0; x < allLinks.length; x++) {
				allLinks[x].classList.remove("selected");
			}

			console.log(cursor_);

			if (cursor_ != undefined) {
				cursor_[1].classList.add("selected");
			}

		}

		this.popBox = function (action_, element_ = "search") {

			searchBox = document.getElementById(element_);
			searchBoxIsVisible = (searchBox.getAttribute("style") == 'visibility:visible');
			searchTerms = document.getElementById("searchTerms");

			if (action_ == "popbar") {
				if (!searchBoxIsVisible) {
					searchBox.setAttribute("style", "visibility:visible");
					searchTerms.focus();
				}
			}
			else if (action_ == "unpop") {
				searchBox.setAttribute("style", "visibility:hidden");
				searchTerms.value = "";
			}
			else if (action_ == "search") {
				if (searchBoxIsVisible) {
					//search box open
					window.location = "https://next.duckduckgo.com/?q=" + searchTerms.value;
				}
			}

		}
	}
}



