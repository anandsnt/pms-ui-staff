var NotificationMessage = function() {
	// class for showing notification messages
	
	this.showSuccessLevel = "DEBUG";
	this.showErrorLevel = "DEBUG";
	this.shouldShowErrorMessages = true;
	this.shouldShowCloseButtonForSuccess = true;
	this.shouldShowCloseButtonForError = true;
	this.levels =["DEBUG","INFO", "NORMAL", "IMPORTANT","CRITICAL"];
		
	var that = this;
	var duration = 700;
	
	
	var shouldShowMessage = function(level, type) {
		// function used to determine whether to show a messages categorized below to a level
		var showLevel =(type=="Error") ? that.showErrorLevel : that.showSuccessLevel;
		
		if(that.levels.indexOf(showLevel) < that.levels.indexOf(level)) 
			return false;
		return true;
	};
	
	var scrollToErrorArea = function(dom) {
		// function used to scroll to the message displayed area	
		//not recommended method
		var parent = dom.find("#notification-message").parents("form:eq(0)");		
		var location = new String(document.location); 
		location = location.split("#")[0];
		//document.location = location + "#" + parent.attr("id") ;	
		document.location = location + "#";
		

	};
	
	this.showMessage = function(message, dom){
		
		dom.find("#notification-message").removeClass('success_message error_message').html(message).show();
		//binding the click event for close button
		dom.find("#notification-message .close-btn").on('click', function(){
			dom.find("#notification-message").slideUp(duration, function(){
				dom.find("#notification-message").removeClass('success_message error_message').html('').hide();
			});
		});
	};

	var getDisplayDom = function(){
		return $('body');
	};
	
	this.showErrorList = function(errorMessages, dom, priority){
		
       if(typeof priority === 'undefined'){
               priority = "DEBUG";
       }  
		if (!shouldShowMessage(priority, "Error")) return;
		dom = getDisplayDom();
		var message = "";
		if (errorMessages.length == 0) { 
			message = "Sorry, an undefined error occured";
		}
		else if(errorMessages instanceof Array && errorMessages.length > 1){
			message = "<UL>";
			for(var i = 0; i < errorMessages.length; i++)
				message += "<LI>" +  errorMessages[i] + "</LI>";
			message +=  "</UL>";
		}		
		else if(errorMessages instanceof Array && errorMessages.length == 1){
			// we don't want to show an ul li list
			message = errorMessages[0];
		}
		else{
			// we don't want to show an ul li list
			message = errorMessages;
		}

		
		that.showErrorMessage(message, dom, priority);
		
	}; 
	
	// function for show success message
	this.showSuccessMessage = function(message, dom, priority){
		
       if(typeof priority === 'undefined'){
               priority = "DEBUG";
       }  
		dom = getDisplayDom();
		if (!shouldShowMessage(priority, "Success")) return;
		
	
		if(typeof dom == 'undefined')
			dom = $('body');		
		
		this.hideMessage(dom);
		
		
		var htmlToAppend = message;
		// dont show close button if false
		if(this.shouldShowCloseButtonForSuccess == true) {
			htmlToAppend = "<span class='close-btn'></span>" + htmlToAppend;
		}
		
		that.showMessage(htmlToAppend, dom);
		
		dom.find("#notification-message").addClass('success_message');
		
		scrollToErrorArea(dom);
 
	};
	
	// function for show error message
	this.showErrorMessage = function(errorMessage, dom, priority){
		
       if(typeof priority === 'undefined'){
               priority = "DEBUG";
       }  
		dom = getDisplayDom();
		if (!shouldShowMessage(priority, "Error")) return;
			
		if(typeof dom == 'undefined')
			dom = $('body');	
		
		this.hideMessage(dom);
		var htmlToAppend = errorMessage;
		
		// dont show close button if false
		if(this.shouldShowCloseButtonForError == true) {
			htmlToAppend = "<span class='close-btn'></span>" + htmlToAppend;
		}
		
		that.showMessage(htmlToAppend, dom);
		
		dom.find("#notification-message").addClass('error_message');
		
		//scrolling to the message part
		scrollToErrorArea(dom); 
		 
	
	};
	
	// to close the message
	this.hideMessage = function(dom){
		
		
       if(typeof dom === 'undefined'){
               dom = $('body');
       }  
		dom = getDisplayDom();
                dom.find("#notification-message").slideUp(duration, function(){
				dom.find("#notification-message").removeClass('success_message error_message').html('').hide();
			});
//		dom.find("#notification-message").removeClass('success_message error_message').html('').hide();
		return;
	};
	
	
	
};