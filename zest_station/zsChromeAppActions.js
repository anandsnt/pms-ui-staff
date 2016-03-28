this.chromeApp = function(onMessageCallback, chromeAppId, fetchQRCode) {
    var that = this;
    if (typeof chrome !== "undefined" && typeof chrome.runtime !=="undefined"){
        //only init these if using chrome, this is for the chromeapp virtual keyboard
        that.onChromeAppMsgResponse = function(response){
            console.log(response);
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
            if(chromeAppId) {
                chrome.runtime.sendMessage(chromeAppId, {fromZestStation: true}, this.onChromeAppMsgResponse);
            }
        };
        
        
        that.cancelNextMsg = false;
        that.listenerForQRCodeResponse = function(response){
            console.log(':: listenerForQRCodeResponse ::',response);
            var msg = {
                listening: true,
                attempt: (that.qrAttempt+1)
            };
            console.log('msg from ChromeApp:', response);
            
            if (!response.qr_code){
                setTimeout(function(){
                    console.log('sending listening response obj for QR code...');
                    if (!that.cancelNextMsg){
                        chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
                    } else {
                        console.log('should stop sending messages to chrome app now :)');
                    }
                    
                },2000);
            } else {
                that.cancelNextMsg = true;
                console.log('GOT QR CODE BACK FROM CHROMEAPP !!! : ',response.reservation_id);
                msg.listening = false;
                onMessageCallback({
                    qr_code: true,
                    reservation_id: response.reservation_id
                });
                
                chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
            }
            
            
            //this.onChromeAppMsgResponse();
        };
        
        that.qrAttempt = 0;
        that.fetchQRCode = function(){ 
            var msg = 'initQRCodeScan';
            console.log('listening for scan...on app id: [ '+chromeAppId+' ]');
            chrome.runtime.sendMessage(chromeAppId, msg, that.listenerForQRCodeResponse);
            console.log('SENDING message: ',msg);
            /*
            var port = chrome.runtime.connect(chromeAppId,{name: "qrcode"});
            port.onMessage.addListener(function(msg) {
                console.log('chrome app sent a message back for Knock knock! :p ');
                if (msg.answer){
                    port.postMessage({joke: "the_end"});
                    onMessageCallback(onMessageCallback(msg.answer));
                }
            });
            port.postMessage({joke: "whats up?"});
            */
        };
        
        
        
        if (fetchQRCode){
            that.fetchQRCode();
        } else {
            that.setupChromeAppListener();
        }
    }
    return that;
};