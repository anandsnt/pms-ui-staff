var HotelListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  
  this.delegateEvents = function(){   		
  	 that.myDom.find($('#hotels_list_table')).tablesorter();
  	 that.myDom.find($('.title, #add_new_hotel')).on('click', this.gotoNextPage);
  	 
  };
  
  this.gotoNextPage =  function(e){  	
  	
  	e.preventDefault();	
  	//sntadminapp.clearReplacingDiv();  	
  	var href = $(this).attr("href");
  	var viewParams = {};
  	
  	var backDom = that.myDom;
  	backDom.hide();
  	var nextViewParams = {'backDom': backDom};
  	var nextDiv = $("#replacing-div-first");
  	if(that.myDom.attr('id') == "replacing-div-first"){
  		nextDiv = $("#replacing-div-second");
 		$("#replacing-div-third").html(""); 		
  	}
    $(".currenthotel").attr("id", href.split('/')[3]);
  
    if(href != undefined){
  		sntapp.fetchAndRenderView(href, nextDiv, viewParams, 'BLOCKER', nextViewParams);
  		nextDiv.show();
    }
  };
  
};