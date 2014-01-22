var BaseView = function(viewDom){

  this.myDom = viewDom;
  this.events = {} ; // Events dictionary should contain a mapping of events in the view, to corresponding handler functions.

  var that = this;

  this.pageinit = function(){
  };
  
  this.pageshow = function(){
  };  

  this.delegateEvents = function(){
  };

  this.initSubViews = function(){
  };

  this.executeLoadingAnimation = function(){

  };

  this.initialize = function(){
    /**
    * Card reader device must not be on for all pages.
    
    * if cardReader is already started, stop the reader
    * if this is a search page the reader will be started again
    * by the search page's controller
    */

    that.pageinit();
    that.executeLoadingAnimation();
    that.delegateEvents();
    that.initSubViews();
  };
  // To show error message.
  this.showErrorMessage = function(errorMessage,callBack){
  	var failureModal = new FailureModal(callBack);
	failureModal.initialize();
	failureModal.params = {"message": errorMessage};
  };
  // To show failure message.
  this.showSuccessMessage = function(successMessage,callBack){
	var successModal = new SuccessModal(callBack);
	successModal.initialize();
	successModal.params = {"message": successMessage};
  };
  
};