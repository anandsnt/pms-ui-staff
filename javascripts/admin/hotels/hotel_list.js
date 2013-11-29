var HotelListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef;  
  var that = this;
  
  this.pageinit = function(){
    
  };
  this.delegateEvents = function(){   		
  	 that.myDom.find($('#hotels_list_table')).tablesorter();
  	 that.myDom.find($('.title, #add_new_hotel')).on('click', this.gotoNextPage);
  };
  this.gotoNextPage =  function(e){
  	
  	e.preventDefault();	
  	sntadminapp.clearReplacingDiv();  	
  	var href = $(this).attr("href"),
  		viewParams = {};
    $(".currenthotel").attr("id", href.split('/')[3]);
  
    if(href != undefined){
  		sntapp.fetchAndRenderView(href, $("#replacing-div"), viewParams);
    }
  };
  
};