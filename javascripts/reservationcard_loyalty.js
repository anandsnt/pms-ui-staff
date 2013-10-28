
// Show modal to add new loyalty program
$(document).on('click', '#stay-card-loyalty .add-new-button', function(event) {

	event.preventDefault();
	event.stopImmediatePropagation();
	var $href = $(this).attr('href');
     		
	$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';
	// Get modal data
	$.ajax({
		url : $href,
		success : function(data) {
			setModal();
			$('#modal').html(data);
		},
		error : function() {
			alert("Sorry, not there yet!");
		}
	});
});

// Add new frequent flyer program
$(document).on('click', "#new-loyalty-program #save", function(event) {
	event.preventDefault();
	event.stopImmediatePropagation();
	var $program= $('#new-loyalty-program #program').val();
		$type 	= $('#new-loyalty-program #type').val();
		$name 	= $('#new-loyalty-program #type option:selected').text();
		$level 	= $('#new-loyalty-program #level').val();
		$code   = $("#new-loyalty-program #code").val();
		
	// Validate fields
	if($program == ""){
		alert("Please select a loyalty program");
		return false;
	}else if($type == ""){
		alert("Please select a loyalty type");
		return false;
	}else if($level == ""){
		alert("Please enter the loyalty level");
		return false;
	}else if($code == ""){
		alert("Please enter the loyalty code");
		return false;
	}else if($code.length < 4){
		alert("Please enter 4 digit loyalty code");
		return false;
	}
		
	var userId = $('#user_id').val();
	var confirmNum = $('#confirm_no').val();
	
	var newLoyalty = {};
	
	newLoyalty.user_id = userId;
	newLoyalty.confirmno = confirmNum;
	newLoyalty.user_membership = {};
	newLoyalty.user_membership.membership_type = $type;
	newLoyalty.user_membership.membership_card_number = $code;
	newLoyalty.user_membership.membership_level = $level;
	
	if($program == "ffp"){
		newLoyalty.user_membership.membership_class = "FFP";
		
		updateFFPLoyaltyUI($type,$code,$level,$name);
		
		updateServerForNewLoyalty(newLoyalty, function(data){
    		$loyaltyid = data.id;
		    var $new_id = "ff-program-"+$loyaltyid;
		    
		    $("#loyalty-type-flyer a.program_new").attr('id',$new_id);
		    $("#loyalty-type-flyer a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-flyer a#"+$new_id).removeClass('program_new');
		    
		    $("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
		    $("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');
		    
    	}, "FFP");
	}
	else if($program == "hlp"){
		newLoyalty.user_membership.membership_class = "HLP";
		updateHLPLoyaltyUI($type,$code,$level,$name);
		
		updateServerForNewLoyalty(newLoyalty, function(data){
    		$loyaltyid = data.id;
		    var $new_id = "hl-program-"+$loyaltyid;
		    
		    $("#loyalty-type-flyer a.program_new").attr('id',$new_id);
		    $("#loyalty-type-flyer a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-flyer a#"+$new_id).removeClass('program_new');
		    
		    $("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
		    $("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');
		    
    	}, "HLP");
	}
	updateSelectionUI($code,$type);
	removeModal();
});

//populate the list for loyalty type on change in program list
$(document).on('change', "#new-loyalty-program #program", function(event) {
	
	event.preventDefault();
	event.stopImmediatePropagation();
	$("#new-loyalty-program #type").html("");
	$("#new-loyalty-program #type").append('<option value="" selected="selected" class="placeholder">Select Loyalty Type</option>');
	
	$("#new-loyalty-program #level").html("");
	$("#new-loyalty-program #level").append('<option value="" selected="selected" class="placeholder">Select Loyalty Level</option>');
	
	$selectedLoyaltyProgram = $("#new-loyalty-program #program").val();
	
	if($selectedLoyaltyProgram == "ffp"){
    	//Populate the options in airline select box for frequent flyer pgm
		addFFPSelectOptions("#new-loyalty-program #type");	// TODO function is in guestcard_loyalty.js 
	}else if($selectedLoyaltyProgram == "hlp"){
		//Populate the options in loyalty type select box for hotel loyalty pgm 
		addHLPSelectOptions("#new-loyalty-program #type");	// TODO function is in guestcard_loyalty.js
	}
	
});

//populate the list for Level on change in type list
$(document).on('change', "#new-loyalty-program #type", function(event) {
	
	event.preventDefault();
	event.stopImmediatePropagation();
	$("#new-loyalty-program #level").html("");
	$("#new-loyalty-program #level").append('<option value="" selected="selected" class="placeholder">Select Loyalty Level</option>');
	$selectedLoyaltyType = $("#new-loyalty-program #type").val();
	
	if($selectedLoyaltyProgram == "ffp"){
    	$.each(ffProgramsList, function(key, airline) {
			if(airline.ff_value == $selectedLoyaltyType){
				$.each(airline.levels, function(key, value) {
					var ffOptions ='<option value="'+ value.membership_level +'">' + value.description+ '</option>'
					$("#new-loyalty-program #level").append(ffOptions);
				});
			}
		});
	}else if($selectedLoyaltyProgram == "hlp"){
		$.each(hlProgramsList, function(key, loyaltyPgm) {
			if(loyaltyPgm.hl_value == $selectedLoyaltyType){
				$.each(loyaltyPgm.levels, function(key, value) {
					var hlOptions ='<option value="'+ value.membership_level +'">' + value.description+ '</option>'
					$("#new-loyalty-program #level").append(hlOptions);
				});
			}
		});
	}
});

$(document).on('change', 'select.styled', function(event){
	
    var selectedOption = $(this).find('option:selected');
    var id = $(this).find('option:selected').attr('id');
    var confirmNum = $('#confirm_no').val();
    
    if(id==""){
    	clearSelectionUI();
    }
    else{
    	resetSelectionUI();
    }
    $.ajax({
		type: "POST",
		url: '/user_memberships/link_to_reservation',
		data : {
		    "confirmno": confirmNum,
		    "membership_id": id
		},
		success: function(data) {
			console.log("Succesfully changed loyalty primary");
		},
		error: function(){
			console.log("There is an error!!");
		}
	});
});
    

    