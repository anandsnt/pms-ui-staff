var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;

  this.pageinit = function(){
    console.log("RegistrationCardView pageinit");
    if (viewScroll) { destroyViewScroll(); }
    setTimeout(function(){
        createViewScroll('#registration-content');
  	}, 300);
  }
  this.delegateEvents = function(){
  	console.log("RegistrationCardView delegateEvents");
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  }
  this.completeCheckin = function(){
  	
  	console.log("RegistrationCardView completeCheckin");
  	
  	var terms_and_conditions = that.myDom.find("#subscribe-via-email").hasClass("checked");
  	var signature = that.myDom.find(".output").val();
  	var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked");
  	
  	console.log(terms_and_conditions);
  	
  	if(!terms_and_conditions){
  		alert("Please check agree to the Terms &Conditions");
  	}
  	else{
  		
  		var data= {
	    "is_promotions_and_email_set": is_promotions_and_email_set,
	    "signature": signature
		};
	
		console.log(data);
  		
  	}
  }
}