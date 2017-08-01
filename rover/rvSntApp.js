var GlobalApp = function() {
    var that = this;

    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;
    this.iBeaconLinker = null;
    this.enableURLChange = true;
    this.uuidService = null;
    try {
        this.desktopCardReader = new DesktopCardOperations();
        this.MLIOperator = new MLIOperation();
        this.desktopUUIDService = new DesktopUUIDService();
    }
        catch (er) {
    }


    this.DEBUG = true;

    // say hello to fellow developers
    // and with them new year!
    console.log("\n\n  _    _      _ _          _____ _   _ _______   _____                 _                           \n | |  | |    | | |        / ____| \\ | |__   __| |  __ \\               | |                          \n | |__| | ___| | | ___   | (___ |  \\| |  | |    | |  | | _____   _____| | ___  _ __   ___ _ __ ___ \n |  __  |/ _ \\ | |/ _ \\   \\___ \\| . ` |  | |    | |  | |/ _ \\ \\ / / _ \\ |/ _ \\| '_ \\ / _ \\ '__/ __|\n | |  | |  __/ | | (_) |  ____) | |\\  |  | |    | |__| |  __/\\ V /  __/ | (_) | |_) |  __/ |  \\__ \\ \n |_|  |_|\\___|_|_|\\___/  |_____/|_| \\_|  |_|    |_____/ \\___| \\_/ \\___|_|\\___/| .__/ \\___|_|  |___/\n                                                                              | |                  \n                                                                              |_|                  \n\nMay your stories be no worries, and bugs with no hurries!\n");


    this.setBrowser = function(browser) {
        if (typeof browser === 'undefined' || browser === '') {
            that.browser = "other";
        }
        else {
            that.browser = browser;
        }
        if (browser === 'rv_native' && !that.cordovaLoaded) {
            // NOTE: Cordova JS assets has been loaded along with the other dashboardJsAssetList
            that.fetchCompletedOfCordovaPlugins();
        }

    };

    this.notifyDeviceStateChange = function(device_name, type, value) {
        var displayString;

        if (type === 'device_battery_below_threshold') {
            displayString = device_name + ': Battery low (' + value + '%)';
        } else {
            displayString = device_name + ': ' + value;
        }

        document.dispatchEvent(new CustomEvent('OBSERVE_DEVICE_STATUS_CHANGE', {'detail': displayString}));
    };

    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function() {
        that.cordovaLoaded = true;
        try {
            that.cardReader = new CardOperation();
            that.iBeaconLinker = new iBeaconOperation();
        }
        catch (er) {
            console.log(er);
        }
    };

    this.enableCardSwipeDebug = function() {
        that.cardSwipeDebug = true; // Mark it as true to debug cardSwype opertations
        that.cardReader = new CardOperation();
    };

    this.reInitCardOperations = function() {
        var checkDeviceConnection = function() {
            console.log('deviceready listener...');
            sntapp.cardReader = new CardOperation();
            window.setTimeout(function() {
                document.dispatchEvent(new Event('OBSERVE_FOR_SWIPE'));
            }, 300);
            document.removeEventListener("deviceready", checkDeviceConnection, false);
        };

        sntCordovaInit();
        document.addEventListener("deviceready", checkDeviceConnection, false);
    };
};

sntapp = new GlobalApp();
// sntapp.enableCardSwipeDebug();

