var GuestCardLikesView = function(domRef){
  BaseInlineView.call(this);  
  this.myDom = domRef; 

  this.delegateEvents = function(){
  	 $('.switch-button').on('click', 'onOffClicked') 
  };

  this.onOffClicked = function(){
  	onOffSwitch();
  };


 

};