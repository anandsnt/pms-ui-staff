var HotelDepartmentsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef; 
  this.callSaveApi = function(){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val();
  	postData.value = that.myDom.find("#edit-department-details").attr("department_id");
  
  	var url = 'admin/addnewdepartment';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
  this.updateApi = function(){
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val();
  	postData.value = that.myDom.find("#edit-department-details").attr("department_id");
  
  	var url = 'admin/updateuser';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
};