var BaseView = function(viewDom){

  this.myDom = viewDom;
  this.events = {} ; // Events dictionary should contain a mapping of events in the view, to corresponding handler functions.

  var that = this;

  this.setDom = function(newDom){
    // This is added as part of a bug fix. Used only for search view.
    // Hence the code is not written here
  };

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