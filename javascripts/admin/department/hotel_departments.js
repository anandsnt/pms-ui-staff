var HotelDepartmentsView = function(domRef){
  BaseInlineView.call(this);  
  
  that = this;
  this.myDom = domRef;
  //function to add new department
  this.saveNewApi = function(){ 
  	 	
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val(); 	
  	var url = '/admin/department/create';
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER"
			   
	};
	webservice.postJSON(url, options);	
  };
  //function to update department
  this.updateApi = function(){
  	var postData = {};
  	postData.name = that.myDom.find("#department-name").val();
  	postData.value = that.myDom.find("#edit-department-details").attr("department_id");
  
  	var url = '/admin/department/'+postData.value;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData,
			   successCallBack: that.fetchCompletedOfSave,
			   loader:"BLOCKER"
			   
	};
	webservice.putJSON(url, options);	
  };
  this.deleteItem = function(event){
  	event.preventDefault();
  	var postData = {};
  	var selectedId = $(this).attr("id");
  	var url = '/admin/departments/'+selectedId;
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