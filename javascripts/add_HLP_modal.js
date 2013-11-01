var AddHLPModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "staff/user_memberships/new_hlp";
  	this.delegateEvents = function(){
  		that.myDom.find('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
		that.myDom.find('#new-hlp #save').on('click', that.addHLP);
		that.myDom.find('#hotel-loyalty-types').on('change', that.typeChanged);
		addHLPSelectOptions("#new-hlp #hotel-loyalty-types");
	}
	this.modalInit = function(){
        console.log("modal init in sub modal")
    }
	this.addHLP = function(event){
        event.preventDefault();
		event.stopImmediatePropagation();
		var $loyalty_id = $("#newhlp_id").val();

		var $type = $('#hotel-loyalty-types option:selected').val(),
			$level= $('#hotel-loyalty-levels option:selected').text(),
			$code = $("#hl-code").val();
			$level = $('#hotel-loyalty-levels option:selected').val();

		if($type == ""){
			alert("Please select loyalty type");
			return false;
		}else if($level == ""){
			alert("Please select a loyalty level");
			return false;
		}else if($code == ""){
			alert("Please enter the loyalty code");
			return false;
		}

		var userId = $('#user_id').val();
	    var guestId = $('#guest_id').val();
			
		var newHLP = {};
		newHLP.user_id = userId;
		newHLP.guest_id = guestId;
		newHLP.user_membership = {};
		newHLP.user_membership.membership_class = "HLP"
		newHLP.user_membership.membership_type = $type;
		newHLP.user_membership.membership_card_number = $code;
		newHLP.user_membership.membership_level = $level;
		removeModal();
		
		var $name   = $('#hotel-loyalty-levels option:selected').text();
		
		updateHLPLoyaltyUI($type,$code,$level,$name);
		
	    updateServerForNewLoyalty(newHLP, function(data){
	    	$loyaltyid = data.id;
			    var $new_id = "hl-program-"+$loyaltyid;
			    
			    $("#loyalty-hlp a.program_new").attr('id',$new_id);
			    $("#loyalty-hlp a.program_new").attr('loyaltyid',$loyaltyid);
			    $("#loyalty-hlp a#"+$new_id).removeClass('program_new');
			    
			    $("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
			    $("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');
	    }, "HLP");
	    that.hide();
    }
  	this.typeChanged = function(event){
        event.preventDefault();
		event.stopImmediatePropagation();
		$("#new-hlp #hotel-loyalty-levels").html("");
		$("#new-hlp #hotel-loyalty-levels").append('<option value="" selected="selected" class="placeholder">Select level</option>');
		var selectedLoyaltyPgm = $("#new-hlp #hotel-loyalty-types").val();
		$.each(hlProgramsList, function(key, loyaltyPgm) {
			if(loyaltyPgm.hl_value == selectedLoyaltyPgm){
				$.each(loyaltyPgm.levels, function(key, value) {
					var hlOptions ='<option value="'+ value.membership_level +'">' + value.description+ '</option>'
					$("#new-hlp #hotel-loyalty-levels").append(hlOptions);
				});
			}
		});
    }
}