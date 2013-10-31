BaseModal = function() {
	this.myDom = "#modal";
    this.url = "";
    this.data = "";
    this.params = {};
    this.shouldShowWhenFetched = true;
    var that = this;
    this.initialize = function(){
        that.modalInit();
        if(this.data == ""){
            that.shoduldShowWhenFetched = true;
            this.fetchFromURL();
        }
        
    }
    this.modalInit = function(){
        console.log("modal init in basemodal")
    }

    this.delegateEvents = function(){
    	console.log("base modal delegate events")
        $('#modal-overlay, #modal-close, #cancel').on('click', that.hide);

    }
    this.fetchFromURL = function() {
        // Get modal data
        $.ajax({
            type: "GET",
            data: that.params,
            url: that.url,
            success: function(data) {
                if(that.shouldShowWhenFetched){
                    that.show(data);
                }
            },
            error: function(){
                //TODO: Replace with the central mechanism for error handling
                console.log("error in modal fetching");
            }
        });
    }

    this.show = function(content){
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

        if (!$('#modal-overlay').length) 
        { 
            $($overlay).insertAfter('#modal'); 
        }

        setTimeout(function() {
            $('#modal, #modal-overlay').addClass('modal-show');
        }, 0);

        $('#modal').html(content);
        
        that.delegateEvents();

    }
    this.hide = function (){
        console.log("hide modal");
        e.stopPropagation();
        //removeModal();
        $('#modal, #modal-overlay').removeClass('modal-show'); 
        setTimeout(function() { 
            $('#modal').empty();
        }, 150);
    }
}