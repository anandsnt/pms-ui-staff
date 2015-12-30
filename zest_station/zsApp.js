
var sntZestStation = angular.module('sntZestStation',[
		'ui.router',
		'ui.utils',
		'ng-iscroll',
		'ngDialog',
		'ngAnimate',
		'ngSanitize',
		'pascalprecht.translate',
		'ui.date',
		'ui.calendar',
		'documentTouchMovePrevent',
		'divTouchMoveStopPropogate',
		'sharedHttpInterceptor',
		'orientationInputBlurModule',
		'iscrollStopPropagation',
		'touchPress',
		'enterPress',
		'clickTouch']);


//adding shared http interceptor, which is handling our webservice errors & in future our authentication if needed
sntZestStation.config(function ($httpProvider) {
  $httpProvider.interceptors.push('sharedHttpInterceptor');
  
  
});

var GlobalZestStationApp = function(){

  /*
   * the below is copied from rover rvSntApp.js
   * to support sixpay / mli payments from zest station
   */
  
    var that = this;
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;
    this.iBeaconLinker = null;
    this.enableURLChange = true;
    try{
    	this.desktopCardReader = new DesktopCardOperations();
        this.MLIOperator = new MLIOperation();
    }
        catch(er){
    };


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
    	//$('body').append(data); zest station wont need this yet..
        that.cordovaLoaded = true;
        try{
    	   that.cardReader = new CardOperation();
        }
        catch(er){
            console.info('failed get card op');
        };
        try{
            that.iBeaconLinker = new iBeaconOperation();
        }
        catch(er){};

    };
    this.fetchCompletedOfCordovaPlugins();

    // success function of coddova plugin's appending
    this.fetchFailedOfCordovaPlugins = function(errorMessage){
    	that.cordovaLoaded = false;
    };

    this.enableCardSwipeDebug = function(){
        that.cardSwipeDebug = true; // Mark it as true to debug cardSwipe opertations
        that.cardReader = new CardOperation();
    };
    this.resdebug = false;//to debug a reservation payment request from zest station
    this.resdebug_id = 0;
    this.showDebugOptions = function(){
        angular.element("#main").scope().showDebugOptions();
    };
};

zestSntApp = new GlobalZestStationApp();