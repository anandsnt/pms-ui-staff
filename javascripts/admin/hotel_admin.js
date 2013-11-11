var HotelAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){
  	// $('.icon-admin-menu').on('draggable', that.customDrag);
  	
  	// this.myDom.find('#notes #delete_note').on('click', that.deleteReservationNotes);		
  };
  this.bookMarkAdded = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.addBookMark(bookMarkId);
  };
};