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
  	
  	
	var currentDiv = sntadminapp.getCurrentDiv();
	var nextDiv = sntadminapp.getReplacingDiv(currentDiv);  	
	var backDom = currentDiv;
  	var nextViewParams = {'backDom': backDom};
    $(".currenthotel").attr("id", href.split('/')[3]);
  
    if(href != undefined){
  		sntapp.fetchAndRenderView(href, nextDiv, viewParams, 'BLOCKER', nextViewParams);
  		nextDiv.show();
  		backDom.hide();
    }
  };
  
};