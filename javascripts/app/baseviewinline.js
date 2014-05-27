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
  this.pageinit = function(){
  	that.myDom.unbind('click');
  };

  
  this.delegateEvents = function(){
  	//console.log(that.myDom);
  	that.myDom.unbind('click');
  	that.myDom.find("html").off("click");
  	// To unbind all events that happened - CICO-5474 fix
  	that.myDom.on('load').unbind("click");
  	that.myDom.on('click', that.genericEventHandler);

  	//that.myDom.find('#add-new-button').on('click', that.addNewForm);
  	//that.myDom.find('.icon-delete').on('click', that.deleteItem);
  	that.delegateSubviewEvents();
  };
  

  this.genericEventHandler = function(event){
  	var element = $(event.target);
	if(element.prop('tagName') == "A" && (element.hasClass('edit-data-inline'))) return that.appendInlineData(event);
	if(element.parent().hasClass('switch-button')) {return that.toggleButtonClicked(element);}
	if(element.attr('id') == "add-new-button") return that.addNewForm(event);
	if(element.hasClass('delete_item')) return that.deleteItem(event);
	

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

	    return true;
  };

  this.deleteItem = function(event){
  		console.log("deleteItem");
  };

  this.fetchCompletedOfNewForm = function(data, requestParameters){	
		sntapp.activityIndicator.showActivityIndicator("BLOCKER");
		that.myDom.find("tr.hide-content").removeClass('hide-content');
		
		that.myDom.find("tr.edit-data").remove();
        setTimeout(function() {
    	    that.myDom.find("#new-form-holder").html(data);
    	    that.myDom.find("div.actions #cancel.button.blank").on('click', that.cancelFromAddNewForm);
    	    that.myDom.find("div.actions #save.button.green").on('click', that.addNewData);
    	    sntapp.activityIndicator.hideActivityIndicator();
        }, 300);		
		
	};

  this.bindNewformEvents = function(){

  };
	
  this.appendInlineData = function(event) {
	  	// event for tr's click to append the data
	    // this will check the tr's  'a' tag children with class edit-data-inline
	  	// it is using 'a' tag's href for fetching the view
		event.preventDefault();
		console.log("appemdinline")
		var element = $(event.target);
		
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

	    // pause table sorting
	    that.pauseSorting && this.pauseSorting(true);

	    return true;
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
    	    containerTable.find("div.actions #delete").on('click', that.deleteItem); // from list and from inline edit delete method is same. pls do the logic in the method
    	    
    	    sntapp.activityIndicator.hideActivityIndicator();
			that.bindNewformEvents();		  	    
        }, 300);


		
	};
	 //if any extra events to be handled over ride below function
	this.delegateSubviewEvents = function(){
		
	};
	//Add new data
    this.addNewData = function(event){
    	
    	that.saveNewApi(event);// Override this function to call the individual API
    	
    };
    //Update data
    this.updateData = function(event){
    	// unpause table sorting
	    that.pauseSorting && that.pauseSorting(false);

    	that.updateApi(event);// Override this function to call the individual API
    };
    this.updateApi = function(event){
    	// Override this function to call the individual API
    };

    this.toggleButtonClicked = function(element){
    	console.log("toggle button clicked");
    	return true;

    };
	
	// event to handle cancel button click in form
	// Ask Sajith: If it is handling seperately in the view, then..
	this.cancelFromAppendedDataInline = function(event){

		// unpause table sorting
	    that.pauseSorting && that.pauseSorting(false);

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