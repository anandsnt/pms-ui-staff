var FailureModal = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/failureModal";
		
	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
		that.myDom.find('#modal-close').on('click',that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		callBack();
	};
}