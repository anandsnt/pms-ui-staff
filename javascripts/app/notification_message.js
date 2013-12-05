var NotificationMessage = function() {
	// class for showing notification messages
	
	// function for show success message
	this.showMessage = function(dom, message){
		dom.find("#notification-message").removeClass('success_message error_message').addClass('success_message').html(message).show();
	};
	
	// function for show error message
	this.showErrorMessage = function(dom, errorMessage){
		dom.find("#notification-message").removeClass('success_message error_message').addClass('error_message').html(errorMessage).show();
	};
	
	// to close the message
	this.hideMessage = function(dom){
		dom.find("#notification-message").removeClass('success_message error_message').html('').hide();
	};
	
}