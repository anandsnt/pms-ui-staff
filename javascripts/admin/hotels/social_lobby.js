var SocialLobbyView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_social_lobby').on('click', that.saveSocialLobby); 
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  // To save Social Lobby
  this.saveSocialLobby = function() {
	 
	 var is_social_lobby_on = "false",
	 	 is_my_group_on = "false";
  	 if(that.myDom.find("#div-social-lobby").hasClass("on")){
  	 	 is_social_lobby_on = "true";
  	 }
  	 if(that.myDom.find("#div-my-group").hasClass("on")){
  	 	 is_my_group_on = "true";
  	 }
  	 
	 var arrival_grace_days = that.myDom.find("#arrival-grace-days").val();
	 var departure_grace_days = that.myDom.find("#departure-grace-days").val();
	 var data = {
				"is_social_lobby_on":  is_social_lobby_on,
				"is_my_group_on":  is_my_group_on,
				"arrival_grace_days": arrival_grace_days,
				"departure_grace_days":departure_grace_days
	 };
	 
	 var url = '';
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveSocialLobby,
				failureCallBack: that.fetchFailedOfSaveSocialLobby,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);	
	    
  };
  // To handle success on save API
  this.fetchCompletedOfSaveSocialLobby = function() {
  	sntapp.notification.showSuccessMessage("Save successfully", that.myDom);
  };
  // To handle failure on save API
  this.fetchFailedOfSaveSocialLobby = function(data){
  	sntapp.notification.showErrorMessage(data.errors, that.myDom);
  };
};