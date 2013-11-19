var SuccessModal = function() {
	BaseModal.call(this);
	var that = this;
	this.myDom = $("#modal");
	this.url = "ui/successModal";
	this.delegateEvents = function() {
		var message = this.params.message;
		that.myDom.find('.message').html(message);
	};
	this.modalInit = function() {
		console.log("modal init in sub modal");
	};
	
}