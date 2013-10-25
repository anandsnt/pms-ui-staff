getViewInstance = function(url){
	var viewInstance;
	//get the name of the view to be invoked from the view url
	var viewNameSplited = url.split('?')[0].split('/');
	var viewName = viewNameSplited[viewNameSplited.length -1];
	if(viewName == "staycard"){
		//var viewInstance = new StayCard();
		var viewInstance = new window[viewName]();

	}

	return viewInstance;
}