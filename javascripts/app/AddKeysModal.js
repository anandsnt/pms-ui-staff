var AddKeysModal = function(callBack) {

	BaseModal.call(this);
	var that = this;
	var reservation_id = getReservationId();
	this.url = "staff/reservations/" + reservation_id + "/get_key_setup";
	this.delegateEvents = function() {

		that.myDom.find('.radio').on('click', function() {
			that.myDom.find($("#key_print_new,#key_print_additional")).removeClass("is-disabled");
			that.myDom.find($("#key_print_new,#key_print_additional")).attr("disabled", false);
		});
		that.myDom.find($('#cancel')).on('click', that.hide);
		that.myDom.find($('#key_print_new')).on('click', that.printNewKey);
		$('#key_print_additional').on('click', that.printAdditionalKey);
		var guestEmail = $("#change-name #gc-email").val();

		if (guestEmail == "") {
			$(".print_key_missing").show();
		} else {
			$(".print_key_missing").hide();
			that.myDom.find($("#key-guest-email").val(guestEmail));
			var keyEmailElement = $("#key-guest-email").length;

			if (keyEmailElement > 0) {

				that.myDom.find($("#print-keys")).removeClass("is-disabled");
				$("input:radio").attr("disabled", false);
			}
		}
		
		// Hide key_print_additional button while coming from bill card.
		var source_page = this.params.source_page;
		if(source_page == "bill_card"){
			that.myDom.find("#key_print_additional").addClass('hidden');
			that.myDom.find("#key_print_new").removeClass('half');
			that.hide(callBack);
		}
	};
	this.modalInit = function() {

	};
	this.printNewKey = function() {
		var reservation_id = getReservationId();
		var keyEmailElement = $("#key-guest-email").length;
		var guest_email = that.myDom.find(("#key-guest-email")).val();
		if (validateEmail(guest_email)) {
			if (keyEmailElement > 0) {
				key_guest_email = that.myDom.find(("#key-guest-email")).val();

			} else {
				key_guest_email = $("#change-name #gc-email").val();
			}
			selected_key = $('input:radio[name="keys"]:checked').val();
			var data = {
				"reservation_id" : reservation_id,
				"email" : key_guest_email,
				"key" : selected_key,
				"is_additional" : "false"
			};
			data = JSON.stringify(data);

			that.saveKey(data);
		} else {
			return false;
		}

	};
	this.printAdditionalKey = function() {
		var reservation_id = getReservationId();
		var keyEmailElement = $("#key-guest-email").length;
		var guest_email = that.myDom.find(("#key-guest-email")).val();
		if (validateEmail(guest_email)) {
			if (keyEmailElement > 0) {
				key_guest_email = that.myDom.find($("#key-guest-email")).val();
			} else {
				key_guest_email = $("#change-name #gc-email").val();
			}
			selected_key = $('input:radio[name="keys"]:checked').val();
			var data = {
				"reservation_id" : reservation_id,
				"email" : key_guest_email,
				"key" : selected_key,
				"is_additional" : "true"
			};
			data = JSON.stringify(data);
			that.saveKey(data);
		}else {
			return false;
		}
	};
	this.saveKey = function(data) {
		// $.ajax({
			// type : "POST",
			// url : 'staff/reservation/print_key',
			// data : data,
			// async : false,
			// dataType : 'json',
			// contentType : 'application/json',
			// success : function(data) {
				// if (data.status == "success") {
					// // Commenting for now. Might be we need this in future
					// // $("#change-name #gc-email").val(key_guest_email);
					// that.hide(callBack);
				// }
			// },
			// error : function() {
			// }
		// });
		     
	    var url = "staff/reservation/print_key";
	    var webservice = new WebServiceInterface();
	    var options = {
			   requestParameters: data,
			   successCallBack: that.fetchCompletedKeys,
			   loader: 'NORMAL',
	    };
	    webservice.postJSON(url, options);
	};
	this.fetchCompletedKeys = function(data) {
	  
		if (data.status == "success") {
			hat.hide(callBack);
		}
		else{
			sntapp.notification.showErrorList(data.errors, that.myDom);
		}
   };
}; 