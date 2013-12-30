var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 
  var that = this;
  var $textOptionStart = 1;
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
    that.myDom.on('click', that.viewEventHandler);
    // to remove text if value is null
    that.myDom.on('keyup', that.optionsEventHandler);
   };

   this.viewEventHandler = function(event){
      var element = $(event.target);

      
      if(element.parent().hasClass('switch-button')) 
            return that.onOffButtonHandler(element);
      else if(element.hasClass('change-data'))
        	return that.changeData(element);
      else if(element.hasClass('add-new-option'))
      		return that.addNewOption(element, event);

     
	 // if(element.hasClass('add-new-option'))
      		// that.addNewOption();
      		 // if(element.parent().hasClass('delete-option'))
      		// that.deleteOption();
      		
      		return true;
	// that.myDom.find('.add-new-option').on('click', that.addNewOption);
	// that.myDom.find('.delete-option').on('keyup', that.deleteOption);
      
   };
   this.optionsEventHandler = function(event){
   	  var element = $(event.target);
   	  if(element.hasClass('delete-option'))
      		return that.deleteOption(element);
   };


  this.onOffButtonHandler = function(element){
      console.log("handle on off button");
      return true;
  };

   this.addNewOption = function(element, event){
	   	var $type = element.attr('data-type');
	
		$textOptionStart++;
	
		element
			.clone() 											// Clone element
			.val('') 											// Clear value
			.attr('id', $type + '-option' + $textOptionStart) 	// Increment ID value
			.insertAfter(element.parent('.entry'))				// Insert after this one
			.wrap('<div class="entry" />');						// Wrap to div
	
		// Set new class
		$('.add-new-option').unbind('click');
	    element.removeClass('add-new-option').addClass('delete-option');    

   };


 

};