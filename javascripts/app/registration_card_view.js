var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;

  this.pageinit = function(){
    console.log("RegistrationCardView pageinit");
  }
  this.delegateEvents = function(){
  	console.log("RegistrationCardView delegateEvents");
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  }
  this.completeCheckin = function(){
  	console.log("RegistrationCardView completeCheckin");
  	
  }
}