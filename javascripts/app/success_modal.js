var SuccessModal = function() {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/successModal";
	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
	};
	this.modalInit = function() {
	};
	
}