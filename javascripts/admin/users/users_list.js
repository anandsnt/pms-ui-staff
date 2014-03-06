var UsersListView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  this.currentView = $("body").attr("id");

  this.pageinit = function(){
    if(that.currentView == 'hotel-admin-view'){
      that.myDom.find('#go_back, #find_existing_user').hide();
    }
   
  };
  this.delegateEvents = function(){  	
  	that.myDom.find('#users_list_table').tablesorter({ headers: { 4:{sorter:false},5:{sorter:false} } });
  	that.myDom.find('#add_new_user').on('click', that.gotoNextPage);
  	that.myDom.find('#find_existing_user').on('click', that.gotoNextPage);
    that.myDom.find($('#go_back, #cancel')).on('click', that.gotoPreviousPage);
    that.myDom.find('.title').on('click', that.gotoNextPage);
  	// to activate/inactivate user on clicks toggle button of users row
  	that.myDom.find(".activate-inactivate-button").on('click', that.activateInactivateUser);
  	that.myDom.find(".icon-delete").on('click', that.deleteUser);
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

  this.gotoNextPage = function(e){
    if (that.currentView == "snt-admin-view") {
        e.preventDefault(); 
        var href = $(this).attr("href");
        var viewParams = {};
        var backDom = $("#replacing-div-third");
        backDom.hide();
        var nextViewParams = {'backDom': backDom};
        var nextDiv = $("#replacing-div-fourth");
        nextDiv.show();
        if(href != undefined){
          sntapp.fetchAndRenderView(href, nextDiv, viewParams, 'BLOCKER', nextViewParams);
        }
    }else{
      sntadminapp.gotoNextPage(e);
    }

  };

  //go to previous page withount any update in view
  this.gotoPreviousPage = function() {
    that.myDom.html("");
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