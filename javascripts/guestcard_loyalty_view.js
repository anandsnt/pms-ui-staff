var GuestcardLoyaltyView = function(domRef){	
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
  	bindLoyaltyUtilFunctions();
  }
  this.delegateEvents = function(){
  	console.log("delegateEvents");
  	this.myDom.find('#loyalty-type-flyer #add-new-ffp').on('click', that.addFFPModal);
  	this.myDom.find('#loyalty-type-hotel #add-new-hlp').on('click', that.addHLPModal);
  	this.myDom.find('#loyalty-tab .active-item').on('click', that.deleteLoyaltyModal);
  }
  this.addFFPModal = function(e){
  	console.log("Initialise addFFPModal");
  	var addFFPModal = new AddFFPModal();
    addFFPModal.initialize();
  }
  this.addHLPModal = function(e){
  	console.log("Initialise addHLPModal");
  	var addHLPModal = new AddHLPModal();
    addHLPModal.initialize();
  }
  this.deleteLoyaltyModal = function(e){
  	
  	var loyaltyType = $(this).attr('loyaltytype');
  	var loyaltyId = $(this).attr('loyaltyid');
  	
  	var deleteLoyaltyModal = new DeleteLoyaltyModal();
    deleteLoyaltyModal.initialize();
    deleteLoyaltyModal.params = {"loyalty_id":loyaltyId , "loyalty_type":loyaltyType};
  }
};
