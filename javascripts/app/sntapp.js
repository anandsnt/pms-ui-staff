var app = function(){
    that = this;


    this.getViewInstance = function(viewDom){
        var viewInstance;
        var viewName = viewDom.find('div:first').attr('data-view');
        if(typeof viewName !== "undefined"){
            viewInstance = new window[viewName](viewDom);
        }
        
        return viewInstance;
    }

    this.renderView = function(viewData, viewDom){
        viewDom.html(viewData);
        viewObject = that.getViewInstance(viewDom);
        viewObject.initialize();
        viewObject.pageshow();
        
    }

    //Fetch from AJAX
    // On Success, invoke render_view
    // Show error message on failure
    this.fetchAndRenderView = function(viewURL, viewDom, params, shouldShowLoader){

    /*
    If you intent to call changeView or changePage function for animating page loading, 
    shouldShowLoader should be true. chageView / ChangePage functions depends on loaders presence.  
    */
        if(shouldShowLoader){
           var $loader = '<div id="loading" />';
           $($loader).prependTo('body').show();
        }
        $.ajax({
            type: "GET",
            data: params,
            url: viewURL,
            async: false,
            success: function(data) {
                that.renderView(data, viewDom);    
            },
            error: function(){
                console.log("There is an error!!");
            }
       });
    }
}

sntapp = new app();
