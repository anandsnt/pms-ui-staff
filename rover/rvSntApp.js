var GlobalApp = function(){
    var that = this;
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;
    this.iBeaconLinker = null;
    this.enableURLChange = true;

    this.DEBUG = true;


    
    this.setBrowser = function(browser){
    	if(typeof browser === 'undefined' || browser === ''){
    		that.browser = "other";
    	}
    	else{
    		that.browser = browser;
    	}
    	if(browser === 'rv_native' && !that.cordovaLoaded){
    	   //TODO: check URL
    		var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
    	
    		/* Using XHR instead of $HTTP service, to avoid angular dependency, as this will be invoked from
    		 * webview of iOS / Android.
    		 */ 
    		var xhr=new XMLHttpRequest(); //TODO: IE support?
    		
    		xhr.onreadystatechange=function() {
  				if (xhr.readyState==4 && xhr.status==200){
  					that.fetchCompletedOfCordovaPlugins(xhr.responseText);
  				} else {
  					that.fetchFailedOfCordovaPlugins();
  				}
  			};
  			xhr.open("GET",url,true);
  			
			xhr.send(); //TODO: Loading indicator

    	}	
    	
    };

    
    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function(data){
    	$('body').append(data);
        try{
    	   that.cardReader = new CardOperation();
        }
        catch(er){};
        try{
            that.iBeaconLinker = new iBeaconOperation();
        }
        catch(er){};
    	that.cordovaLoaded = true;
    };
    
    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function(errorMessage){    
    	that.cordovaLoaded = false;
    };


    this.enableCardSwipeDebug = function(){
        that.cardSwipeDebug = true; // Mark it as true to debug cardSwype opertations
        that.cardReader = new CardOperation();
    };
};

sntapp = new GlobalApp();
// sntapp.enableCardSwipeDebug();

