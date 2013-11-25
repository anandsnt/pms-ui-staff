var SntAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){
  	// $('.icon-admin-menu').on('draggable', that.customDrag);
  	that.myDom.find('ul.dashboard-items li').on('click', that.appendNewPage);
  	that.myDom.find('li.ui-state-default a.ui-tabs-anchor').on('click', that.clearReplacingDiv);
  };
  this.bookMarkAdded = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.addBookMark(bookMarkId);
  };
  this.bookMarkRemoved = function(bookMarkId){
  	var delegateBookMark = new DelegateBookMark();
  	delegateBookMark.removeBookMark(bookMarkId);
  };
  this.clearReplacingDiv = function() {	  
	  $("#replacing-div").html("");
	  $($(this).attr("href")).show();
  };
  this.appendNewPage = function(event){
	  var href = $(this).find("a").eq(0).attr("href");
	  if(href != undefined){
		  var url = href;
	  	  event.preventDefault();		  
		  var viewParams = {};
		  $(this).parents('section:eq(0)').hide();
		  sntapp.fetchAndRenderView(url, $("#replacing-div"), viewParams);
	  }
  };
};