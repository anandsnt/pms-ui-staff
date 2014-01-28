
var app = function(){
    var that = this;
    this.activityIndicator = new ActivityIndicator();
    this.notification = new NotificationMessage();
    this.browser = "other";
    this.cordovaLoaded = false;
    this.cardReader = null;

    this.DEBUG = true;
    this.prevPage = ''; 
    this.currentPage = ''; 

    this.init = function(){
        //that.loadFullCalendarPlugin();      
    };

    this.loadFullCalendarPlugin = function(){
        var url = "";

        if(that.ismob){
            url = "/assets/app/plugins/fullcalendar-ipad.js";
        }
        $.getScript(url);
    };
    
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
     
        
        // if(shouldShowLoader){
           // var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
           // $($loader).prependTo('body').show();
        // }
        $.ajax({
            type: "GET",
            data: params,
            url: viewURL,
            async: async,
            success: function(data) { 
                
                that.renderView(data, viewDom, nextViewParams);                 
                that.activityIndicator.hideActivityIndicator();
                
            },
            error: function(){
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
            console.log( 'Sorry ' + name + ' view instance was not found.' );
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
            console.log( 'Sorry ' + name + ' view instance already exists.' );
            return false;
        } else {
            this.viewDict[name] = callback();
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
        this.viewDict[name] = callback();
        return this.viewDict[name];
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
};

sntapp = new app();
sntapp.init();
