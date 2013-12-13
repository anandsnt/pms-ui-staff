
var app = function(){
    var that = this;
    this.activityIndicator = new ActivityIndicator();
    this.notification = new NotificationMessage();    	
    
    this.getViewInstance = function(viewDom){
        var viewInstance;
        var viewName = viewDom.find('div:first').attr('data-view');

        if(typeof viewName !== "undefined"){
            viewInstance = new window[viewName](viewDom);            
        }
        
        
        
        return viewInstance;
    };

    this.renderView = function(viewData, viewDom, viewParams){
        viewDom.html(viewData);
        viewDom.addClass("current");
        
        var viewObject = that.getViewInstance(viewDom);
        
     // CR Sajith: if viewObject is undefined or nil, show a predefined error message & return.
        
        if((viewParams != null) && (typeof viewParams != undefined)){
            viewObject.viewParams = viewParams;
        }
        viewObject.initialize();
        viewObject.pageshow();
    };
    

    //Fetch from AJAX
    // On Success, invoke render_view
    // Show error message on failure
    this.fetchAndRenderView = function(viewURL, viewDom, params, loader, nextViewParams) {
      
       if(typeof params === 'undefined'){
               params = {};
       } 
       if(typeof loader === 'undefined'){
               loader = 'None';
       }  
       if(typeof nextViewParams === 'undefined'){
               nextViewParams = {};
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
            async: true,
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

};

sntapp = new app();


