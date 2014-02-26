var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);
  this.myDom = domRef;
  var that = this;
  var textOptionStart = 1;
  var checkboxOptionStart = 48; 
  this.changeData = function(element){
  	var target = element.attr('data-type');
  	if (target != 'textbox'){

  		// Hide previous and show new fields
  		that.myDom.find('.data-type:visible').addClass('hidden');
  		that.myDom.find('#entry-' + target).removeClass('hidden');

  		// Empty data from previous fields except those that are in DB already
  		that.myDom.find('.data-type:visible input:not(.predefined)').val('');

  		// Delete all dynamically added fileds which are now emtpy
  		that.myDom.find('.data-type:visible input.delete-option').parent('.entry').remove();
  	}
  	// If textbox, just hide visible data type option
  	else {
  		// Hide previous
  		that.myDom.find('.data-type:visible').addClass('hidden');

  		// Empty data from previous fields except those that are in DB already
  		that.myDom.find('.data-type:visible input:not(.predefined)').val('');

  		// Delete all dynamically added fileds which are now emtpy
  		that.myDom.find('.data-type:visible input.delete-option').parent('.entry').remove();
  	}

  };
  // To delete the textbox if value is null - Options values
   this.deleteOption = function(element){
	   if ($.trim(element.val()) == ''){
  			element.parent('.entry').remove();
  	 }
     return false;
   };
  // to handle sub view events
  this.delegateSubviewEvents = function(){   
    that.myDom.unbind('keyup');
    that.myDom.unbind('focusout');
    that.myDom.on('click', that.viewClickEventHandler);
    // to remove text if value is null
    that.myDom.on('keyup', that.viewKeyupEventHandler);
    that.myDom.on('focusout', that.viewFocusoutEventHandler);
   };
   //handle click events
   this.viewClickEventHandler = function(event){

    var element = that.myDom.find(event.target);

	  if(element.hasClass('icon-delete')) return that.deleteFeature(element);

    if(element.hasClass('change-data')) return that.changeData(element);

    if(element.hasClass('add-new-option'))	{
        return that.addNewOption(element, event);
    }

    if(getParentWithSelector(event, ".add-new-checkbox")) {  
      element = that.myDom.find(event.target);
      return that.addNewNewspaper(element);
    }  
   };

   //to handle keyup events- text box show new textbox on key up
   this.viewKeyupEventHandler = function(event){    

   	  var element = that.myDom.find(event.target);
      var code = event.keyCode || event.which;

        if(element.hasClass('add-new-option')) { 
          return that.addNewOption(element, event);     
        }          
        if(element.hasClass('delete-option')){          
          return that.deleteOption(element);
        }

   };

   //to handle focusout event
   this.viewFocusoutEventHandler = function(event){
      var element = that.myDom.find(event.target);
      if(element.hasClass('checkbox-value')) {
        that.convertToCheckbox(element);
        event.target = that.myDom.find('.add-new-checkbox');
        return that.viewClickEventHandler(event);

      }
      if(element.hasClass('delete-option')){    
          return that.deleteOption(element);
      }      

   };

   //To delete feature on click delet icon
   this.deleteFeature = function(element){
      var elementIdToDelete = element.attr("data-id");
      var postParams = {"id" : elementIdToDelete};

      var webservice = new WebServiceInterface();
      var options = {
           requestParameters: postParams,
           successCallBack : that.deleteSuccess,
           successCallBackParameters:{ "element": element},
           loader: "NONE"
      };
      var url = '/admin/hotel_likes/delete_feature';
      webservice.postJSON(url, options);    
   };
   //success calback of delete. Remove data from UI
   this.deleteSuccess = function(data, params){
      params['element'].parent('.checkbox').remove();
   };

  this.toggleButtonClicked = function(element){
      var likeId = element.closest('tr').attr('data-like-id');
      setTimeout(function(){
          var toggleStatus = element.parent().hasClass('on') ? "true" : "false";
          var postParams = {"id" : likeId, "set_active" : toggleStatus};

          var webservice = new WebServiceInterface();
          var options = {
               requestParameters: postParams,
               loader: "NONE"
          };
          var url = '/admin/hotel_likes/activate_feature';
          webservice.postJSON(url, options);
          return true;
      }, 100);

  };

  // Add new checkbox option, step 1 - create text field
  this.addNewNewspaper = function(element){
      
      var type = element.attr('data-type'),
      deleteIcon = '<span class="icons icon-delete" />';
      checkboxOptionStart++;
      var newID = type + '-option' + checkboxOptionStart
      

      // Clone add new option
      element.clone().insertAfter(element);

      // Add text field
      element.removeClass('add-new-checkbox').text('');

      $('<input type="text" value="" />')
          .attr('name', type)
          .attr('data-id', "")
          .attr('id', newID)
          .attr('class', 'checkbox-value')
          .appendTo(element);
      that.myDom.find('#' + newID).focus();
      return false;

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
        var icons = '<span class="icon-form icon-checkbox checked" />',
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
      // $(event.target).parent('.checkbox').remove();
      // return false;
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
      event.stopPropagation();
      return false; // to prevent event bubbling

   };

   this.updateApi = function(event){
   		 var element = $(event.target);
   		 var type = element.attr('like-type');
   		 if(type == "common"){
   		 	that.updateCommonLikes(element, event);
   		 }else if(type == "newspaper"){
   		 	that.saveNewsPaper(event, element);
   		 }

    };
    this.saveNewApi = function(event){
    	var element = $(event.target);
   		 var type = element.attr('like-type');
   		 if(type == "common"){
   		 	that.saveCommonLikes(element, event);
   		 }
    };

    this.updateCommonLikes = function(element, event){

    	var show_on_room_setup = "false";
    	if(that.myDom.find("#show-on-room-setup").parent("label:eq(0)").hasClass("checked")) {
		  show_on_room_setup = "true";
	    }
	    var selected = that.myDom.find("input[type='radio'][name='type']:checked");
	    selectedType = "";
		if (selected.length > 0) {
		    selectedType = selected.val();
		}
		var options = new Array();
		var optionDiv = "";
		if(selectedType == "dropdown")
		{
			optionDiv = "entry-select";
		} else if(selectedType == "checkbox"){
			optionDiv = "entry-checkbox";
		}else if(selectedType == "radio"){
			optionDiv = "entry-radio";
		}
		if(selectedType == "dropdown" || selectedType == "checkbox" || selectedType == "radio") {
			$("#"+optionDiv+" input[name=radio-option]").each(function(){
			   id = $(this).attr("data-id");
			   name = $(this).val();
			   dict = {'id': id, 'name': name};
			   if(name != ""){
			     options.push(dict);
			   }
		    });
		}

	    var postData = {};
	    postData.id = that.myDom.find("#edit-like").attr("like_id");
    	postData.name = that.myDom.find("#category-name").val();
    	postData.show_on_room_setup = show_on_room_setup;
    	postData.type = selectedType;
    	postData.options = options;
    	//console.log(JSON.stringify(postData));// DELETE once API Integration is complete

    	var url = '/admin/hotel_likes/add_feature_type';
  		var webservice = new WebServiceInterface();
  		var options = {
  				   requestParameters: postData,
  				   successCallBack: that.fetchCompletedOfSave,
  				   successCallBackParameters:{ "event": event},
  				   loader:"BLOCKER"

  		};
		webservice.putJSON(url, options);

    };
    this.saveCommonLikes = function(element, event){
    	var show_on_room_setup = "false";
    	if(that.myDom.find("#show-on-room-setup").parent("label:eq(0)").hasClass("checked")) {
		  show_on_room_setup = "true";
	    }
	    var selected = that.myDom.find("input[type='radio'][name='type']:checked");
	    selectedType = "";
		if (selected.length > 0) {
		    selectedType = selected.val();
		}
		var options = new Array();
		var optionDiv = "";
		if(selectedType == "dropdown")
		{
			optionDiv = "entry-select";
		} else if(selectedType == "checkbox"){
			optionDiv = "entry-checkbox";
		}else if(selectedType == "radio"){
			optionDiv = "entry-radio";
		}
		if(selectedType == "dropdown" || selectedType == "checkbox" || selectedType == "radio") {
			that.myDom.find("#"+optionDiv+" input[name=radio-option]").each(function(){
			   id = $(this).attr("data-id");
			   name = $(this).val();
			   dict = {'id': id, 'name': name};
			   if(name != ""){
			     options.push(dict);
			   }
		    });
		}

	    var postData = {};
    	postData.name = that.myDom.find("#category-name").val();
    	postData.show_on_room_setup = show_on_room_setup;
    	postData.type = selectedType;
    	postData.options = options;
    	//console.log(JSON.stringify(postData)); // DELETE once API Integration is complete

    	var url = '/admin/hotel_likes/add_feature_type';
		var webservice = new WebServiceInterface();
		var options = {
				   requestParameters: postData,
				   successCallBack: that.fetchCompletedOfSave,
				   successCallBackParameters:{ "event": event},
				   loader:"BLOCKER"

		};
		webservice.postJSON(url, options);

    };
    //refreshing view with new data and showing message
  this.fetchCompletedOfSave = function(data, requestParams){

  	  var url = "/admin/hotel_likes/get_hotel_likes";
   	  viewParams = {};
      sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
  	  sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
  	  that.cancelFromAppendedDataInline(requestParams['event']);
  	 
  };

    this.saveNewsPaper = function(event, element){
      var postData = {};
      postData.custom_likes = [];
      postData.id = element.closest('form').attr("like_id");
      element.closest('form').find('#newspaper-options').find('label').each(function(index){
        if($(this).hasClass('checkbox')){
          var newsPaperItem = {};
          var checkedStatus = $(this).find('input').is(':checked');
          newsPaperItem.id = $(this).find('input').attr('data-id');
          newsPaperItem.name = $(this).find('#newspaper-name').text();
          newsPaperItem.is_checked = $(this).find('input').is(':checked') ? "true" : "false";
          
          postData.custom_likes.push(newsPaperItem);
        }
      });

      var webservice = new WebServiceInterface();
      var url = '/admin/hotel_likes/save_custom_likes';
      var options = {
           requestParameters: postData,
           successCallBack: that.newsPaperSaveComplete,
           successCallBackParameters:{ "event": event},
           loader:"BLOCKER"
      };
      webservice.postJSON(url, options);

    };

  //refreshing view with new data and showing message
  this.newsPaperSaveComplete = function(data, requestParams){
      var url = "/admin/hotel_likes/get_hotel_likes";
      viewParams = {};
      sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
      sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);
      that.cancelFromAppendedDataInline(requestParams['event']);
  };

};