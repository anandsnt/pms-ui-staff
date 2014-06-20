var OWSConnectivityModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "/ui/show?haml_file=modals/ows_connectivity_modal&is_partial=true";
  	
  	this.delegateEvents = function(){
		that.myDom.find('#try-again').on('click', that.tryAgainButtonPressed);
	};

	/**
	* Popup should not close clicking in the overlay
	*/
	this.modalDidShow = function(){
		$("#modal-overlay").unbind("click");
		$("#modal-overlay").addClass("locked");
	};

	/**
	* Call API to test the OWS connection
	*/
	this.tryAgainButtonPressed = function() {

		var postData = {};
	 	var url = '/admin/test_pms_connection';
	 	var webservice = new WebServiceInterface();
	 	var options = {
			successCallBack: that.connectionSuccess,
			failureCallBack: that.connectionFailed,
			loader: 'blocker'
	 	};

		webservice.postJSON(url, options);
	}

	this.connectionSuccess = function() {
		that.hide();
		window.location.reload();
	}

	this.connectionFailed = function() {
	}
};
