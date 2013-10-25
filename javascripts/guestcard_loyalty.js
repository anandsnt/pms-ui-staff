
// Function to render guest card loyalty
function renderGuestCardLoyalty(){
	var confirmNum = $('#guest-card #confirm_no').val();
		$.ajax({
			type: "GET",
            url: '/user_memberships?confirmno='+confirmNum,
            async: false,
            success: function(data) {    
            	$("#loyalty").html(data);
            },
            error: function(){
                console.log("There is an error!!");
            }
       });
}

// Show modal to set delete a loyalty.
$(document).on('click', '#loyalty-tab .active-item, #loyalty-tab .add-new-button', function(e) {

	e.preventDefault();
	e.stopPropagation();
	var $href = $(this).attr('href'),
     	$id = $(this).attr('loyaltyId'),
    	$type = $(this).attr('loyaltytype');
    	$action = $(this).attr('data-action');	
	$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';
	// Get modal data
	$.ajax({
		url : $href,
		// async:false,
		data : {
			id : $id,
			type: $type
		},
		success : function(data) {
			setModal();
			$('#modal').html(data);
		},
		error : function() {
			alert("Sorry, not there yet!");
		}
	}).done(function(){  
        if($action == "new-ffp"){
        	//Populate the options in airline select box for frequent flyer pgm
			addFFPSelectOptions("#new-ffp #airline-ff-list");
		}else if($action == "new-hlp"){
			//Populate the options in loyalty type select box for frequent flyer pgm 
			addHLPSelectOptions("#new-hlp #hotel-loyalty-types");
		}
    });
});

// Delete selected loyalty
$(document).on('click', "#loyalty-delete", function(event) {
	event.stopPropagation();
	var $loyalty_id = $("#loyalty_id").val();
	var $type = $("#loyalty_id").attr('name');
	console.log($loyalty_id);
	console.log($type);
	if($type == "flyer"){
		$("#loyalty-type-flyer #ff-program-" +$loyalty_id).remove();
		$("#stay-card-loyalty #loyalty option#"+$loyalty_id).remove();
	}
	else if($type == "hotel"){
		$("#loyalty-type-hotel #hl-program-" +$loyalty_id).remove();
		$("#stay-card-loyalty #loyalty option#"+$loyalty_id).remove();
	}
	
	removeModal();
	$.ajax({
		type: "DELETE",
		url: '/user_memberships/' + $loyalty_id +'.json',
		dataType: 'json',
			success: function(data) {
				console.log("Succesfully deleted loyalty primary");
			},
			error: function(){
				console.log("There is an error!!");
		}
	});
});

// Add new frequent flyer program
$(document).on('click', "#new-ffp #save", function(event) {
	event.stopPropagation();
	var $loyalty_id = $("#newffp_id").val();
	var $airline = $('#airline-ff-list option:selected').val(),
		$program = $('#airline-ff-pgms option:selected').text(),
		$code    = $("#ff-code").val(),
		$level = $('#airline-ff-pgms option:selected').val();

	if($airline == ""){
		alert("Please select an Airline");
		return false;
	}else if($level == ""){
		alert("Please select a loyalty program");
		return false;
	}else if($code == ""){
		alert("Please enter the loyalty code");
		return false;
	}

	removeModal();
	
	var $name   = $('#airline-ff-pgms option:selected').text();
		
	updateFFPLoyaltyUI($airline,$code,$program,$name);

    var userId = $('#user_id').val();
    var guestId = $('#guest_id').val();

	var newFFP = {};
	newFFP.user_id = userId;
	newFFP.guest_id = guestId;
	newFFP.user_membership = {};
	newFFP.user_membership.membership_class = "FFP"
	newFFP.user_membership.membership_type = $airline;
	newFFP.user_membership.membership_card_number = $code;
	newFFP.user_membership.membership_level = $level;

	updateServerForNewLoyalty(newFFP, function(data){
    	$loyaltyid = data.id;
		    var $new_id = "ff-program-"+$loyaltyid;
		    
		    $("#loyalty-type-flyer a.program_new").attr('id',$new_id);
		    $("#loyalty-type-flyer a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-flyer a#"+$new_id).removeClass('program_new');
		    
		    $("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
		    $("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');
		    
    }, "FFP");
});

// Add new hotel loyalty program
$(document).on('click', "#new-hlp #save", function(event) {
	event.stopPropagation();
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
		    
		    $("#loyalty-type-flyer a.program_new").attr('id',$new_id);
		    $("#loyalty-type-flyer a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-flyer a#"+$new_id).removeClass('program_new');
		    
		    $("#stay-card-loyalty #loyalty option.program_new").attr('id',$loyaltyid);
		    $("#stay-card-loyalty #loyalty option#"+$loyaltyid).removeClass('program_new');
		    
    }, "HLP");
    
});

//populate the list for loyalty values - ffp
$(document).on('change', "#new-ffp #airline-ff-list", function(event) {
	event.stopPropagation();
	$("#new-ffp #airline-ff-pgms").html("");
	$("#new-ffp #airline-ff-pgms").append('<option value="" selected="selected" class="placeholder">Select loyalty program</option>');
	var selectedAirlineType = $("#new-ffp #airline-ff-list").val();
	$.each(ffProgramsList, function(key, airline) {
		if(airline.ff_value == selectedAirlineType){
			$.each(airline.levels, function(key, value) {
				var ffOptions ='<option value="'+ value.membership_level +'">' + value.description+ '</option>'
				$("#new-ffp #airline-ff-pgms").append(ffOptions);
			});
		}
	});
});

//populate the list for loyalty values - hlp
$(document).on('change', "#new-hlp #hotel-loyalty-types", function(event) {
	event.stopPropagation();
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
});