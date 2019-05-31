/*jshint esversion: 6 */

var MODULE_SUCCESS = 9000;

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
                    return MODULE_SUCCESS;
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
                    return MODULE_SUCCESS;
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
                    return MODULE_SUCCESS;
                }
            ]
        },
    },

    "Search": {
        "google": {
            "title": "Google Search",
            "shortDesc": "Search Google for phrase",
            "behavior": [
                function (userInputString) {
                    // rewrite url to phrase
                    var url = "https://next.duckduckgo.com/?q=";
                    url = url + userInputString.getBuffer();
                    url = url + " !g";
                    window.location = url;
                    return MODULE_SUCCESS;
                }
            ],
            "acceptsInput":true
        },

        "googleImage": {
            "title": "Google Image Search",
            "shortDesc": "Search Google Images for phrase",
            "behavior": [
                function (userInputString) {
                    var url = "https://next.duckduckgo.com/?q=";
                    url = url + userInputString.getBuffer();
                    url = url + " !gi";
                    window.location = url;
                    return MODULE_SUCCESS;
                }
            ],
            "acceptsInput":true
        },

        "ddg": {
            "title": "DuckDuckGo Search",
            "shortDesc": "Search DuckDuckGo for phrase",
            "behavior": [
                function (userInputString) {
                    // rewrite url to phrase
                    var url = "https://next.duckduckgo.com/?q=";
                    url = url + userInputString.getBuffer();
                    window.location = url;
                    return MODULE_SUCCESS;
                }
            ],
            "acceptsInput":true
        }
    },

    // Demo behaviors for implementing menu scrolling 
    // on large result sets

    "Demo": {
        "aaa": {
            "title": "aaa",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("aaa");
                    return MODULE_SUCCESS;
                }
            ]
        },
        "bbb": {
            "title": "bbb",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("bbb");
                    return MODULE_SUCCESS;
                }
            ]
        },
        "ccc": {
            "title": "ccc",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("ccc");
                    return MODULE_SUCCESS;
                }
            ]
        },
        "ddd": {
            "title": "ddd",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("ddd");
                    return MODULE_SUCCESS;
                }
            ]
        },
        "eee": {
            "title": "eee",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("eee");
                    return MODULE_SUCCESS;
                }
            ]
        },
        "fff": {
            "title": "fff",
            "shortDesc": "demo",
            "behavior": [ // a sorted list walking through all steps of action
                function () {
                    alert("fff");
                    return MODULE_SUCCESS;
                }
            ]
        }
    },
};