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
  		that.myDom.find("#content section.tab").each(function(){
  			if($(this).is(":visible")){
  				backDom = $(this); 				 				
  			}
  		});  		
  		var div = that.myDom.find("#replacing-div-first");

  		if(backDom == null){
	  		if(div.is(":visible") && div.html() != ""){  
	  			div = that.myDom.find("#replacing-div-second");
	  			div.show();
	  			backDom = that.myDom.find("#replacing-div-first");
	  			backDom.hide();
	  		}
	  		else{
	  			div =  that.myDom.find("#replacing-div-first");
	  			div.show();
	  			backDom = that.myDom.find("#replacing-div-second");
	  			backDom.hide();
	  		}
  		}  		
  		
  		that.myDom.find("#content section.tab").hide(); 
  		viewParams = {'backDom': backDom};
  		
  		sntapp.fetchAndRenderView(url, div, {}, 'BLOCKER', viewParams);
	}	  
  };

  this.clearReplacingDiv = function() {	  
	  $("#replacing-div-first").html("");
	  $("#replacing-div-second").html("");
	  $("#replacing-div-first, #replacing-div-second").removeClass("current");
	  $("#replacing-div-first").show();
	  $($(this).attr("href")).show();
  };
  
  this.appendNewPage = function(event){	
	  event.preventDefault();
	  var backDom = $(this).parents("section:eq(0)");
	  if(typeof backDom === 'undefined') {
		  
	  }
	  var href = $(this).find("a").eq(0).attr("href");
	  if(href != "#" && href != undefined){
		  var url = href;	  	  	 
		  var viewParams = {'backDom': backDom};
		  $(this).parents('section:eq(0)').hide();
		  //viewURL, viewDom, params, shouldShowLoader, nextViewParams
		  
		  sntapp.fetchAndRenderView(url, $("#replacing-div-first"), {}, 'BLOCKER', viewParams);
	  }
  };

  //success function of setNewHotel's ajax call
  this.fetchCompletedOfSetNewHotel = function(data, requestParameters) {
  	var hotel_name = requestParameters['hotel_name'];
    $("#selected_hotel").html(hotel_name);
    $('#change-hotel').toggleClass('open');
    location.reload(true);
  };

  this.setNewHotel = function(){
  	var hotel_id = $(this).attr("id");
  	var hotel_name = $(this).attr("name");
	var webservice = new WebServiceInterface();
	var data = { 'hotel_id': hotel_id };
	var url = '/admin/hotel_admin/update_current_hotel';
    var options = { 
    				requestParameters: data,
    				successCallBack: that.fetchCompletedOfSetNewHotel,
    				failureCallBack: that.fetchFailedOfSubmitPayment,
    				successCallBackParameters: { 'hotel_name': hotel_name},
    				loader: 'blocker',
    				async: false
    			};
    webservice.postJSON(url, options);  	
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