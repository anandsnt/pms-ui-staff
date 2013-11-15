var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.pageinit = function(){
    
    if (viewScroll) { destroyViewScroll(); }
    setTimeout(function(){
        createViewScroll('#registration-content');
  	}, 300);
  	that.myDom.find("#signature").jSignature();
	that.myDom.find("#output").val("");
	that.myDom.find("#signature canvas").height(180);  
  }
  this.delegateEvents = function(){
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  	that.myDom.find('#clear-signature').on('click',that.clearSignature);
  }
  
  this.completeCheckin = function(e){
  	e.stopPropagation();
  	e.preventDefault();
  	e.stopImmediatePropagation();
  	
  	var signature = JSON.stringify($("#signature").jSignature("getData", "native"));
  	var terms_and_conditions = that.myDom.find("#subscribe-via-email").hasClass("checked");
  	var errorMessage =""
  	
  	if(!terms_and_conditions) erroMessage ="Please check agree to the Terms &Conditions";
  	if(signature == "[]") errorMessage = "Please sign in";
   
   	if (errorMessage) {
   		alert(errorMessage);
  		return;
  	}
  		
  	var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
  	var data= {
	    "is_promotions_and_email_set": is_promotions_and_email_set,
	    "signature": signature,
	    "reservation_id":that.reservation_id
	};
	
	$.ajax({
	    type: "POST",
	    //url: 'staff/user_memberships/link_to_reservation',
	    data : data,
	    success: function(data) {
	      console.log("Succesfully completed checkin");
	    },
	    error: function(){
	      console.log("There is an error!!");
		}
  	});
  }
  this.clearSignature = function(){
  	that.myDom.find("#signature").jSignature("reset");
  }
  
}