var ValidateCheckinModal = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "staff/staycards/validate_email_phone";
	this.reservation_id = getReservationId();
	this.delegateEvents = function() {
		
		that.myDom.find('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
		that.myDom.find('#validate #submit').on('click', that.submitAndGotoCheckin);
		that.myDom.find('#validate #cancel').on('click', that.ignoreAndGotoCheckin);
		
		this.modalType = this.params.type;
		if(this.modalType == "NoPhone"){
			$("#validate .message").html("Phone number missing!");
			$("#validate #guest-email-entry").hide();
		}
		else if(this.modalType == "NoEmail"){
			$("#validate .message").html("E-mail missing!");
			$("#validate #guest-phone-entry").hide();
		}
	};
	this.modalInit = function() {
	};
	this.submitAndGotoCheckin = function() {
		var userId = $("#user_id").val();
		var guestID = $("#guest_id").val();
		$contactJsonObj = {};
		$contactJsonObj['guest_id'] = $("#guest_id").val();
		
		if(that.modalType == "NoPhone"){
			var phone = $("#validate #guest-phone").val();
			if(phone == ""){
				alert("Please enter phone number");
				return false;
			}
			else{
				$contactJsonObj['phone'] = phone;
			}
		}
		else if(that.modalType == "NoEmail"){
			var email = $("#validate #guest-email").val();
			if(email == ""){
				alert("Please enter email");
				return false;
			}
			else{
				$contactJsonObj['email'] = email;
			}
		}
		else if(that.modalType == "NoPhoneNoEmail"){
			var phone = $("#validate #guest-phone").val();
			var email = $("#validate #guest-email").val();
			if(phone == ""){
				alert("Please enter phone number");
				return false;
			}
			else if(email == ""){
				alert("Please enter email");
				return false;
			}
			else{
				$contactJsonObj['email'] = email;
				$contactJsonObj['phone'] = phone;
			}
		}

	    $.ajax({
				type : "PUT",
				url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
				async : false,
				dataType : 'json',
				contentType : 'application/json',
				success : function() {
				},
				error : function() {
				}
		});
		
		// Update UI changes in Guest card header and Contact information.
		var guest_phone = $("#gc-phone").val();
		var guest_email = $("#gc-email").val();
					
		if(guest_phone == ""){
			$("#gc-phone").val($("#validate #guest-phone").val());
			$("#phone").val($("#validate #guest-phone").val());
		}
		if(guest_email ==""){
			$("#gc-email").val($("#validate #guest-email").val());
			$("#email").val($("#validate #guest-email").val());
		}
	
		if($.trim($('#reservation-'+that.reservation_id+'-room-number strong').text() == "")){
			var viewParams = {"next_view" : "registration"}
    		that.goToRoomAssignmentView(viewParams);
   			// that.goToRoomAssignmentView();
	    }else if($('#reservation-checkin').attr('data-upsell-enabled') == "true"){
	      	var viewParams = {"next_view" : "registration"}
	      	that.goToRoomUpgradeView(viewParams);
	    }
	    else{
	    	that.goToRegistrationCardView();
	    }
		that.hide();
	};

	this.ignoreAndGotoCheckin = function(e) {
		if($.trim($('#reservation-'+that.reservation_id+'-room-number strong').text() == "")){
   			that.goToRoomAssignmentView();
	    }
	    else if($('#reservation-checkin').attr('data-upsell-enabled') == "true"){
	      	var viewParams = {"next_view" : "registration"}
	      	that.goToRoomUpgradeView(viewParams);
	    }
	    else{
	    	that.goToRegistrationCardView();
	    }
		that.hide();
	};

	this.goToRoomAssignmentView = function(){
	    var viewURL = "staff/preferences/room_assignment";
	    var viewDom = $("#view-nested-second");
	    var reservation_id = getReservationId();
	    var params = {"reservation_id": reservation_id};
	    sntapp.fetchAndRenderView(viewURL, viewDom, params, true);
    };
    this.goToRoomUpgradeView = function(viewParams){
	    var viewURL = "staff/reservations/room_upsell_options";
	    var viewDom = $("#view-nested-second");
	    var reservation_id = getReservationId();
	    var params = {"reservation_id": reservation_id};
	    sntapp.fetchAndRenderView(viewURL, viewDom, params, true, viewParams);
    };
    this.goToRegistrationCardView = function(viewParams){
	    //Page transition to registration card.
	  	e.preventDefault();
	    var viewURL = "staff/reservation/bill_card";
	    var viewDom = $("#view-nested-first");
	    var params = {"reservation_id": that.reservation_id};
	    sntapp.fetchAndRenderView(viewURL, viewDom, params, false);
    };
}