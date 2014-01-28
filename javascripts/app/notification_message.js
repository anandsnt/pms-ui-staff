var NotificationMessage = function() {
	// class for showing notification messages
	this.showSuccessLevel = "DEBUG";
	this.showErrorLevel = "DEBUG";
	
	this.shouldShowErrorMessages = true;
	this.shouldShowSuccessMessage = true;
	
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
		//in admin screens div scroll and in rover scroll is generated using iscroll
		//to handle selecting current app
		var currentApp = $("body").attr("id");
		if((currentApp == "snt-admin-view") || (currentApp == "hotel-admin-view"))
		{
			dom.animate({
				scrollTop: 0
			}, 300);
			$(window).scrollTop($('#notification-message').offset().top);
		} else {
			// console.log(dom.attr("id"));
			var element = dom.find('#notification-message')[0];
			// console.log(viewScroll.scrollToElement);
			var time = 2000;
			viewScroll.scrollToElement(element, time);
		}

	};
	
	this.showMessage = function(message, dom, message_class){
	
		var message_element = dom.find("#notification-message");
		message_element.removeClass('success_message error_message').addClass(message_class);
		message_element.html(message);			
		scrollToErrorArea(dom);			
		dom.find("#notification-message").slideDown(duration, function() {});
				
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
		
		// only show success message if 'shouldShowSuccessMessage' is set to true
		if(!this.shouldShowSuccessMessage) {return;}
		
        if(typeof priority === 'undefined'){
               priority = "DEBUG";
        }          
        
		//dom = getDisplayDom();
		if (!shouldShowMessage(priority, "Success")) return;
		
	
		if(typeof dom == 'undefined')
			dom = $('body');		
		
		this.hideMessage(dom);
		
		
		var htmlToAppend = message;
		// dont show close button if false
		if(this.shouldShowCloseButtonForSuccess == true) {
			htmlToAppend = "<span class='close-btn'></span>" + htmlToAppend;
		}
		
		that.showMessage(htmlToAppend, dom, 'notice success');

 
	};
	
	// function for show error message
	this.showErrorMessage = function(errorMessage, dom, priority){
		
		// only show success message if 'shouldShowErrorMessages' is set to true
		if(!this.shouldShowErrorMessages) { return; }
	
		if(typeof priority === 'undefined') { priority = "DEBUG"; }
        if(typeof dom === "undefined"){
        	dom = getDisplayDom();
        }
			
		if (!shouldShowMessage(priority, "Error")) { return; };
			
		this.hideMessage(dom);
		
		var htmlToAppend = errorMessage;
		
		// dont show close button if false
		if(this.shouldShowCloseButtonForError == true) {
			htmlToAppend = "<span class='close-btn'></span>" + htmlToAppend;
		}
		
		that.showMessage(htmlToAppend, dom, 'notice error');
		 
	
	};
	
	// to close the message
	this.hideMessage = function(dom){
		// dom = getDisplayDom();
		if(typeof dom == 'undefined')
			dom = $('body');
        dom.find("#notification-message").slideUp({ 
        	duration : duration, 
        	complete : function(){
        		// var myElement = dom.find("#notification-message");
        		var myElement = dom.find("#notification-message");
        		 if (myElement.queue( "fx" ).length <=1)   {
        			myElement.removeClass('notice success_message error_message').html('');
        		 }
        	}, 
        });
        
	};
	
	
	
};