var RegistrationCardView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.reservation_id = getReservationId();
  this.url = "ui/checkinSuccess";
  this.pageinit = function(){
    
    if (viewScroll) { destroyViewScroll(); }
    setTimeout(function(){
        createViewScroll('#registration-content');
  	}, 300);
  	
  	var width = that.myDom.find("#signature").width();
  	that.myDom.find("#signature").jSignature({height:130, width:width, lineWidth :1});
	that.myDom.find("#signature canvas").addClass('pad');
	 
	$("#signature").on('mouseover',function(){
		viewScroll.disable();
	});	
	$("#signature").on('mouseout',function(){
		viewScroll.enable();
	});
  };
  this.delegateEvents = function(){
  	that.myDom.find('#checkin-button').on('click', that.completeCheckin);
  	that.myDom.find('#clear-signature').on('click',that.clearSignature);
  	that.myDom.find('#back-to-staycard').on('click',that.gotoStayCard);
  };
  
  this.completeCheckin = function(e){
  	
  	e.stopPropagation();
  	e.preventDefault();
  	e.stopImmediatePropagation();
  	
  	var signature = JSON.stringify($("#signature").jSignature("getData", "native"));
  	var terms_and_conditions = that.myDom.find("#terms-and-conditions").hasClass("checked")? 1 : 0;
  	var errorMessage ="";
  	
  	if(signature == "[]") errorMessage = "Signature is missing";
  	else if(!terms_and_conditions) errorMessage ="Please check agree to the Terms & Conditions";
  	
   	if (errorMessage!="") {
   		alert(errorMessage);
  		return;
  	}
  	else{	
	  	var is_promotions_and_email_set = that.myDom.find("#subscribe-via-email").hasClass("checked") ? 1 : 0;
	  	var data= {
		    "is_promotions_and_email_set": is_promotions_and_email_set,
		    "signature": signature,
		    "reservation_id":that.reservation_id
		};
		$.ajax({
		    type: "POST",
		    url: '/staff/checkin',
		    data : data,
		    success: function(data) {
		    	if(data.status == "success"){
				      var message = $("#gc-firstname").val()+" "+$("#gc-lastname").val()+" IS CHECKED IN";
					  var successModal = new SuccessModal();
					  successModal.initialize();
					  successModal.params = {"message": message};
				}
				if(data.status == "failure"){
					alert(data.errors);
				}
		    },
		    error: function(){
		      console.log("There is an error!!");
			}
	  	});
	 }
  };
  this.clearSignature = function(){
  	that.myDom.find("#signature").jSignature("reset");
  };
  this.gotoStayCard= function(e){
  	//Page transition to stay card.
  	e.preventDefault();
    var viewURL = "staff/staycards/staycard";
    var viewDom = $("#view-nested-second");
    var params = {"id": that.reservation_id};
    sntapp.fetchAndRenderView(viewURL, viewDom, params, false);
  };
};