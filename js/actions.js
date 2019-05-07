sfModules = {
    "Links": {
        "create": {
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

        "remove": {
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
    },
    "Categories": {
        "create": {
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
    },

    "Search": {
        "google": {
            "title": "Google Search",
            "shortDesc": "Search Google for phrase",
            "behavior": [
                function(userInputString) {
                    // rewrite url to phrase
                    var url = "https://next.duckduckgo.com/?q=";
                    url = url + userInputString.getBuffer();
                    url = url + " !g";
                    window.location = url;
                }
            ]
        }
    }
};