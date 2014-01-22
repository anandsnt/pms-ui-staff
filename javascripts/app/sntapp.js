
var app = function(){
    var that = this;
    this.activityIndicator = new ActivityIndicator();
    this.notification = new NotificationMessage();
    this.browser = "other";
    this.cardReader = null;
    
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
    
    this.setBrowser = function(browser){
        if(typeof browser === 'undefined' || browser === ''){
            that.browser = "other";
        }
        else{
            that.browser = browser;
        }
        if(browser === 'rv_native'){
            
            $.ajax({
                url: "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true",
                success: function(data){
                    $('body').append(data);
                    that.cardReader = new CardOperation();
                },
                error: function(data){
                    alert('from error: ' + data);
                }
                
            });
            /*var webservice = new WebServiceInterface();
            var url = "/ui/show?haml_file=cordova/cordova_ipad_ios&json_input=cordova/cordova.json&is_hash_map=true&is_partial=true";
            var options = {                
                        successCallBack: function(data){alert(data); $('body').append(data);},
                        failureCallBack: function(errorMessage){alert("From error messae: " + errorMessage);console.log(errorMessage);},
                        loader: 'BLOCKER',
                        }
            webservice.getHTML(url, options);*/
        }   
    };
    
};

sntapp = new app();