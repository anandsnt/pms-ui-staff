var AdminGlobalApp = function(){
    var that = this;
    this.browser = "other";
    this.cordovaLoaded = false;
    this.DEBUG = false;


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

  				if (xhr.readyState===4 && xhr.status===200){
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
        that.iBeaconLinker = new iBeaconOperation();
    	that.cordovaLoaded = true;
    };

    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function(errorMessage){
    	that.cordovaLoaded = false;
    };

};

adminapp = new AdminGlobalApp();