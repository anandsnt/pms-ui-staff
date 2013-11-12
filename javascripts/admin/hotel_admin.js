var HotelAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){  	
  	that.myDom.find('.sethotel').on('click', that.setNewHotel);
  };
  this.setNewHotel = function(){
  	var hotel_id = $(this).attr("id");
  	var hotel_name = $(this).attr("name");
  	$.ajax({
		type : "POST",
		url : '/admin/hotel_admin/update_current_hotel',	
		data : {hotel_id:hotel_id},
		dataType : 'json',
		async:false,
		success : function(data) {					
			if (data.status == "success") {
			    $("#selected_hotel").html(hotel_name);
			    $('#change-hotel').toggleClass('open');
			    location.reload(true);
			}
		},
		error : function() {		
		   console.log("There is an error!!");
		}
	});
  };
  this.bookMarkAdded = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.addBookMark(bookMarkId);
  };
  this.bookMarkRemoved = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.removeBookMark(bookMarkId);
  };
};