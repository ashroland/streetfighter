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
			var tempLinks = localStorage.getItem("links");

			// If nothing is stored there, make assumption that
			// user is visiting for first time and populate with 
			// a variety of links
			if (tempLinks == null) {
				tempLinks = this.makeDefaultLinks();
				this.saveLinks(tempLinks);
				this.loadLinks();
			} else {
				this.links = JSON.parse(tempLinks);
			}
		}

		this.makeDefaultLinks = function () {
			// make default links

			var tempLinks = [];

			tempLinks.push(
				this.makeLink("Google", "g", "https://google.com")
			);
			tempLinks.push(
				this.makeLink("Hacker News", "h", "https://news.ycombinator.com")
			);
			tempLinks.push(
				this.makeList("Social", "s", [
					this.makeLink("Twitter", "t", "https://twitter.com"),
					this.makeLink("Facebook", "f", "https://facebook.com"),
					this.makeLink("Tumblr", "u", "https://tumblr.com")
				])
			);

			return tempLinks;
		}

		this.saveLinks = function (links_ = this.links) {
			// Save links to storage. If link list not specified,
			// default to save contents of this.links
			var saveLinks = JSON.stringify(links_);
			localStorage.setItem("links", saveLinks);
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

		this.addToLinks = function (link_or_list, place = -1) {
			// Not 100% sure this is working the way I think it is
			// bc I don't think that push() takes 2 arguments like this
			// TODO
			// fix this lol
			links.push(link_or_list, place);
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

			for (var link of this.links) {

				if (link.isList) {
					// Parent DIV to hold it all
					var d = document.createElement("div");
					d.id = "link_" + link.displayName;
					d.setAttribute("keyCombo", link.keyCombo);
					d.setAttribute("class", "quicklink");
					d.innerHTML = this.renderUnderline(link.keyCombo, link.displayName);

					// UL for easy layout
					var ul = document.createElement("ul");

					for (var subLink of link.list) {
						// A for hyperlink and keycombo attribute
						var a = document.createElement("a");
						a.href = subLink.href;
						a.setAttribute("keyCombo", subLink.keyCombo);

						// LI for display text
						var li = document.createElement("li");
						var ldn = subLink.displayName;
						li.innerHTML = this.renderUnderline(subLink.keyCombo, ldn);
						li.id = "link_" + ldn;

						// Add to DOM
						a.appendChild(li);
						ul.appendChild(a);
					}
					d.appendChild(ul);
					document.getElementById("quicklinks").appendChild(d);

				} else {
					var a = document.createElement("a");
					a.href = link.href;
					a.setAttribute("keyCombo", link.keyCombo);

					// # build container div 
					var d = document.createElement("div");
					d.id = "link_" + link.displayName;
					d.setAttribute("class", "quicklink");
					d.innerHTML = this.renderUnderline(link.keyCombo, link.displayName);

					a.appendChild(d);
					document.getElementById("quicklinks").appendChild(a);
				}
			}
		}

		this.unrenderLinks = function () {
			ql = document.getElementById("quicklinks");
			for (var x = ql.children.length - 1; x >= 0; x--) { ql.removeChild(ql.children[x]) };
		}


		this.redraw = function () {
			this.unrenderLinks();
			this.renderLinks();
		}


		this.getCursor = function (keyCombo_) {
			// search list for key match
			//
			// TODO
			// refactor for legibility, yikes
			// 

			// iterate links
			for (var link of this.links) {

				var returnLink;

				// if the link's key is the first key of our combo,
				// continue
				if (link.keyCombo == keyCombo_[0]) {

					if (link.isList == false) {
						returnLink = link;
					}
					else {
						//default to top element if no better result found
						returnLink = link.list[0];

						for (var sublink of link.list) {
							if (sublink.keyCombo == keyCombo_[1]) {
								returnLink = sublink;
							}
						}
					}

					var linkId = "#link_" + returnLink.displayName;
					return [returnLink, document.querySelector(linkId)];
				}
			}
		}

		this.renderCursor = function (cursor_) {
			// clear all previous selections
			var allLinks = document.getElementsByClassName("selected");

			for (var x = 0; x < allLinks.length; x++) {
				allLinks[x].classList.remove("selected");
			}

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



