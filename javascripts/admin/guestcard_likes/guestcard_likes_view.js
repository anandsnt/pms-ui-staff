var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 
  var that = this;
  var $textOptionStart = 53;
 /* this.delegateEvents = function(){
  	console.log(that.myDom);
  	 //that.myDom.find('.switch-button').on('click', 'onOffClicked');
  	 that.myDom.find('tr').on('click', that.appendInlineData);
  };
*/
  
  this.changeData = function(){
  	var target = $(this).attr('data-type');
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
  this.delegateInlineEvents = function(){
  	that.myDom.find('.change-data').on('click', that.changeData);
  	that.myDom.find('.add-new-option').on('click', that.addNewOption);
    that.myDom.on('click', that.viewElementClicked);

   };

   this.viewElementClicked = function(event){
      var element = $(event.target);
      if(!element.parent().hasClass('switch-button')) return true;
      that.onOffButtonHandler();

   }

  this.onOffButtonHandler = function(){
      console.log("handle on off button");
  };

   this.addNewOption = function(){
   	var $type = $(this).attr('data-type');

			$textOptionStart++;

			$(this)
				.clone() 											// Clone element
				.val('') 											// Clear value
				.attr('id', $type + '-option' + $textOptionStart) 	// Increment ID value
				.insertAfter($(this).parent('.entry'))				// Insert after this one
				.wrap('<div class="entry" />');						// Wrap to div

			// Set new class
		    $(this).removeClass('add-new-option').addClass('delete-option');    
   };


 

};