# streetfighter
### keycombo-driven replacement for browsers' default new-tab page

Under HEAVY development, most user-friendly features have not been implemented yet so use at your own discretion


### philosophy

provide the end-user a very quick jumping-off point for new tabs. make 
that user interface keyboard-driven. provide omnibox-like search. make 
all user functions for adding and removing links keyboard-driven. keep 
it legible vanilla JS. 

---

### TO-DO

- ✓ Default links for new visitor
- ✓ More apparent keystroke highlighting

- HTML5 Web Storage
	- ✓ all Links stored as objects on users' computer
	- ✓ load / save function 
	- ✓ interface for making / removing / ordering links
		- keystrokes for these -- HOLD FOR OMNIBOX
	- Save to File
		- ✓ export to base64
		- trigger download / pop user-selectable area
	- Load from File
		- ✓ import from base64
		- pop fileprompt / user pasteable area
	- Reminder system to back up links
		- Field stored in userprefs - {"lastBackup":date()}

- "Omnibox" - sublimetext-like menu for all user functions
	- ✓ many search engines
	- Update behavior
		- selecting a menu option w arrows clears userinputstring but doesn't clear out search results
	- Modules for common actions: make link, make category, rearrange order, etc.  

- User Prefs
	- Timer-style link selection on/off
		- Arrow key navigation
	- Color schemes
		- CSS Templating
	- User-defined keymap for the DVORAK et. al kids

