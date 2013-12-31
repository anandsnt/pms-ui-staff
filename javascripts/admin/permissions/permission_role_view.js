var PermissionView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateEvents = function() {
		that.myDom.find($('.permission-tabs')).tabs();
		that.myDom.find($('#save_permissions')).on('click', that.savePermissionRoles);
	};
	this.savePermissionRoles = function() {
		var postData = {};
		postData.assigned_roles = [];
		that.myDom.find("#assigned-roles li").each(function(n) {
			postData.assigned_roles.push($(this).attr("id"));
			console.log("postData", postData.assigned_roles);
			});
/*
			var url = '';
			var webservice = new WebServiceInterface();

			var options = {
				requestParameters : postData,
				successCallBack : that.fetchCompletedOfSave,
				loader : "BLOCKER"
			};
			webservice.postJSON(url, options);*/

		
	};
};
