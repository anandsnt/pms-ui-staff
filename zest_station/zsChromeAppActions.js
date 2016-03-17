this.chromeApp = function(onMessageCallback) {
    var that = this;
    if (chrome && chrome.runtime){
        //only init these if using chrome, this is for the chromeapp virtual keyboard
        that.onChromeAppMsgResponse = function(response){
            onMessageCallback(response);
            if (response.isChromeApp){
                this.inChromeApp = true;
            }
        };
        that.setupChromeAppListener = function(){
            // The ID of the extension we want to talk to.
            var chromeAppId = "pbnaoggobpaanmddgenkfnicmpfhpijd";
            // Make a simple request:
            chrome.runtime.sendMessage(chromeAppId, {fromZestStation: true},this.onChromeAppMsgResponse);
        };
        that.setupChromeAppListener();
    }
    return that;
};