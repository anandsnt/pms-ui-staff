var AddFFPModal = function(){
  	BaseModal.call(this);
  	var that = this;
  	this.url = "staff/user_memberships/new_ffp";
  	this.delegateEvents = function(){
		
		that.myDom.find('#new-ffp #save').on('click', that.addFFP);
		that.myDom.find('#airline-ff-list').on('change', that.airlineChanged);
		addFFPSelectOptions("#new-ffp #airline-ff-list");
	};
	this.modalInit = function(){
   };
	this.addFFP = function(event){
        event.preventDefault();
		event.stopImmediatePropagation();
		var $loyalty_id = $("#newffp_id").val();
		var $airline = $('#airline-ff-list option:selected').val(),
		$program = $('#airline-ff-pgms option:selected').text(),
		$code    = $("#ff-code").val(),
		$level = $('#airline-ff-pgms option:selected').val();

		// REMOVING CLIENT SIDE VALIDATION FOR MEMBERSHIPS
		// if($airline == ""){
		// 	alert("Please select an Airline");
		// 	return false;
		// }else if($level == ""){
		// 	alert("Please select a loyalty program");
		// 	return false;
		// }else if($code == ""){
		// 	alert("Please enter the loyalty code");
		// 	return false;
		// }

		var $name   = $('#airline-ff-pgms option:selected').text();
		
	    var userId = $('#user_id').val();
	    var guestId = $('#guest_id').val();

		var newFFP = {};
		newFFP.user_id = userId;
		newFFP.guest_id = guestId;
		newFFP.user_membership = {};
		newFFP.user_membership.membership_class = "FFP";
		newFFP.user_membership.membership_type = $airline;
		newFFP.user_membership.membership_card_number = $code;
		// newFFP.user_membership.membership_level = $level;

		updateServerForNewLoyalty(newFFP, function(data){
			updateFFPLoyaltyUI($airline,$code,$program,$name);
		    that.hide();
			
	    	$loyaltyid = data.id;
			var $new_id = "ff-program-"+$loyaltyid;
			    
			$("#loyalty-ffp a.program_new").attr('id',$new_id);
			$("#loyalty-ffp a.program_new").attr('loyaltyid',$loyaltyid);
			$("#loyalty-ffp a#"+$new_id).removeClass('program_new');
			    
			$("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
			$("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');			
	    }, "FFP");	    
   };
  
    this.airlineChanged = function(event){
        event.preventDefault();
		event.stopImmediatePropagation();
		$("#new-ffp #airline-ff-pgms").html("");
		$("#new-ffp #airline-ff-pgms").append('<option value="" selected="selected" class="placeholder">Select loyalty program</option>');
		var selectedAirlineType = $("#new-ffp #airline-ff-list").val();
		$.each(ffProgramsList.data, function(key, airline) {
			if(airline.ff_value == selectedAirlineType){
				$.each(airline.levels, function(key, value) {
					var ffOptions ='<option value="'+ value.membership_level +'">' + value.description+ '</option>';
					$("#new-ffp #airline-ff-pgms").append(ffOptions);
				});
			}
		});
    };
  
};