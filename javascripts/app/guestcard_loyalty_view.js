var GuestcardLoyaltyView = function(domRef){	
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
  }
  this.delegateEvents = function(){
  	that.myDom.find('#loyalty-tab #add-new-ffp').on('click', that.addFFPModal);
  	that.myDom.find('#loyalty-tab #add-new-hlp').on('click', that.addHLPModal);
  	that.myDom.find('#loyalty-tab #loyalty-ffp').on('click', that.clickedOnFFP);
  	that.myDom.find('#loyalty-tab #loyalty-hlp').on('click', that.clickedOnHLP);
  }
  this.clickedOnFFP = function(e){
  	if($(e.target).hasClass("active-item")){	
  		that.deleteLoyaltyModal(e.target);
   	}
  }
  this.clickedOnHLP = function(e){
  	if($(e.target).hasClass("active-item")){	
  		that.deleteLoyaltyModal(e.target);
  	}
  }
  this.addFFPModal = function(e){
  	var addFFPModal = new AddFFPModal();
    addFFPModal.initialize();
  }
  this.addHLPModal = function(e){
  	var addHLPModal = new AddHLPModal();
    addHLPModal.initialize();
  }
  this.deleteLoyaltyModal = function(that){
  	
  	var loyaltyType = $(that).attr('loyaltytype');
  	var loyaltyId = $(that).attr('loyaltyid');
  	
  	var deleteLoyaltyModal = new DeleteLoyaltyModal();
    deleteLoyaltyModal.initialize();
    deleteLoyaltyModal.params = {"loyalty_id":loyaltyId , "loyalty_type":loyaltyType};
  }
};
