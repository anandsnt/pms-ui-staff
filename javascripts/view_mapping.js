getViewInstance = function(newView){
	var viewInstance;
	var viewName = newView.find('div:first').attr('data-view');
	if(typeof viewName !== "undefined"){
		viewInstance = new window[viewName]();
	}
	
	return viewInstance;
}