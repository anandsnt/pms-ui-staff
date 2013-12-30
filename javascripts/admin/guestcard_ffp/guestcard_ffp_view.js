var GuestCardFFPView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateEvents = function() {
		that.myDom.find($('#ffp')).tablesorter();
		that.myDom.find($(".activate-inactivate-button")).on('click', that.activateInactivateLoyalty);
	};


  //activate/inactivate loyallty
  this.activateInactivateLoyalty = function(){
  	//TODO set url.
  	var url = '';
  	var postData = {};
  	var selectedId = $(this).attr("ffp");// to get the current toggle ffp id
    if($("#activate-inactivate-button_"+selectedId+" .switch-button").hasClass("on")) {
		  postData.activity = "inactivate";
	} else {
		postData.activity = "activate";
	}
  	postData.id = selectedId;
	var webservice = new WebServiceInterface();		
	var options = {
			   requestParameters: postData
	};
	webservice.postJSON(url, options);	
  };
}; 