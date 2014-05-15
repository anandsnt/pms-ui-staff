var ConnectivityView = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  this.delegateEvents = function(){
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
  	that.myDom.find('#save_connectivity').on('click', ["save"], that.testOrSaveConnectivityDetails);
  	that.myDom.find('#test_connectivity').on('click', ["test"], that.testOrSaveConnectivityDetails);
  	that.myDom.find('#access-url, #pms-channel-code, #pms-user-name, #pms-user-pwd, #pms-hotel-code, #pms-chain-code').on('change focusout blur', that.enableTestConnection);
  };

  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  // To save guest review
  this.testOrSaveConnectivityDetails = function(event) {

  	var data = that.getData();

	  var postData = {
		    "pms_access_url": data.pms_access_url,
		    "pms_channel_code": data.pms_channel_code,
		    "pms_user_name": data.pms_user_name,
		    "pms_user_pwd": data.pms_user_pwd,
		    "pms_hotel_code": data.pms_hotel_code,
		    "pms_chain_code": data.pms_chain_code,
		    "pms_timeout": data.pms_timeout
	 };
	 var type = event.data[0];
	 if(type == "save"){
	 	var url = '/admin/save_pms_connection_config';
	 } else {
	 	var url = '/admin/test_pms_connection';
	 }
	 
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSave,
				failureCallBack: that.fetchFailedOfSave,
				successCallBackParameters:{ "type": type},
				failureCallBackParameters:{ "type": type},
				loader: 'blocker'
	 };
	 if(type == "save"){
	 	 webservice.postJSON(url, options);	
	 } else {
	 	 webservice.getJSON(url, options);	
	 }
	
	    
  };

  //enable test connection button
  this.enableTestConnection = function(event){

  	 var data = that.getData();
  	 if(data.pms_access_url!="" && data.pms_channel_code!="" && data.pms_user_name!="" && data.pms_user_pwd!="" && data.pms_hotel_code!="" && data.pms_chain_code!=""){
  	 	that.myDom.find("#test_connectivity").removeClass("grey").addClass("green").attr("disabled", false);
  	 } else {
  	 	that.myDom.find("#test_connectivity").removeClass("green").addClass("grey").attr("disabled", true);
  	 }
  };
   //get data
  this.getData = function(){
  	 var pms_access_url   = that.myDom.find("#access-url").val();
  	 var pms_channel_code = that.myDom.find("#pms-channel-code").val();
  	 var pms_user_name    = that.myDom.find("#pms-user-name").val();
  	 var pms_user_pwd     = that.myDom.find("#pms-user-pwd").val();
  	 var pms_hotel_code   = that.myDom.find("#pms-hotel-code").val();
  	 var pms_chain_code   = that.myDom.find("#pms-chain-code").val();
  	 var pms_timeout   = that.myDom.find("#pms-timeout").val();
  	 
  	 var data = {};
  	 data.pms_access_url 	= pms_access_url;
  	 data.pms_channel_code 	= pms_channel_code;
  	 data.pms_user_name = pms_user_name;
  	 data.pms_user_pwd = pms_user_pwd;
  	 data.pms_hotel_code = pms_hotel_code;
  	 data.pms_chain_code = pms_chain_code;
  	 data.pms_timeout = pms_timeout;
  	 return data;
  };
  // To handle success on save API
  this.fetchCompletedOfSave = function(data, params) {
  	if(params['type'] == "save"){
  		sntapp.notification.showSuccessMessage("Saved successfully", that.myDom);
  	} else {
  		sntapp.notification.showSuccessMessage("Connection Valid", that.myDom, '', true);
  	}

  };
  // To handle failure on save API
  this.fetchFailedOfSave = function(errorMessage, params){

  	if(params['type'] == "save"){
  		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  	} else {
  		sntapp.notification.showErrorMessage(errorMessage, that.myDom);
  	}
  };
};
