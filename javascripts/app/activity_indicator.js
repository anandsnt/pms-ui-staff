var ActivityIndicator = function() {
	
	this.defaultLoader = 'NORMAL';
	this.defaultLoaderId = 'loading';
	var that = this;
	
	this.showActivityIndicator = function(loaderType, loaderId) {
		var myLoaderId =loaderId;
		//do nothing if none passed
		if(loaderType.toUpperCase() == 'NONE'){
			return false;
		}		
		
		if(typeof loaderType === 'undefined' || $.trim(loaderType) === ''){
			loaderType = that.defaultLoader;
		}
		
		if(typeof loaderId === 'undefined' || $.trim(loaderId) === ''){
			myLoaderId = that.defaultLoaderId;
		}

		if(loaderType.toUpperCase() == 'BLOCKER'){
			// function for showing the loader (with overlay) on the screen
			var $loader = '<div id="' +myLoaderId+'"><div id="loading-spinner" /></div>';
		}
		else if(loaderType.toUpperCase() == 'NORMAL'){
           var $loader = '<div id="' +myLoaderId+'"></div>';           
		}
		$($loader).prependTo('body').show(); 
	};
	
	this.hideActivityIndicator = function(loaderId) {
		var myLoaderId =loaderId;
		if(typeof loaderId === 'undefined' || $.trim(loaderId) === ''){
			myLoaderId = that.defaultLoaderId;
		}
		// function for showing the loader (with overlay) on the screen
		$("#loader").hide().remove();		
		//$("#loading").hide().remove();
		$('#' + myLoaderId).hide().remove();
	};

	
};