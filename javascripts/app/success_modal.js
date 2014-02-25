var SuccessModal = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/successModal";

	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
		that.myDom.find('#modal-close,#ok').on('click',that.okButtonClicked);
		$('#modal-overlay').on('click', that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		that.hide(callBack);
	};
};