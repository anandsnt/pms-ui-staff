var ActivityIndicator = function() {
	
	var that = this;
	
	this.showActivityIndicator = function(loaderType) {
		if(loaderType.toUpperCase() == 'BLOCKER'){
			// function for showing the loader (with overlay) on the screen
			var $loader = "<div id=loader class=loader><div id=activity-indicator class=activity-indicator></div></div>";		
			$($loader).prependTo('body').show();
			
			//adjusting the position
			var top = $(window).height() / 2;
			var left = $(window).width() / 2;
			$(".loader .activity-indicator").css({'top': top, 'left': left});	
		}
		else if(loaderType.toUpperCase() == 'NORMAL'){
           var $loader = '<div id="loading" />';
           $($loader).prependTo('body').show(); 
		}
	};
	
	this.hideActivityIndicator = function() {
		// function for showing the loader (with overlay) on the screen
		$("#loader, #loading").hide().remove();
		
	};

	
};