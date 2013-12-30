var PermissionView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateEvents = function() {
		that.myDom.find($('.permission-tabs')).tabs(); 
		that.myDom.find($("#assigned-roles li")).on('click', that.savePermissionRoles);
	};
	this.savePermissionRoles = function() {
		var postData = {};
		postData.user_roles = [];
		that.myDom.find("#assigned-roles li").each(function(n) {
    	postData.user_roles.push($(this).attr("id"));
    	console.log("postData",postData.user_roles);
	});
};
}; 