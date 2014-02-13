var UsersListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.pageinit = function(){
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find($('#users_list_table')).tablesorter({ headers: { 4:{sorter:false},5:{sorter:false} } });
  	that.myDom.find($('#add_new_user')).on('click', sntadminapp.gotoNextPage);
  	that.myDom.find($('#find_existing_user')).on('click', sntadminapp.gotoNextPage);
  	that.myDom.find($('.title')).on('click', sntadminapp.gotoNextPage);
  	// to activate/inactivate user on clicks toggle button of users row
  	that.myDom.find($(".activate-inactivate-button")).on('click', that.activateInactivateUser);
  	that.myDom.find($(".icon-delete")).on('click', that.deleteUser);
  };
  //activate/inactivate user
  this.activateInactivateUser = function(){
  	var url = '/admin/users/toggle_activation';
  	var postData = {};
  	var selectedId = $(this).attr("user");// to get the current toggle user's id
    if($("#activate-inactivate-button_"+selectedId+" .switch-button").hasClass("on")) {
		  postData.activity = "inactivate";
	} else {
		postData.activity = "activate";
	}
  	postData.id = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData
	};
	webservice.postJSON(url, options);	
  };
  this.goBackToPreviousView = function() {
  	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  //to delete user
  this.deleteUser = function(){
  	
  	var postData = {};
  	var selectedId = $(this).attr("id");
  	var url = '/admin/users/'+selectedId;
  	postData.id = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfDelete,
			   loader:"BLOCKER",
			   successCallBackParameters: {"selectedId": selectedId}
	};
	webservice.deleteJSON(url, options);
	
	
  }; 
  //to remove deleted row and show messa
  this.fetchCompletedOfDelete = function(data, successParams){
	  if(data.status == "success"){
		  sntapp.notification.showSuccessMessage("Deleted Successfully", that.myDom);
		  that.myDom.find($("#user_row_"+successParams['selectedId'])).html("");
	  }	 
	  else{
		  
		  sntapp.notification.showErrorList(data.errors, that.myDom);  
	  }	  
  };
  
};