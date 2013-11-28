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