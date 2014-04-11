var ReservationPaymentView = function(domRef){
  BaseView.call(this);
  var that = this;
  this.myDom = domRef;  
  
  this.$paymentTypes = [];

  this.parentView = '';
  	
  this.pageinit = function(){

    // A dirty hack to allow "this" instance to be refered from sntapp
    sntapp.setViewInst('ReservationPaymentView', that);
  };

  this.delegateEvents = function(){
  	that.myDom.find('#add-new-payment').on('click', that.addNewPaymentModal);
    // that.myDom.find('#staycard_creditcard').on('change', that.setPaymentToReservation);
    that.myDom.find("#select-card-from-list").on("click", that.showExistingPayments);
    
    that.myDom.on('click', that.myDomClickHandler);
    // payment-id
  };
  
  this.myDomClickHandler = function(event){
  	
  	var target = that.myDom.find(event.target);
  	if(getParentWithSelector(event, "#update_card")) {
  		event.preventDefault();
        sntapp.paymentTypeSwipe = false;
        return that.addNewPaymentModal();
    }
  };
  
  this.addNewPaymentModal = function(event, options){

  	if ( !sntapp.getViewInst('addNewPaymentModal') ) {
      sntapp.setViewInst('addNewPaymentModal', function() {
        return new AddNewPaymentModal('staycard', that.myDom);
      });
      sntapp.getViewInst('addNewPaymentModal').initialize();
    } else if (sntapp.getViewInst('addNewPaymentModal') && !$('#new-payment').length) {

      // if addNewPaymentModal instance exist, but the dom is removed
      sntapp.updateViewInst('addNewPaymentModal', function() {
        return new AddNewPaymentModal('staycard', that.myDom);
      });
      sntapp.getViewInst('addNewPaymentModal').initialize();
    }
  };
  
  this.fetchCompletedOfSetPaymentToReservation = function(data){
	// success function set payment to reservation's ajax call  
  };
  this.deletePaymentFromReservation = function(target){
  	var reservation_id = getReservationId();
	var selectedElement = target.attr("data-payment-id");
	var webservice = new WebServiceInterface();
    var data = {
    		reservation_id : reservation_id,
    		guest_payment_type_id:   selectedElement
    };
    var url = '/staff/staycards/unlink_credit_card'; 
    var options = {
		   requestParameters: data,
		   successCallBack: that.fetchCompletedOfDelete,
		   failureCallBack: that.fetchFailedOfDelete
    };
	webservice.postJSON(url, options);
  };
  /**
    *   Callback on successful update
    *   @param {Object} web service response
    *   @param {Object} call back params
    */
	this.fetchCompletedOfDelete = function(data){
		
		var replaceHtml = "<figure class='card-logo'>"+
							"<img src='' alt=''></figure>"+									
							"<span class='number'><span class='value number'>"+
							"</span></span><span class='date'> <span class='value date'>"+
							"</span>";
	    that.myDom.find("#select-card-from-list").html(replaceHtml);
	    that.myDom.find("#delete_card").remove();
	    that.myDom.find("#add-new-payment").remove();
	    that.myDom.find(".payment_actions").append('<a id="add-new-payment" class="add-new-button">+ Add</a>');
	    that.delegateEvents();
	};
   /**
    *   Callback on update failed
    *   @param {Object} call back params
    */
	this.fetchFailedOfDelete = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);  
	};
  this.showExistingPayments = function(){
  	var showExistingPaymentModal = new ShowExistingPaymentModal(that.myDom);
    showExistingPaymentModal.initialize();
  };
  
  // this.setPaymentToReservation = function(){
  	// var reservation_id = getReservationId();
  	// var credit_card_id = that.myDom.find("#staycard_creditcard").val();
  	// if(credit_card_id == ""){
  		// var html = "<figure class='card-logo'>Select Credit Card</figure>"+		
				// "<span class='number'>"+					
				// "<span class='value number'> </span>"+
				// "</span>"+
				// "<span class='date'>"+					
				// "<span class='value date'></span>"+
				// "</span>"+
				// "";
//   		
  	// } else {
  		// var html = "<figure class='card-logo'>"+
			// "<img src='' alt=''>"+
			// "</figure>"+
			// "<span class='number'>"+
			// "Ending with"+
			// "<span class='value number'></span>"+
			// "</span>"+
			// "<span class='date'>"+
			// "Date"+
			// "<span class='value date'></span>"+
			// "</span>";
//   		
  	// }
  	// that.myDom.find("#selected-reservation-payment-div").html(html);
  	// var data = {"reservation_id": reservation_id, "user_payment_type_id": credit_card_id };
  	// var url = "/staff/reservation/link_payment";
    // var webservice = new WebServiceInterface();
    // var options = {
		   // requestParameters: data,
		   // successCallBack: that.fetchCompletedOfSetPaymentToReservation,
		   // async: false,
    // };
    // webservice.postJSON(url, options);
// 
//   
  // };
};


	