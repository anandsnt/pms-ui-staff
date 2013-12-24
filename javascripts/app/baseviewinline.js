var BaseInlineView = function(viewDom){
 /*  
  * for appending data-inline as in perspective's likes
  * the scenarios found in perspective
 	* 	detailed form to next the table's row (scenario found in likes page)
 	* 	to hide the current row (ie., clicked one), adding the class hide-content
  *  we are assuming the event binded to 'tr' not to the 'a' tag
  */
  BaseView.call(this);
  this.myDom = viewDom;
  var that = this;
  
  this.delegateEvents = function(){
  	that.myDom.find('tr').on('click', that.appendInlineData);
  	that.myDom.find('#add-new-button').on('click', that.addNewForm);
  	
  };
  this.addNewForm = function(event){
  	// element.closest('div[data-view-type="inline-forms"]');
  		event.preventDefault();
		var element = $(event.target);
		var webservice = new WebServiceInterface();
		var url = element.attr("href");
		
		if(typeof url === 'undefined' && url == "#" )
			return false;
		
	    var options = {
				   successCallBack: that.fetchCompletedOfNewForm,
				   failureCallBack: that.fetchFailedOfData,
				   successCallBackParameters : {'element': element},
	    		   loader: 'normal',
		};
	    webservice.getHTML(url, options);
  };
  this.fetchCompletedOfNewForm = function(data, requestParameters){	
		sntapp.activityIndicator.showActivityIndicator("BLOCKER");
        setTimeout(function() {
    	    $("#new-form-holder").html(data);
    	    that.myDom.find("div.actions #cancel.button.blank").on('click', that.cancelFromAddNewForm);
    	    that.myDom.find("div.actions #save.button.green").on('click', that.addNewData);
    	    sntapp.activityIndicator.hideActivityIndicator();
        }, 300);				
		
	};
	
  this.appendInlineData = function(event) {	+
  				
		event.preventDefault();
		var element = $(event.target);
		if(element.prop('tagName') != "A" && element.hasClass('edit-data-inline') == false)
			return false;	
		
		var webservice = new WebServiceInterface();
		var url = element.attr("href");
		
		if(typeof url === 'undefined' && url == "#" )
			return false;
		
	    var options = {
				   successCallBack: that.fetchCompletedOfAppendInlineData,
				   failureCallBack: that.fetchFailedOfData,
				   successCallBackParameters : {'element': element},
	    		   loader: 'normal',
		};
	    webservice.getHTML(url, options);	
	};  

	this.fetchCompletedOfAppendInlineData = function(data, requestParameters){	
		console.log('from fetchCompletedOfAppendInlineData');
		var containerTable = requestParameters['element'].parents("table:eq(0)");
		var element = requestParameters['element'].parents("tr:eq(0)");
		
		containerTable.find("tr.edit-data").remove();
		containerTable.find("tr.hide-content").removeClass('hide-content');
		element.addClass("hide-content");
		sntapp.activityIndicator.showActivityIndicator("BLOCKER");
        setTimeout(function() {
    	    $(data).insertAfter(element);
    	    containerTable.find("div.actions #cancel.button.blank").on('click', that.cancelFromAppendedDataInline);
    	    containerTable.find("div.actions #update.button.green").on('click', that.updateData);
    	    
    	    sntapp.activityIndicator.hideActivityIndicator();
        }, 300);				
		
	};
	//Add new data
    this.addNewData = function(event){
    	
    	that.callSaveApi();// Override this function to call the individual API
    	that.cancelFromAppendedDataInline(event);
    };
    //Update data
    this.updateData = function(event){
    	that.updateApi();// Override this function to call the individual API
    	that.cancelFromAppendedDataInline(event);
    };
	
	// event to handle cancel button click in form
	// Ask Sajith: If it is handling seperately in the view, then..
	this.cancelFromAppendedDataInline = function(event){

		var element = $(event.target);
		var containerTable = element.parents("table:eq(0)");
		var parentToRemove = element.parents("tr:eq(0)");
		if(typeof parentToRemove === 'undefined'){
			sntapp.notification.showErrorMessage('Something went wrong, Please reload and check');
		}
		else{
			element.unbind('click');
			parentToRemove.remove();
		}
		containerTable.find("tr.hide-content").removeClass('hide-content');
	};
	
	this.fetchFailedOfData = function(errorMessage){
		sntapp.notification.showErrorMessage('Something went wrong: ' + errorMessage);
	};
	this.cancelFromAddNewForm = function(event){

		var element = $(event.target);
		
		//var parentToRemove = element.parents("tr:eq(0)");
		// if(typeof parentToRemove === 'undefined'){
			// sntapp.notification.showErrorMessage('Something went wrong, Please reload and check');
		// }
		// else{
			element.unbind('click');
			
			// parentToRemove.remove();
			that.myDom.find('#new-form-holder').html("");
		// }
		// containerTable.find("tr.hide-content").removeClass('hide-content');
	};

};