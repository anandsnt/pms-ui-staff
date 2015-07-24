var AutoRoomAssignmentModal = function(room) {
	BaseModal.call(this);
	var that = this;

	this.url = "ui/autoRoomAssignmentModal?room="+room;

	this.delegateEvents = function() {

		that.myDom.find('#close').on('click',that.closeButtonClicked);
	};
	this.closeButtonClicked = function(){

		var goToNextViewAfterAssignment = that.params.closeButtonCall;
		goToNextViewAfterAssignment(that.params.data, that.params.requestParams);
		that.hide();
	};


};