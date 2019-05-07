var keyTimer = null;
var keyTimerCount = 0;
var keyTimerLength = 125;
var keyTimerOn = false;
var keyCombo = "";


function loadLinks() {

	links = JSON.parse( localStorage.getItem("links") );

}

function saveLinks(links_=links) {

	var saveLinks = JSON.stringify( links_ );
	localStorage.setItem("links", saveLinks);
}

function makeLink(dName, key, href_) {

	newLink = {
		displayName: dName,
		href: href_,
		keyCombo: key,
		isList: false
	}

	return newLink;

}

function makeList(dName, key, links=[]) {

	newLink = {
		displayName: dName,
		keyCombo: key,
		isList: true,
		list: links
	}

	return newLink;

}

function addToLinks( link_or_list, place=-1 ) {
	links.push(addToLinks, place);
}


function renderLinks() {

	for (var x = 0; x < links.length; x++){ 
		var linkobj = links[x];

		if (links[x]["isList"] == true) {
			var d = document.createElement("div");
			d.id = "link_" + linkobj["displayName"];
			d.setAttribute("keyCombo", linkobj["keyCombo"]);
			d.setAttribute("class", "quicklink");
			d.innerHTML = linkobj["displayName"];

			var ul = document.createElement("ul");

			for (var y = 0; y < links[x]["list"].length; y++){
				var sublinkobj = links[x]["list"][y];


				// # build container
				var a = document.createElement("a");
				a.href = sublinkobj.href;
				a.setAttribute("keyCombo", sublinkobj["keyCombo"]);
				
				// # build subcontainer div
				subd = document.createElement("div")
				var li = document.createElement("li");
				li.id = "link_" + sublinkobj["displayName"] + "_" + sublinkobj["displayName"];
				li.innerHTML = sublinkobj["displayName"];
				li.id = "link_" + sublinkobj["displayName"];
				
				a.appendChild(li);
				ul.appendChild(a);
			}
			d.appendChild(ul);
			document.getElementById("quicklinks").appendChild(d);
			
		} else {
			var a = document.createElement("a");
			a.href = links[x].href;
			a.setAttribute("keyCombo", links[x].keyCombo);

			// # build container div 
			var d = document.createElement("div");
			d.id = "link_" + linkobj["displayName"];
			d.setAttribute("class","quicklink");
			d.innerHTML = linkobj["displayName"];

			a.appendChild(d);
			document.getElementById("quicklinks").appendChild(a);
		}
	}
}

function unrenderLinks() {
	ql = document.getElementById("quicklinks");
	for (var x = ql.children.length - 1; x >= 0; x-- ) { ql.removeChild(ql.children[x]) };
}


function redraw() {
	unrenderLinks();
	renderLinks();
}


function getCursor( keyCombo_ ) {
	// search list for key match
	for (var x = 0; x < links.length; x++) {
		if (links[x].keyCombo == keyCombo_[0] ) {

			var returnLink;

			if (links[x].isList == false) {
				returnLink = links[x];
			}
			else {
				//default to top element if no better result found
				returnLink = links[x]["list"][0];

				for (var y = 0; y < links[x]["list"].length; y++ ) {
					if (links[x]["list"][y].keyCombo == keyCombo_[1]) {
						returnLink = links[x]["list"][y];
					}
				}
			}

			linkId = "link_" + returnLink.displayName;
			return [returnLink, document.getElementById(linkId)];
		}
	}
}

function renderCursor( cursor_ ) {
	// clear all previous selections
	allLinks = document.getElementsByClassName("selected");

	for (var x = 0; x < allLinks.length; x++) {
		allLinks[x].classList.remove("selected");
	}

	if (cursor_ != undefined) {
		cursor_[1].classList.add("selected");
	}

}

function barCtl( action_, element_="search" ) {

	searchBox = document.getElementById(element_);
	searchBoxIsVisible = (searchBox.getAttribute("style") == 'visibility:visible');
	searchTerms = document.getElementById("searchTerms");
	
	if ( action_ == "popbar") {
		if (!searchBoxIsVisible) {
			searchBox.setAttribute("style", "visibility:visible");
			searchTerms.focus();
		}
	}
	else if ( action_ == "unpop") {
		searchBox.setAttribute("style", "visibility:hidden");
		searchTerms.value = "";
	}
	else if ( action_ == "search") {
		if (searchBoxIsVisible) {
			//search box open
			window.location = "https://next.duckduckgo.com/?q=" + searchTerms.value; 
		}	
	}

}

function barIsVisible() {
	searchBox = document.getElementById("search");
	searchBoxIsVisible = (searchBox.getAttribute("style") == 'visibility:visible');
	return searchBoxIsVisible;
}


function prettyNumbers( num_ ) {
	strNum = String(num_);
	len = strNum.length;
	diff = 4 - len;
	for (var x = 0; x < diff; x++) {
		strNum = "0" + strNum;
	}
	return strNum;
}

function init() {
	loadLinks();
	renderLinks();
	updateQuicklinks();
}

window.onkeypress = function(e) {

	key = e.code.toLowerCase();

	if (key == "space") {
		if (e.ctrlKey == true) {
			//unpop search bar
			barCtl("unpop");
		} else {
			//pop up search bar
			if (!barIsVisible())
				e.preventDefault()
				barCtl("popbar");			
		}
	}
	else if (key == "enter") {
		barCtl("search");
	} else {
		// capture key combos
		if (!barIsVisible()) {// only capture if search bar not open

			keyCombo += e.key.toLowerCase();
			renderCursor( getCursor(keyCombo) );

			if (keyTimerOn) {
				// multiple keypresses, reset timer to full
				keyTimerCount = keyTimerLength;
				if (e.key == ";") { 
					// cancel current operation
					clearInterval(keyTimer);
					keyTimerOn = false;
					keyTimerCount = 0;
					barCtl("unpop","keyComboinfo");
					keyCombo = "";
				}
			}
			else {
				keyTimerOn = true;
				keyTimerCount = keyTimerLength;
				barCtl("popbar","keyComboinfo");
				keyTimer = setInterval(function(){
					keyTimerCount -=1;

					kci = document.getElementById("keyComboinfo");
					kci.innerHTML = keyCombo;
					kci.innerHTML += "\t\t";
					kci.innerHTML += prettyNumbers(keyTimerCount);


					if (keyTimerCount <= 0) {
						clearInterval(keyTimer);
						keyTimerOn = false;
						keyTimerCount = 0;
						barCtl("unpop","keyComboinfo");
						// if cursor set, go to website
							if (getCursor(keyCombo) !== undefined) {
								link = "" + getCursor(keyCombo)[0].href;
								window.location = link;
							}
						// clear keycombo for next query
						keyCombo="";
					}
				}, 1);
			}
		}
	}
}
