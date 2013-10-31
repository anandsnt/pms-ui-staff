var ValidateCheckinModal = function() {

	BaseModal.call(this);
	var that = this;
	this.myDom = "#modal";
	this.url = "ui/validateEmailAndPhone";
	//this.url = "/guest/set-contact";
	this.delegateEvents = function() {
		console.log("sub modal delegate events");

		//Set phone number or email if already available.
		$("#validate #phone-new").val($("#gc-phone").val());
		$("#validate #email-new").val($("#gc-email").val());

		that.myDom.find('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
		that.myDom.find('#validate #save').on('click', that.submitAndGotoCheckin);
		
		
		that.myDom.find('#validate #cancel').on('click', that.ignoreAndGotoCheckin);

	};
	this.modalInit = function() {
		console.log("modal init in sub modal");

	};

	this.submitAndGotoCheckin = function() {
		var userId = $("#user_id").val();
		var guestID = $("#guest_id").val();
		alert("guestID" + guestID);
		alert("userID" + userId);
		$contactJsonObj = {};
		$contactJsonObj['guest_id'] = $("#guest_id").val();
		$contactJsonObj['user'] = {};
		$contactJsonObj['user']['contacts_attributes'] = [];
		$contact_attributes = {};
		$contact_attributes['contact_type'] = "PHONE";
		$contact_attributes['label'] = "HOME";
		$contact_attributes['value'] = $("#validate #phone-new").val();
		$contact_attributes['is_primary'] = true;
		$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
		$contact_attributes = {};
		$contact_attributes['contact_type'] = "EMAIL";
		$contact_attributes['label'] = "BUSINESS";
		$contact_attributes['value'] = $("#validate #email-new").val();
		$contact_attributes['is_primary'] = true;
		$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);

		console.log("JSON.stringify($contactJsonObj) :  " + JSON.stringify($contactJsonObj))

	     $.ajax({
				type : "PUT",
				url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
		
				async : false,
				dataType : 'json',
				contentType : 'application/json',
		
				success : function() {
	
				alert("success");
				$("#gc-phone").val($("#validate #phone-new").val());
				$("#gc-email").val($("#validate #email-new").val());
				$("#phone").val($("#validate #phone-new").val());
				$("#email").val($("#validate #email-new").val());
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