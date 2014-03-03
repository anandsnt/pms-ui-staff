var ReservationCardLoyaltyView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    bindLoyaltyUtilFunctions("stay-card");
  };
  this.delegateEvents = function(){
  	that.myDom.find('#add_new_loyalty_staycard').on('click', that.addNewLoyaltyModal);
  	that.myDom.find('select.styled#loyalty').on('change', that.changedLoyaltyProgram);				
  };
  this.addNewLoyaltyModal = function(){
  	var addNewLoyaltyModal = new AddNewLoyaltyModal();
    addNewLoyaltyModal.initialize();
  };
  this.changedLoyaltyProgram = function(){
    var id = $(this).find('option:selected').attr('id');
    var reservation_id = getReservationId();
    
    if(id==""){
      // on Selecting option "Select Loyalty Program"
      clearSelectionUI();
    }
    else{
      // on Selecting option containg data, HLP or FFP
      resetSelectionUI();
    }
   var webservice = new WebServiceInterface();
   var data = {
       "reservation_id": reservation_id,
       "membership_id": id
   };
   var url = 'staff/user_memberships/link_to_reservation';
   var options = {
		   requestParameters: data,
		   successCallBack: that.fetchCompletedOfSave,
		  failureCallBack: that.fetchFailedOfSave,
   };
   webservice.postJSON(url, options);    
  };
  this.fetchFailedOfSave = function(errorMessage){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
  };
  this.fetchCompletedOfSave = function(data){
	sntapp.activityIndicator.hideActivityIndicator();
	sntapp.notification.showSuccessMessage("Successfully Saved ", that.myDom);  
  };
};


