var BaseModal = function() {
    this.url = "";
    this.data = "";
    this.myDom = ""; //This will be updated in show method, as the data is inserted into DOM only there.
    this.params = {};
    this.type = "GET";
    this.shouldShowWhenFetched = true;
    var that = this;
    this.initialize = function(options){
        that.modalInit(options);

        if(this.data == ""){
            that.shouldShowWhenFetched = true;
            this.fetchFromURL(that.type);
        }
    };

    this.modalInit = function(){
    };
    
    this.modalDidShow = function(){
    };
    
	this.unbindCancelEvent = function(){
		$('#modal-overlay, #modal-close, #cancel').off('click');
	};
	
	this.unbindEvents = function(){};
	
	this.delegateCancelEvent = function(){
		$('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
	};
	
    this.delegateEvents = function(){ };
    
    //success function of fetchFromURL's ajax call
    this.fetchCompletedOfFetchFromURL = function(data){
        that.data = data;
        if(that.shouldShowWhenFetched){
            that.show();
        }        
    };    

    // function for fetching the popup
    this.fetchFromURL = function(type) {        
        var options = {
          loader: 'BLOCKER',
          successCallBack : that.fetchCompletedOfFetchFromURL,
          requestParameters: that.params
        };
        var url = that.url;
        var webservice = new WebServiceInterface();
        if(type == "GET"){
            webservice.getHTML(url, options);        
        }
        else if(type == "POST"){
            webservice.postHTML(url, options);
        }
    };

    this.show = function(){
        $modal = '<div id="modal" role="dialog" />',
        $overlay = '<div id="modal-overlay" />';

        //setModal();

        if ($('#modal').length) 
        { 
            $('#modal').empty(); 
        }
        else 
        { 
            $($modal).prependTo('body'); 
        }
		
		that.myDom = $('#modal'); // This cannot be done before, as #modal is added to DOM only now.
		
        if (!$('#modal-overlay').length) 
        { 
            $($overlay).insertAfter('#modal'); 
        }

        setTimeout(function() {
            $('#modal, #modal-overlay').addClass('modal-show');
        }, 0);

        $('#modal').html(that.data);
        that.delegateCancelEvent();
  		that.delegateEvents();
        that.modalDidShow();
    };

    this.hide = function (callBack){
    	that.unbindCancelEvent();
    	that.unbindEvents();
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        	if(typeof callBack === "function") callBack();
        }, 150);
    };
};
