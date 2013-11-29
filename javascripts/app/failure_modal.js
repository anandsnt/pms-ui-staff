var FailureModal = function() {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/failureModal";
	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
	};
	this.modalInit = function() {
	};
	
}