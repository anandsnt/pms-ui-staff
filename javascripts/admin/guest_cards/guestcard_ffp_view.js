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
               	successCallBack : that.fetchCompletedOfSave,
               	failureCallBack : that.fetchFailedOfSave,
               	loader: "NONE"
          	};
          	var url = '/admin/hotel/toggle_ffp_activation/';
          	webservice.postJSON(url, options);
          	return true;
	    }, 100);
	};
	
	// To handle success on save API
	this.fetchCompletedOfSave = function(errorMessage) {
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
	};
	
	// To handle failure on save API
	this.fetchFailedOfSave = function(errorMessage) {
		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
	};
	
	
};
