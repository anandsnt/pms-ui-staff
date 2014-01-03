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
			$contactJsonObj['phone'] = phone;
		}
		else if(that.modalType == "NoEmail"){
			var email = $("#validate #guest-email").val();
			if(email != ""){
				if(validateEmail(email)){
					$contactJsonObj['email'] = email;
				} else {
					return false;
				}
			}
		}
		else if(that.modalType == "NoPhoneNoEmail"){
			var phone = $("#validate #guest-phone").val();
			var email = $("#validate #guest-email").val();
			if(phone == "" && email == ""){
				alert("Please enter any of the fields");
				return false;
			}
			else{
				if(email!=""){
					if(validateEmail(email)){
						$contactJsonObj['email'] = email;
						$contactJsonObj['phone'] = phone;
					} 
					else {
						return false;
					}
				}
				 else {
					$contactJsonObj['email'] = email;
					$contactJsonObj['phone'] = phone;
				}
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
	
		if(($.trim($('#room-number strong').text()) == "")||
		  ($('#room-number').attr('data-room-status') != "READY") ||
          ($('#room-number').attr('data-fo-status') != "VACANT")){
    		that.goToRoomAssignmentView();
    	}
    	
	    else if(($('#reservation-checkin').attr('data-force-upsell') == "true")
     		&&($('#reservation-checkin').attr('data-upsell-available') == "true")){
    		that.goToRoomUpgradeView();

	    }
	    else{
	    	that.goToRegistrationCardView();
	    }
		that.hide();
	};

	this.ignoreAndGotoCheckin = function(e) {
		if(($.trim($('#room-number strong').text()) == "")||
		  ($('#room-number').attr('data-room-status') != "READY") ||
          ($('#room-number').attr('data-fo-status') != "VACANT")){
    		that.goToRoomAssignmentView();
    	}
	    else if(($('#reservation-checkin').attr('data-force-upsell') == "true")
     		&&($('#reservation-checkin').attr('data-upsell-available') == "true")){
    		that.goToRoomUpgradeView();
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
	    var nextViewParams = {"showanimation": true, "next_view" : views.BILLCARD };
	    sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams);
    };

    this.goToRoomUpgradeView = function(){
	    var viewURL = "staff/reservations/room_upsell_options";
	    var viewDom = $("#view-nested-second");
	    var reservation_id = getReservationId();
	    var params = {"reservation_id": reservation_id};
	    var nextViewParams = {"showanimation": true, "next_view" : views.BILLCARD };
	    sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams );
    };

    this.goToRegistrationCardView = function(viewParams){
	    //Page transition to registration card.
      	var viewURL = "staff/reservation/bill_card";
	    //var viewURL = "ui/show?haml_file=staff/reservations/bill_card&json_input=registration_card/registration_card.json&is_hash_map=true&is_layout=false";
        var viewDom = $("#view-nested-third");
        var params = {"reservation_id": that.reservation_id};
        var nextViewParams = {"showanimation": true, "from-view" : views.STAYCARD};
        sntapp.fetchAndRenderView(viewURL, viewDom, params, 'NORMAL', nextViewParams );
    };
};