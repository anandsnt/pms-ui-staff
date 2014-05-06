var RoomTypeChargeModal = function(callBack) {
	BaseModal.call(this);
	var that = this;
	this.url = "ui/roomTypeChargeModal";

	this.delegateEvents = function() {
		that.myDom.find('#ok').on('click',that.okButtonClicked);
	};
	
	this.okButtonClicked = function(){
		that.hide(callBack);
	};
};