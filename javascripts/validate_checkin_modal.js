var ValidateCheckinModal = function(){
	
  	BaseModal.call(this);
  	var that = this;
  	this.myDom = "#modal";
  	this.url = "ui/validateEmailAndPhone";
  	this.delegateEvents = function(){
  		console.log("sub modal delegate events");
    	$('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
   		$('#validate #save').on('click', that.submitAndGotoCheckin);
		$('#validate #cancel').on('click', that.ignoreAndGotoCheckin);
	};
	this.modalInit = function(){
        console.log("modal init in sub modal");
    };
    this.show{
    	alert("hai");
    }
    this.submitAndGotoCheckin = function(){
    	var userId = $("#user_id").val();
    	var guestId = $('#guest_id').val();
    	console.log("guestId"+guestId);
			$contactJsonObj = {};
			$contactJsonObj['guest_id'] = $("#guest_id").val();
			$contactJsonObj['user'] = {};			
			$contactJsonObj['user']['contacts_attributes'] = [];
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "PHONE";
			$contact_attributes['label'] = "HOME";
			$contact_attributes['value'] = $("#validate #phone").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
			$contact_attributes = {};
			$contact_attributes['contact_type'] = "EMAIL";
			$contact_attributes['label'] = "BUSINESS";
			$contact_attributes['value'] = $("#validate #email").val();
			$contact_attributes['is_primary'] = true;
			$contactJsonObj['user']['contacts_attributes'].push($contact_attributes);
			
			$.ajax({
		      	type : 'POST',
		      	url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
				
				async : false,
				dataType : 'json',
				contentType : 'application/json',
		      	success : function(data) {
		          	$("#gc-phone").val($("#validate #phone").val());
				    $("#gc-email").val($("#validate #email").val());
				    removeModal();
		      	},
		      	error : function() {
		      	    console.log("There is an error!!");
		      	}
  	     });
		that.hide();	
    };

    this.ignoreAndGotoCheckin = function(){
        console.log("modal init in sub modal");
        that.hide();
    };
}