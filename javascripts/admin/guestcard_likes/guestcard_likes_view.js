var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 
  var that = this;
  var textOptionStart = 1;
  
  
  // to handle sub view events
  this.delegateSubviewEvents = function(){
    that.myDom.on('click', that.viewClickEventHandler);
    // to remove text if value is null
    that.myDom.on('keyup', that.viewKeyupEventHandler);
    that.myDom.on('focusout', that.viewFocusoutEventHandler);
   };
   //handle click events
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
   

};