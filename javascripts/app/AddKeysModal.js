var AddKeysModal = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "ui/addKeys";
	this.delegateEvents = function() {
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
		console.log("modal init in sub modal");
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

		console.log("JSON.stringify($contactJsonObj) :  " + JSON.stringify($contactJsonObj));
		
	    $.ajax({
				type : "PUT",
				url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
				async : false,
				dataType : 'json',
				contentType : 'application/json',
				success : function() {
					console.log("success");
				},
				error : function() {
					console.log("There is an error!!");
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
		that.hide();
	};

	this.ignoreAndGotoCheckin = function() {
		console.log("modal init in sub modal");
		that.hide();
	};
}