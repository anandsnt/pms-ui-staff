var ActivityIndicator = function() {
	
	this.showActivityIndicator = function() {
		// function for showing the loader (with overlay) on the screen
		var $loader = "<div id=loader class=loader><div id=activity-indicator class=activity-indicator></div></div>";
		$($loader).prependTo('body').show();		
	};
	
	this.hideActivityIndicator = function() {
		// function for showing the loader (with overlay) on the screen
		$("#loader").hide().remove();	
	};
	
}