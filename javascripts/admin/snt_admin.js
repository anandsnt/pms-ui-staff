var SntAdminView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;

  this.pageinit = function(){
    setUpAdmin(domRef, this);
  };
  this.delegateEvents = function(){
  	that.myDom.find('li.ui-state-default a.ui-tabs-anchor').on('click', that.clearReplacingDiv);
  	that.myDom.find('ul.dashboard-items li').on('click', sntadminapp.appendNewPage);
  	
  	that.myDom.find('#admin-menu li a').on('click', that.bookMarkClick);
  	that.myDom.find('#admin-header nav').on('click', that.bookMarkClick);
  };
  

  
  
  this.bookMarkClick = function(event){
	  sntadminapp.bookMarkClick(event);
  };

  this.clearReplacingDiv = function() {  
  	$("#replacing-div-first").html("");
    $("#replacing-div-second").html("");
    $("#replacing-div-third").html("");
    $("#replacing-div-first, #replacing-div-second, #replacing-div-third").removeClass("current");
	$("#replacing-div-first").show();
	$($(this).attr("href")).show(); 
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