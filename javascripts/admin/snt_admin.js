var SntAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){
  	that.myDom.find('li.ui-state-default a.ui-tabs-anchor').on('click', sntadminapp.clearReplacingDiv);
  	that.myDom.find('ul.dashboard-items li').on('click', sntadminapp.appendNewPage);
  	
  	that.myDom.find($('#admin-menu #add_new_hotel')).on('click', function(event){
  		event.preventDefault();
  		var div = $("#replacing-div-first");
  		if($("#replacing-div-second").is(":visible")){
  			
  			div = $("#replacing-div-second");
  		}
  		$("#content section").hide();
  		viewParams = {};
  		var url = $(this).attr("href");
  		sntapp.fetchAndRenderView(url, div, {}, false, viewParams);
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