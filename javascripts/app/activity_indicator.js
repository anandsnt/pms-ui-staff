var ActivityIndicator = function() {
	
	var that = this;
	
	this.showActivityIndicator = function(loaderType) {
		if(loaderType.toUpperCase() == 'BLOCKER'){
			// function for showing the loader (with overlay) on the screen
			var $loader = '<div id="loading"><div id="loading-spinner" /></div>';
			$($loader).prependTo('body').show();
		}
		else if(loaderType.toUpperCase() == 'NORMAL'){
           var $loader = '<div id="loading"></div>';
           $($loader).prependTo('body').show(); 
		}
	};
	
	this.hideActivityIndicator = function() {
		// function for showing the loader (with overlay) on the screen
		$("#loader, #loading").hide().remove();
		
	};

	
};