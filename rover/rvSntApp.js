var app = function(){
    var that = this;
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;

    this.DEBUG = true;
    this.cardSwipePrevView = ''; 
    this.cardSwipeCurrView = 'StayCard'; 

    
    this.setBrowser = function(browser){
    	if(typeof browser === 'undefined' || browser === ''){
    		that.browser = "other";
    	}
    	else{
    		that.browser = browser;
    	}
    	BaseCtrl.call(this);
    	// if(browser === 'rv_native' && !that.cordovaLoaded){
    			// alert("raecdddddddddddeh")
    		// var webservice = new WebServiceInterface();
    		// var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
    		// var options = {				   
    					// successCallBack: that.fetchCompletedOfCordovaPlugins,
    					// failureCallBack: that.fetchFailedOfCordovaPlugins,
    					// loader: 'BLOCKER',
    				// };
    		// webservice.getHTML(url, options);
    	// }	
    };

    
    // success function of coddova plugin's appending
    this.fetchCompletedOfCordovaPlugins = function(data){
    	$('body').append(data);
    	that.cardReader = new CardOperation();
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

    

    this.ismob = (function(navigator) { 
      if( navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)
     ){
        return true;
      }
     else {
        return false;
      }
    })(navigator);  

    //Stores the card data to process while check-in
    this.regCardData = {}; 
    //Flag to check if a payment done via card swipe 
    this.paymentTypeSwipe = false;

};

sntapp = new app();
// sntapp.enableCardSwipeDebug();

