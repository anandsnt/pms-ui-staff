var PermissionView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;
    //delegate Events
	this.delegateEvents = function() {
		that.myDom.find($('.permission-tabs')).tabs(); // ui tabs
		that.myDom.find($('#permissions ul li')).on('click', function(){
			var currentId = $(this).attr("data-id");
			$("ul.permission-box").removeClass("current-permission");
			$("#assigined-roles-"+currentId).addClass("current-permission"); // to get current selected permissions box 
		});
		that.myDom.find($('#save_permissions')).on('click', that.savePermissionRoles);
	};
	//function to save the permissons
	this.savePermissionRoles = function() {
		var postData = {};
		postData.permissions = [];
		postData.value = $(".current-permission").attr("data-id");
		that.myDom.find(".current-permission li").each(function(n) {
			postData.permissions.push($(this).attr("value")); // to get the assigned permissons
		});
		var url = '#';
		var webservice = new WebServiceInterface();

		var options = {
			requestParameters : postData,
			successCallBack : that.fetchCompletedOfSave,
			loader : "BLOCKER"
		};
		webservice.postJSON(url, options);
	};
};
