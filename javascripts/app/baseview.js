var BaseView = function(viewDom){

  this.myDom = viewDom;
  this.events = {} ; // Events dictionary should contain a mapping of events in the view, to corresponding handler functions.

  var that = this;

  this.pageinit = function(){
    console.log("base view page Init");
  };
  
  this.pageshow = function(){
  	console.log("base view page Show");
  };  

  this.delegateEvents = function(){
  	console.log("delegateEvents");
  }

  this.initSubViews = function(){
  	console.log("init sub views method");
  }

  this.executeLoadingAnimation = function(){

  }

  this.initialize = function(){
    that.pageinit();
    that.executeLoadingAnimation();
    that.delegateEvents();
    that.initSubViews();
  }
  
};