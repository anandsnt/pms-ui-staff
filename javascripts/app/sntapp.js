var DEBUG_LEVEL = 5;

var is_level_higher = function(level){
    return true;
}
function qlog(message, level){
    //if (is_level_higher(level)) console.log(message);
}

var app = function(){
    var that = this;
    this.activityIndicator = new ActivityIndicator();
    this.notification = new NotificationMessage();
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;

    this.DEBUG = true;
    this.cardSwipePrevView = '';
    this.cardSwipeCurrView = 'StayCard';
    this.currentPage = '';


    this.getViewInstance = function(viewDom){
        var viewInstance;
        var viewName = viewDom.find('div:first').attr('data-view');

        if(typeof viewName !== "undefined"){
            try{
                viewInstance = new window[viewName](viewDom);
            }
            catch(e){
            }
        }

        return viewInstance;
    };

    this.renderView = function(viewData, viewDom, viewParams){
        viewDom.html(viewData);
        viewDom.addClass("current");

        var viewObject = that.getViewInstance(viewDom);
     // CR Sajith: if viewObject is undefined or nil, show a predefined error message & return.
        try{

            if((viewParams != null) && (typeof viewParams != undefined)){
                viewObject.viewParams = viewParams;
            }
            viewObject.initialize();
            viewObject.pageshow();

        }

        catch(e){
            console.log("view object is not defined");
        }
        /*if((viewParams != null) && (typeof viewParams != undefined)){
            viewObject.viewParams = viewParams;
        }
        viewObject.initialize();
        viewObject.pageshow();*/
    };


    //Fetch from AJAX
    // On Success, invoke render_view
    // Show error message on failure
    this.fetchAndRenderView = function(viewURL, viewDom, params, loader, nextViewParams, async) {

       if(typeof params === 'undefined'){
               params = {};
       }
       if(typeof loader === 'undefined'){
               loader = 'None';
       }
       if(typeof nextViewParams === 'undefined'){
               nextViewParams = {};
       }
       if(typeof async === 'undefined'){
               async = true;
       }
    /*
    If you intent to call changeView or changePage function for animating page loading,
    shouldShowLoader should be true. chageView / ChangePage functions depends on loaders presence.
    */

    // loader options are ['None', "BLOCKER", 'NORMAL']

        that.activityIndicator.showActivityIndicator(loader);


        $.ajax({
            type: "GET",
            data: params,
            url: viewURL,
            async: async,
            success: function(data) {

                params.callback && params.callback();

                that.renderView(data, viewDom, nextViewParams);
                that.activityIndicator.hideActivityIndicator();

            },
            error: function(jqxhr, status, error){
                //Show ows connectivity error popup
                if (jqxhr.status=="520") {
                    sntapp.activityIndicator.hideActivityIndicator();
                    sntapp.showOWSErrorPopup();
                    return;
                }
                //checking whether a user is logged in
                if (jqxhr.status == "401") { sntapp.logout(); return;}
                if (jqxhr.status=="501" || jqxhr.status=="502" || jqxhr.status=="503") {
                    location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
                    return;
                }

                if(jqxhr.status=="404"){
                    location.href = XHR_STATUS.SERVER_DOWN;
                    return;
                }
                that.notification.showErrorMessage('An error has occured while fetching the view' );
                that.activityIndicator.hideActivityIndicator();
            }

       });
    };

    this.setBrowser = function(browser){
    	if(typeof browser === 'undefined' || browser === ''){
    		that.browser = "other";
    	}
    	else{
    		that.browser = browser;
    	}
    	if(browser === 'rv_native' && !that.cordovaLoaded){

    		var webservice = new WebServiceInterface();
    		var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
    		var options = {
    					successCallBack: that.fetchCompletedOfCordovaPlugins,
    					failureCallBack: that.fetchFailedOfCordovaPlugins,
    					loader: 'BLOCKER',
    				};
    		webservice.getHTML(url, options);
    	}
    };

    // DEBUG: Autofill login details
    this.autoFillLogin = function(email, pass) {
        email && typeof email === 'string' && $('#email').val(email);
        pass && typeof pass === 'string' && $('#password').val(pass)
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

    /**
    *   A dict to keep reference to shared views
    *   @dict
    */
    this.viewDict = {};

    /**
    *   A getter method to return the view instance
    *   @param {String} name of the view instance
    *   @return {Object} the matched view instance
    *   @return {Boolean} false if the matched instance was not found
    */
    this.getViewInst = function(name) {
        if ( this.viewDict[name] ) {
            return this.viewDict[name];
        } else {
            return false;
        }
    };

    /**
    *   A setter method to save new view instance
    *   @param {String} name of the view instance
    *   @param {Function} callback that will return the new instance
    *   @return {Object} the view instance itself so that its easy to chain
    *   @return {Boolean} false if the instance already exists
    */
    this.setViewInst = function(name, callback) {
        if ( this.viewDict[name] ) {
            that.updateViewInst(name, callback);
        } else {
            if ('function' === typeof callback) {
                this.viewDict[name] = callback();
            } else {
                this.viewDict[name] = callback;
            };
            return this.viewDict[name];
        }
    };

    /**
    *   A setter method to update a view instance
    *   @param {String} name of the view instance
    *   @param {Function} callback that will return the new instance
    *   @return {Object} the view instance itself so that its easy to chain
    *   @return {Boolean} false if the instance already exists
    */
    this.updateViewInst = function(name, callback) {
        delete this.viewDict[name];
        if ('function' === typeof callback) {
            this.viewDict[name] = callback();
        } else {
            this.viewDict[name] = callback;
        };
        return this.viewDict[name];
    };

    this.logout = function(){
        window.location = "/logout";
    };

    this.enableCardSwipeDebug = function(){
        that.cardSwipeDebug = true; // Mark it as true to debug cardSwype opertations
        that.cardReader = new CardOperation();
    };

    this.showOWSErrorPopup = function() {
        var owsConnectivityModal = new OWSConnectivityModal();
        owsConnectivityModal.initialize();
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

