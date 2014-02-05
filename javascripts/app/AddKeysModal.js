var AddKeysModal = function(callBack) {

	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	this.url = "staff/reservations/" + reservation_id + "/get_key_setup";
	this.delegateEvents = function() {

		that.myDom.find('.radio').on('click', function() {
			that.myDom.find("#key_print_new,#key_print_additional").removeClass("is-disabled");
			that.myDom.find("#key_print_new,#key_print_additional").attr("disabled", false);
		});
		that.myDom.find('#key_print_new').on('click', that.printNewKey);
		that.myDom.find('#key_print_additional').on('click', that.printAdditionalKey);
		var guestEmail = $("#change-name #gc-email").val();

		if (guestEmail == "") {
			that.myDom.find(".print_key_missing").show();
		}
		else{
			that.myDom.find(".print_key_missing").hide();
			that.myDom.find("#key-guest-email").val(guestEmail);
			that.myDom.find("#print-keys").removeClass("is-disabled");
			that.myDom.find("input:radio").attr("disabled", false);
		}
		
		// Hide key_print_additional button while coming from bill card.
		var source_page = this.params.source_page;
		if(source_page == views.BILLCARD){
			that.myDom.find("#key_print_additional").addClass('hidden');
			that.myDom.find("#key_print_new").removeClass('half');
		}
	};
	this.modalInit = function() {

	};
	this.printNewKey = function() {
		var reservation_id = getReservationId();
		var keyEmailElement = $("#key-guest-email").length;
		var guest_email = that.myDom.find(("#key-guest-email")).val();
		if (keyEmailElement > 0) {
			if (keyEmailElement > 0) {
				key_guest_email = that.myDom.find(("#key-guest-email")).val();

			}
			else {
				key_guest_email = $("#change-name #gc-email").val();
			}
			selected_key = $('input:radio[name="keys"]:checked').val();
			var data = {
				"reservation_id" : reservation_id,
				"email" : key_guest_email,
				"key" : selected_key,
				"is_additional" : "false"
			};

			that.saveKey(data);
		}
		else {
			that.myDom.find(".print_key_missing").show();
			return false;
		}

	};
	this.printAdditionalKey = function() {
		var reservation_id = getReservationId();
		var keyEmailElement = $("#key-guest-email").length;
		var guest_email = that.myDom.find(("#key-guest-email")).val();
		if (keyEmailElement > 0) {
			if (keyEmailElement > 0) {
				key_guest_email = that.myDom.find($("#key-guest-email")).val();
			}
			else {
				key_guest_email = $("#change-name #gc-email").val();
			}
			selected_key = $('input:radio[name="keys"]:checked').val();
			var data = {
				"reservation_id" : reservation_id,
				"email" : key_guest_email,
				"key" : selected_key,
				"is_additional" : "true"
			};
			that.saveKey(data);
		}
		else {
			that.myDom.find(".print_key_missing").show();
			return false;
		}
	};
	this.saveKey = function(data) {		     
	    var url = "staff/reservation/print_key";
	    var webservice = new WebServiceInterface();
	    var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedKeys,
			   failureCallBack: that.fetchFailedOfSave,
			   loader: 'NORMAL',
	    };
	    webservice.postJSON(url, options);
	};
	this.fetchCompletedKeys = function(data) {
			that.hide(callBack);
   };
   //key generation failure case
   this.fetchFailedOfSave = function(errorMessage){
		sntapp.activityIndicator.hideActivityIndicator();
		sntapp.notification.showErrorMessage("Some error occured: " + errorMessage, that.myDom);  
  };
}; 