var BaseView = function(viewDom){

  this.myDom = viewDom;
  this.events = {} ; // Events dictionary should contain a mapping of events in the view, to corresponding handler functions.

  var that = this;

  this.pageinit = function(){
  };
  
  this.pageshow = function(){
  };  

  this.delegateEvents = function(){
  }

  this.initSubViews = function(){
  }

  this.executeLoadingAnimation = function(){

  }

  this.initialize = function(){
    that.pageinit();
    that.executeLoadingAnimation();
    that.delegateEvents();
    that.initSubViews();
  };
  
  
  
};