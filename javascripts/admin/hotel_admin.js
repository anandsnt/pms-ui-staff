var HotelAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){  	
  	that.myDom.find('.sethotel').on('click', that.setNewHotel);
  	that.myDom.find('ul.dashboard-items li').on('click', that.appendNewPage);
  	that.myDom.find('.currenthotel').on('click', function(){
  		$('#change-hotel').toggleClass('open');
  	});
  	that.myDom.find('li.ui-state-default a.ui-tabs-anchor').on('click', that.clearReplacingDiv);
  	that.myDom.find('#admin-header nav').on('click', that.bookMarkClick);
  };
  this.bookMarkClick = function(event){
	event.preventDefault();
	var target = $( event.target );
	if(target.prop('tagName') != "A")
		return false;

	var url = target.attr("href");
	if(url != "#" && url != undefined){
  		var backDom = null;
  		that.myDom.find("#dashboard section.tab").each(function(){
  			if($(this).is(":visible")){
  				backDom = $(this); 				 				
  			}
  		});  		
  		var div = that.myDom.find("#replacing-div-first");
  		if(div.html() != ""){  
  			div.hide();
  			div = that.myDom.find("#replacing-div-second");
  			if(backDom == null)
  				backDom = that.myDom.find("#replacing-div-first");
  		}
  		that.myDom.find("#dashboard section.tab").hide(); 
  		viewParams = {'backDom': backDom};
  		
  		sntapp.fetchAndRenderView(url, div, {}, false, viewParams);
	}	  
  };
  this.clearReplacingDiv = function() {	  
	  $("#replacing-div-first").html("");
	  $("#replacing-div-first").show();
	  $($(this).attr("href")).show();
  };
  
  this.appendNewPage = function(event){	
	  event.preventDefault();
	  var backDom = $(this).parents("section:eq(0)");
	  if(backDom == undefined) {
		  
	  }
	  var href = $(this).find("a").eq(0).attr("href");
	  if(href != "#" && href != undefined){
		  var url = href;	  	  	 
		  var viewParams = {'backDom': backDom};
		  $(this).parents('section:eq(0)').hide();
		  //viewURL, viewDom, params, shouldShowLoader, nextViewParams
		  sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, false, viewParams);
	  }
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