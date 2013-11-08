var ValidateCheckinModal = function() {

	BaseModal.call(this);
	var that = this;
	this.myDom = "#modal";
	this.url = "ui/validateEmailAndPhone";
	//this.url = "/guest/set-contact";
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
		console.log("modal init in sub modal");
	};
	this.submitAndGotoCheckin = function() {
		var userId = $("#user_id").val();
		var guestID = $("#guest_id").val();
		$contactJsonObj = {};
		$contactJsonObj['guest_id'] = $("#guest_id").val();
		$contactJsonObj['user'] = {};
		$contactJsonObj['user']['contacts_attributes'] = [];
		
		if(that.modalType == "NoPhone"){
			
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "PHONE";
			$contact_attributes['label'] = "HOME";
			$contact_attributes['value'] = $("#validate #guest-phone").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
		}
		else if(that.modalType == "NoEmail"){
			
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "EMAIL";
			$contact_attributes['label'] = "BUSINESS";
			$contact_attributes['value'] = $("#validate #guest-email").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
		}
		else if(that.modalType == "NoPhoneNoEmail"){
			
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "PHONE";
			$contact_attributes['label'] = "HOME";
			$contact_attributes['value'] = $("#validate #guest-phone").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
			
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "EMAIL";
			$contact_attributes['label'] = "BUSINESS";
			$contact_attributes['value'] = $("#validate #guest-email").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
		}

		console.log("JSON.stringify($contactJsonObj) :  " + JSON.stringify($contactJsonObj))

	     $.ajax({
				type : "PUT",
				url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
		
				async : false,
				dataType : 'json',
				contentType : 'application/json',
		
				success : function() {
					
					if($("#gc-phone").val == ""){
						$("#gc-phone").val($("#validate #guest-phone").val());
						$("#phone").val($("#validate #guest-phone").val());
					}
					if($("#gc-email").val ==""){
						$("#gc-email").val($("#validate #guest-email").val());
						$("#email").val($("#validate #guest-email").val());
					}
					removeModal();
				},
				error : function() {
					console.log("There is an error!!");
				}
		});
		that.hide();
	};

	this.ignoreAndGotoCheckin = function() {
		console.log("modal init in sub modal");
		that.hide();
	};
}