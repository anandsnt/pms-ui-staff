var UsersListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  this.currentView = $("body").attr("id") ;
  var that = this;
  
  this.pageinit = function(){
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find($('#users_list_table')).tablesorter();
  	that.myDom.find($('#add_new_user')).on('click', sntadminapp.gotoNextPage);
  };
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  this.pageshow = function(){
  	
  }; 
  
};