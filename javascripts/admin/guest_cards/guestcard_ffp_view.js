var GuestCardFFPView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;
	
	this.delegateSubviewEvents = function(){
    	that.myDom.find('#ffp').tablesorter();
   	};
	// To handle active/inactive ffps.
	this.toggleButtonClicked = function(element){
	    var ffpId = element.closest('tr').attr('ffp-id');
	    setTimeout(function(){
          	var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
          	var postParams = {"id" : ffpId, "set_active" : toggleStatus};

          	var webservice = new WebServiceInterface(); 
          	var options = {
               	requestParameters: postParams,
               	loader: "NONE"
          	};
          	var url = '';
          	webservice.postJSON(url, options);
          	return true;
	    }, 100);
	};
};
