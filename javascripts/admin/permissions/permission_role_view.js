var PermissionView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;
    //delegate Events
	this.delegateEvents = function() {
		that.myDom.find(('.permission-tabs')).tabs(); // ui tabs
		that.myDom.find(('#roles-menu li')).on('click', function(){
			var currentId = $(this).attr("data-id");
			that.myDom.find("ul.permission-box").removeClass("current-permission");
			that.myDom.find("#assigined-roles-"+currentId).addClass("current-permission"); // to get current selected permissions box 
		});
		that.myDom.find(('#save_permissions')).on('click', that.savePermissionRoles);
	};
	//function to save the permissons
	this.savePermissionRoles = function() {
		var postData = {};
		postData.permissions = [];
		postData.value = $(".current-permission").attr("data-id");
		
		that.myDom.find(".current-permission li").each(function(n) {
			postData.permissions.push($(this).attr("value")); // to get the assigned permissons
		});
		var url = '/admin/roles_permissions/save_permissions';
		var webservice = new WebServiceInterface();

		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			failureCallBack: that.fetchFailedOfSave,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);
	};
	//show success message
	this.fetchCompletedOfSave = function(successMessage){
		sntapp.notification.showSuccessMessage("Saved Successfully", that.myDom);	
	};
	//show success message
	this.fetchFailedOfSave = function(errorMessage){
		sntapp.notification.showErrorMessage("Some error occured: " +errorMessage, that.myDom);	
	};
};
