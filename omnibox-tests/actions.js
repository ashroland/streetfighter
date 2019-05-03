sfModules = {
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