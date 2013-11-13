var AddKeysModal = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "http://localhost:3000/ui/show?haml_file=modals/addKeys&json_input=keys/keys_render.json&is_hash_map=true&is_partial=false";
	this.delegateEvents = function() {		
		// that.myDom.find('#validate #submit').on('click', that.submitAndGotoCheckin);
		
		that.myDom.find('.radio').on('click', function(){			
			that.myDom.find($("#key_print_new,#key_print_additional")).removeClass("is-disabled");
		});
		that.myDom.find('#key_print_new').on('click', that.printNewKey);
		var guestEmail = $("#change-name #gc-email").val();
		// var guestPhone = $("#change-name #gc-phone").val();
		if(guestEmail =="")
		{
			$(".print_key_missing").show();
		} else {
			$(".print_key_missing").hide();
			that.myDom.find($("#key-guest-email").val(guestEmail));
			var keyEmailElement = $("#key-guest-email").length;
			if(keyEmailElement>0){
				that.myDom.find($("#print-keys")).removeClass("is-disabled");
			}				
		}	
	};
	this.modalInit = function() {
		
	};
	this.printNewKey = function(){
		var reservation_id = getReservationId();
		var keyEmailElement = $("#key-guest-email").length;
		if(keyEmailElement>0){
			key_guest_email = that.myDom.find($("#key-guest-email").val());
		}else{
			key_guest_email = $("#change-name #gc-email").val();
		}
	    selected_key = $('input:radio[name="keys"]:checked').val();
		$.ajax({
			type : "PUT",
			url : '',
			data : {
					"reservation_id": reservation_id,
				    "email": key_guest_email,
				    "key": selected_key
				    },	
			async : false,
			dataType : 'json',
			contentType : 'application/json',	
			success : function() {
				if (data.status == "success") {
				    $("#change-name #gc-email").val(key_guest_email);
				}				
			},
			error : function() {
				console.log("There is an error!!");
			}
		});
	};

	
};