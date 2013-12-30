var GuestReviewView = function(domRef){
  BaseView.call(this);  
  this.myDom = domRef; 
  this.currentView = $("body").attr("id") ;
  var that = this;
  
  this.delegateEvents = function(){  	
  	that.myDom.find('#cancel, #go_back').on('click', that.goBackToPreviousView); 
  	that.myDom.find('#save_guest_review').on('click', that.saveGuestReviews);
  };
  
  this.goBackToPreviousView = function() {
 	sntadminapp.gotoPreviousPage(that.viewParams);
  };
  
  this.saveGuestReviews = function() {
  	
  	 var is_guest_reviews_on = "false";
  	 
  	 if(that.myDom.find("#div-guest-review").hasClass("on")){
  	 	 is_guest_reviews_on = "true";
  	 }
  	 
	 var number_of_reviews = that.myDom.find("#number-of-reviews").val();
	 var rating_limit = that.myDom.find("#rating-limit").val();
	 
	 var data = {
		    "is_guest_reviews_on": is_guest_reviews_on,
		    "number_of_reviews": number_of_reviews,
		    "rating_limit": rating_limit
	 };
	 
	 var url = '';
	 var webservice = new WebServiceInterface();
	 var options = { 
				requestParameters: data,
				successCallBack: that.fetchCompletedOfSaveGuestReviews,
				loader: 'blocker'
	 };
	 webservice.postJSON(url, options);	
	    
  };
  
  this.fetchCompletedOfSaveGuestReviews = function() {
  	console.log("fetchCompletedOfSaveGuestReviews");
  };
};