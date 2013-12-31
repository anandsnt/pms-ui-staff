var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 
  var that = this;
  var textOptionStart = 1;
 /* this.delegateEvents = function(){
  	console.log(that.myDom);
  	 //that.myDom.find('.switch-button').on('click', 'onOffClicked');
  	 that.myDom.find('tr').on('click', that.appendInlineData);
  };
*/
  
  this.changeData = function(element){

  	var target = element.attr('data-type');
	if (target != 'textbox'){

		// Hide previous and show new fields 
		$('.data-type:visible').addClass('hidden');
		$('#entry-' + target).removeClass('hidden');

		// Empty data from previous fields except those that are in DB already
		$('.data-type:visible input:not(.predefined)').val('');

		// Delete all dynamically added fileds which are now emtpy
		$('.data-type:visible input.delete-option').parent('.entry').remove();
	}
	// If textbox, just hide visible data type option
	else {
		// Hide previous
		$('.data-type:visible').addClass('hidden');

		// Empty data from previous fields except those that are in DB already
		$('.data-type:visible input:not(.predefined)').val('');

		// Delete all dynamically added fileds which are now emtpy
		$('.data-type:visible input.delete-option').parent('.entry').remove();
	}
	
  };
  this.onOffClicked = function(){
  	onOffSwitch();
  };

  this.callSaveAPI = function(){

  };

   this.deleteOption = function(element){
	   	if ($.trim(element.val()) == '')
		{
			element.parent('.entry').remove();
		}	
   };

  this.delegateSubviewEvents = function(){
  	//that.myDom.find('.change-data').on('click', that.changeData);
  	//that.myDom.find('.add-new-option').on('click', that.addNewOption);
    that.myDom.on('click', that.viewClickEventHandler);
    // to remove text if value is null
    that.myDom.on('keyup', that.viewKeyupEventHandler);
    that.myDom.on('focusout', that.viewFocusoutEventHandler);
   };

   this.viewClickEventHandler = function(event){
      var element = $(event.target);

      if(element.parent().hasClass('switch-button')) {return that.toggleButtonClicked(element);}
      if(element.hasClass('change-data')) return that.changeData(element);
      if(element.hasClass('add-new-option'))	return that.addNewOption(element, event);
      if(element.hasClass('add-new-checkbox'))  
        { return that.addNewNewspaper(element);}
      if(element.hasClass('icon-add') && element.parent().hasClass('add-new-checkbox'))  
        { return that.addNewNewspaper(element.parent());}
      return true;

      
   };

   this.viewKeyupEventHandler = function(event){
   	  var element = $(event.target);
   	  if(element.hasClass('delete-option'))
      		return that.deleteOption(element);
      

   };

   this.viewFocusoutEventHandler = function(event){
      var element = $(event.target);
      if(element.hasClass('checkbox-value')) return that.convertToCheckbox(element);
   };


  this.toggleButtonClicked = function(element){
      var likeId = element.closest('tr').attr('data-like-id');
      var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
      var postParams = {"id" : likeId, "set_active" : toggleStatus};

      var webservice = new WebServiceInterface(); 
      var options = {
           requestParameters: postParams,
           loader: "NONE"
      };
      //var url = '/staff/reservations/upgrade_room';
      //webservice.postJSON(url, options);
      return true;
  };

  // Add new checkbox option, step 1 - create text field
  this.addNewNewspaper = function(element){
      var checkboxOptionStart = 48;
      var type = element.attr('data-type'),
      deleteIcon = '<span class="icons icon-delete" />';

      checkboxOptionStart++;

      // Clone add new option
      element.clone().insertAfter(element);

      // Add text field
      element.removeClass('add-new-checkbox').text('');

      $('<input type="text" value="" />')
          .attr('name', type)
          .attr('data-id', "")
          .attr('id', type + '-option' + checkboxOptionStart)
          .attr('class', 'checkbox-value')
          .appendTo(element);

      return true;

  };

  // Add new checkbox option, step 2 - convert text field to checkbox field if value entered
  this.convertToCheckbox = function(element){
    var value = element.val();

      // If value is entered
      if (value) {
        // First change input type
        element
          .attr('type', 'checkbox')
          .attr('checked', 'checked')
          .removeAttr('class');

        // Now update with new value
        var icons = '<span class="icons icon-delete" /><span class="icon-form icon-checkbox checked" />',
          input = element.parent().html(),
          text = '<div id="newspaper-name">'+element.val()+'</div>';

        element.parent()
          .addClass('checkbox checked')
          .removeAttr('data-type')
          .html(icons + input + text);
      }
      // No value
      else {
        element.parent().remove();
      }
  };


  this.deleteItem = function(event){
      $(event.target).parent('.checkbox').remove();
      return false;
  };


   this.addNewOption = function(element, event){
	   	var type = element.attr('data-type');
	
		textOptionStart++;
	
		element
			.clone() 											// Clone element
			.val('') 											// Clear value
			.attr('id', type + '-option' + textOptionStart) 	// Increment ID value
			.insertAfter(element.parent('.entry'))				// Insert after this one
			.wrap('<div class="entry" />');						// Wrap to div
	
		// Set new class
		$('.add-new-option').unbind('click');
	    element.removeClass('add-new-option').addClass('delete-option');    


   };
   
   this.updateApi = function(event){
   		 var element = $(event.target);
   		 var type = element.attr('like-type');
   		 if(type == "common"){
   		 	that.updateCommonLikes(element);
   		 }else if(type == "newspaper"){
   		 	that.saveNewsPaper(element);
   		 }
    	
    };
    this.saveNewApi = function(){
    	var element = $(event.target);
   		 var type = element.attr('like-type');
   		 if(type == "common"){
   		 	that.saveCommonLikes();
   		 }
    };
    
    this. updateCommonLikes = function(element){
    	
    };

    this.saveNewsPaper = function(element){
      var postData = {};
      postData.news_paper = [];
      element.closest('form').find('#newspaper-options').find('label').each(function(index){
        if($(this).hasClass('checkbox')){
          var newsPaperItem = {};
          var checkedStatus = $(this).find('input').is(':checked');
          newsPaperItem.id = $(this).find('input').attr('data-id');
          newsPaperItem.name = $(this).find('#newspaper-name').text();
          newsPaperItem.is_checked = $(this).find('input').is(':checked') ? "true" : "false";
          postData.news_paper.push(newsPaperItem);
        }
      });
      
      var webservice = new WebServiceInterface(); 
      var url = '/admin/departments';
      var options = {
           requestParameters: postData,
           successCallBack: that.newsPaperSaveComplete,
           successCallBackParameters:{ "event": event},
           loader:"BLOCKER"
      };
      //webservice.postJSON(url, options); 

    }

  //refreshing view with new data and showing message
  this.newsPaperSaveComplete = function(data, requestParams){
    var url = "/admin/departments";
    viewParams = {};
    sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
    if(data.status == "success"){
      sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);   
      that.cancelFromAppendedDataInline(requestParams['event']);  
    }  
    else{
      sntapp.notification.showErrorList(data.errors, that.myDom);  
    }
  };

};