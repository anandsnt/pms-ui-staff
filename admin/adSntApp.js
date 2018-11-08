var AdminGlobalApp = function() {
    var that = this;

    this.browser = "other";
    this.cordovaLoaded = false;
    this.DEBUG = false;


    this.setBrowser = function(browser) {
        var url = "/assets/shared/cordova.js";
        //  var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
        
        if (typeof browser === 'undefined' || browser === '') {
            that.browser = "other";
        } else if (browser === 'rv_native_android') {
            that.browser = 'rv_native';
            that.cordovaLoaded = true;
        } else {
            that.browser = browser;
        }

        if (browser === 'rv_native' && !that.cordovaLoaded) {
           that.loadScript(url);
        }

    };

    this.loadScript = function(url) {
            /* Using XHR instead of $HTTP service, to avoid angular dependency, as this will be invoked from
             * webview of iOS / Android.
             */
            var xhr = new XMLHttpRequest(); // LATER: IE support?

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                      that.fetchCompletedOfCordovaPlugins(xhr.responseText);
                } else {
                    that.fetchFailedOfCordovaPlugins();
                }
            };
            xhr.open("GET", url, true);

            xhr.send(); // LATER: Loading indicator
    };


    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function(data) {
        var script_node = document.createElement('script');

        script_node.innerHTML = data;

        document.body.appendChild(script_node);
        that.iBeaconLinker = new iBeaconOperation();
        that.cordovaLoaded = true;
    };

    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function() {
        that.cordovaLoaded = false;
    };

};

adminapp = new AdminGlobalApp();