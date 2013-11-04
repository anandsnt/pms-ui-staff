BaseModal = function() {
    this.url = "";
    this.data = "";
    this.myDom = ""; //This will be updated in show method, as the data is inserted into DOM only there.
    this.params = {};
    this.type = "GET";
    this.shouldShowWhenFetched = true;
    var that = this;
    this.initialize = function(){
        that.modalInit();
        if(this.data == ""){
            that.shouldShowWhenFetched = true;
            this.fetchFromURL(that.type);
        }
    }
    this.modalInit = function(){
        console.log("modal init in basemodal")
    }
    
	this.unbindCancelEvent = function(){
		$('#modal-overlay, #modal-close, #cancel').off('click');
	}
	
	this.unbindEvents = function(){}
	
	this.delegateCancelEvent = function(){
		$('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
	}
	
    this.delegateEvents = function(){ }
    
    this.fetchFromURL = function(type) {
        // Get modal data
        $.ajax({
            type: type,
            data: that.params,
            url: that.url,
            success: function(data) {
            	that.data = data;
                if(that.shouldShowWhenFetched){
                    that.show();
                }
            },
            error: function(){
                //TODO: Replace with the central mechanism for error handling
                console.log("error in modal fetching");
            }
        });
    }

    this.show = function(){
        console.log("show modal");
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
    }
    this.hide = function (){
    	that.unbindCancelEvent();
    	that.unbindEvents();
    	
    	console.log("Reached hide modal");
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        }, 150);
    }
}