var GuestcardLoyaltyView = function(domRef){	
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
  	bindLoyaltyUtilFunctions();
  }
  this.delegateEvents = function(){
  	console.log("delegateEvents");
  	//this.myDom.find('#loyalty-type-flyer #add-new-ffp').on('click', that.addFFPModal);
  	//this.myDom.find('#loyalty-type-hotel #add-new-hlp').on('click', that.addHLPModal);
  	//this.myDom.find('#loyalty-tab .active-item').on('click', that.deleteLoyaltyModal);
  	
  	that.myDom.find('#loyalty-tab #loyalty-type-flyer a').on('click', that.clickedOnFFP);
  	that.myDom.find('#loyalty-tab #loyalty-type-hotel a').on('click', that.clickedOnHLP);
  	
  }
  this.clickedOnFFP = function(e){
  	console.log("clickedOnFFP");
  	console.log(that.myDom);
  	
  	if($(this).hasClass("add-new-button")){
  		that.addFFPModal();
  	}
  	else if($(this).hasClass("active-item")){
  		that.deleteLoyaltyModal(this);
  	}
  }
  this.clickedOnHLP = function(e){
  	console.log("clickedOnFFP");
  	console.log(that.myDom);
  	console.log(this);
  	console.log($(this).hasClass("add-new-button"));
  	console.log($(this).hasClass("active-item"));
  	
  	if($(this).hasClass("add-new-button")){
  		that.addHLPModal();
  	}
  	else if($(this).hasClass("active-item")){
  		that.deleteLoyaltyModal(this);
  	}
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
  this.deleteLoyaltyModal = function(that){
  	
  	var loyaltyType = $(that).attr('loyaltytype');
  	var loyaltyId = $(that).attr('loyaltyid');
  	
  	var deleteLoyaltyModal = new DeleteLoyaltyModal();
    deleteLoyaltyModal.initialize();
    deleteLoyaltyModal.params = {"loyalty_id":loyaltyId , "loyalty_type":loyaltyType};
    console.log(deleteLoyaltyModal.params);
  }
};
