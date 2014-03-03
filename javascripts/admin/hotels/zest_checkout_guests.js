var CheckoutGuests = function(domRef){
  BaseView.call(this);
  this.myDom = domRef;
  var that = this;

  /**
  * Method used to perform initial operations on elemnents    
  */
  this.pageinit = function(){
  	setupSelection();
    that.myDom.find('#guests').tablesorter({
       headers: { 
            0: {sorter:false}
        }
    });
  };
  this.delegateEvents = function(){
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView);
    that.myDom.find('#send-email').on('click', that.sendEmail);
  };

  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams, that.myDom);
  };
  //to send email to all selected guests
  this.sendEmail = function(event){
  	var total = that.myDom.find("#guests").attr("data-count");
  	var reservation_ids = [];
  	
  	that.myDom.find('input[type=checkbox].guest').each(function () {
  		if(that.myDom.find(this).parent().hasClass("checked")){
  			reservation_ids.push(that.myDom.find(this).val());
  		}     	
	});
	var postParams = {};
	postParams.reservations = reservation_ids;
	var url = '/admin/send_checkout_alert';
	var webservice = new WebServiceInterface();
	var options = {
			   requestParameters: postParams,
			   successCallBack: that.fetchCompletedOfSend,
			   failureCallBack: that.fetchFailedOfSend,
			   loader: "BLOCKER"
	};
	webservice.postJSON(url, options);
  	
  };
  //to handle success call back
	this.fetchCompletedOfSend = function(data) {
		sntapp.notification.showSuccessMessage(data.data.message, that.myDom, '', true);
	};
	// to handle failure call back
	this.fetchFailedOfSend = function(errorMessage) {
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
	};

};


