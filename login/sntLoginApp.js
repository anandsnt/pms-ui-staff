var GlobalApp = function() {
    var that = this;

    this.browser = "other";
    this.cordovaLoaded = false;
    this.loginUpdate = null;

    this.DEBUG = true;

    // say hello to fellow developers
    // and with them new year!
    console.log("\n\n  _    _      _ _          _____ _   _ _______   _____                 _                           \n | |  | |    | | |        / ____| \\ | |__   __| |  __ \\               | |                          \n | |__| | ___| | | ___   | (___ |  \\| |  | |    | |  | | _____   _____| | ___  _ __   ___ _ __ ___ \n |  __  |/ _ \\ | |/ _ \\   \\___ \\| . ` |  | |    | |  | |/ _ \\ \\ / / _ \\ |/ _ \\| '_ \\ / _ \\ '__/ __|\n | |  | |  __/ | | (_) |  ____) | |\\  |  | |    | |__| |  __/\\ V /  __/ | (_) | |_) |  __/ |  \\__ \\ \n |_|  |_|\\___|_|_|\\___/  |_____/|_| \\_|  |_|    |_____/ \\___| \\_/ \\___|_|\\___/| .__/ \\___|_|  |___/\n                                                                              | |                  \n                                                                              |_|                  \n\nMay your stories be no worries, and bugs with no hurries!\n");


    this.setBrowser = function(browser) {
        
        var url = "/assets/shared/cordova.js";

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
    this.fetchCompletedOfCordovaPlugins = function(script) {
        // $("body").append('<script type="text/javascript">'+ script +'</script>');
        
        var script_node = document.createElement('script');
        // script_node.src = url;

        script_node.innerHTML = script;

        document.getElementById("login-page").appendChild(script_node);
        that.cordovaLoaded = true;
        
        try {
            
           that.loginUpdate = new LoginOperation();

        }
        catch (er) {
        }

    };
    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function() {
        that.cordovaLoaded = false;
    };
};

sntapp = new GlobalApp();
// sntapp.enableCardSwipeDebug();

