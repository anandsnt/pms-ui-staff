this.chromeApp = function(onMessageCallback, chromeAppId, fetchQRCode) {
    var that = this;
    if (typeof chrome !== "undefined" && typeof chrome.runtime !=="undefined"){
        //only init these if using chrome, this is for the chromeapp virtual keyboard
        that.onChromeAppMsgResponse = function(response){
            onMessageCallback(response);
            if (response){
                if (response.isChromeApp){
                    this.inChromeApp = true;
                }
            }
        };
        that.setupChromeAppListener = function(){
            // The ID of the extension we want to talk to.
            // Make a simple request:
            chrome.runtime.sendMessage(chromeAppId, {fromZestStation: true},this.onChromeAppMsgResponse);
            
        };
        that.fetchQRCode = function(){
          chrome.runtime.sendMessage(chromeAppId, "initQRCodeScan",this.onChromeAppMsgResponse);  
        };
        if (fetchQRCode){
            that.fetchQRCode();
        } else {
            that.setupChromeAppListener();
        }
    }
    return that;
};