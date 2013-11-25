var HotelDetailsView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    console.log("Reached in pageinit HotelDetailsView");
  };
   this.delegateEvents = function(){  	
  	that.myDom.find('#save').on('click', that.saveHotelDetails);  	
  };
  this.saveHotelDetails =  function(){
  	console.log("Reached save HotelDetailsView");
  };
};