var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 
  var that = this;

  this.delegateEvents = function(){
  	 that.myDom.find('.switch-button').on('click', 'onOffClicked');
  	 that.myDom.find('tr').on('click', that.appendInlineData);
  };

  this.onOffClicked = function(){
  	onOffSwitch();
  };


 

};