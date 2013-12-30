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
  	that.myDom.find('.icon-delete').on('click', that.deleteItem);
  };
  this.addNewForm = function(event){
  	// element.closest('div[data-view-type="inline-forms"]');
  		event.preventDefault();
		var element = $(event.target);
		var webservice = new WebServiceInterface();
		var url = element.attr("href");
		
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
	    var options = {
				   successCallBack: that.fetchCompletedOfNewForm,
				   failureCallBack: that.fetchFailedOfAppendInlineData,
				   successCallBackParameters : {'element': element},
	    		   loader: 'normal',
		};
	    webservice.getHTML(url, options);
  };
  this.fetchCompletedOfNewForm = function(data, requestParameters){	
		sntapp.activityIndicator.showActivityIndicator("BLOCKER");
		that.myDom.find("tr.hide-content").removeClass('hide-content');
		
		that.myDom.find("tr.edit-data").remove();
        setTimeout(function() {
    	    $("#new-form-holder").html(data);
    	    that.myDom.find("div.actions #cancel.button.blank").on('click', that.cancelFromAddNewForm);
    	    that.myDom.find("div.actions #save.button.green").on('click', that.addNewData);
    	    sntapp.activityIndicator.hideActivityIndicator();
        }, 300);				
		
	};
	
  this.appendInlineData = function(event) {
	  	// event for tr's click to append the data
	    // this will check the tr's  'a' tag children with class edit-data-inline
	  	// it is using 'a' tag's href for fetching the view
		
		//
		var element = $(event.target);

		if(element.prop('tagName') != "A") return true;
		event.preventDefault();
		
		var webservice = new WebServiceInterface();
		var url = element.attr("href");
		
		if(typeof url === 'undefined' || url == "#" )
			return false;
		
	    var options = {
				   successCallBack: that.fetchCompletedOfAppendInlineData,
				   failureCallBack: that.fetchFailedOfAppendInlineData,
				   successCallBackParameters : {'element': element},
	    		   loader: 'normal',
		};
	    webservice.getHTML(url, options);	
	};  

	this.fetchCompletedOfAppendInlineData = function(data, requestParameters){	
		//success function of appendInlineData 's ajax call
		
		var containerTable = requestParameters['element'].parents("table:eq(0)");
		var elementRow = requestParameters['element'].parents("tr:eq(0)");
		
		//we need to remove add new's view if there  
		that.myDom.find('#new-form-holder').children("div:eq(0)").remove();
		
		containerTable.find("tr.edit-data").remove();
		containerTable.find("tr.hide-content").removeClass('hide-content');
		elementRow.addClass("hide-content");
		sntapp.activityIndicator.showActivityIndicator("BLOCKER");
        setTimeout(function() {
    	    $(data).insertAfter(elementRow);
    	    containerTable.find("div.actions #cancel.button.blank").on('click', that.cancelFromAppendedDataInline);
    	    containerTable.find("div.actions #update.button.green").on('click', that.updateData);
    	    
    	    sntapp.activityIndicator.hideActivityIndicator();
        }, 300);				
		
	};
	//Add new data
    this.addNewData = function(event){
    	
    	that.saveNewApi();// Override this function to call the individual API
    	that.cancelFromAppendedDataInline(event);
    };
    //Update data
    this.updateData = function(event){
    	that.updateApi(event);// Override this function to call the individual API
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
	
	this.fetchFailedOfAppendInlineData = function(errorMessage){
		sntapp.notification.showErrorMessage('Something went wrong: ' + errorMessage);
	};
	this.cancelFromAddNewForm = function(event){

		var element = $(event.target);
			element.unbind('click');
			that.myDom.find('#new-form-holder').children("div:eq(0)").remove();
	};

};