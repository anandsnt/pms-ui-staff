var HotelAnnouncementView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  this.currentView = $("body").attr("id") ;
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#save').on('click', that.saveHotelDetails); 
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_new_hotel').on('click', that.addNewHotel); 
  };
  
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  
  this.gotoPreviousPage = function() {
	  sntadminapp.gotoPreviousPage(that.viewParams);
  };
};