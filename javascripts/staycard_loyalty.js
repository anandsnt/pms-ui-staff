$(function() {
	ffProgramsList = [];
	hlProgramsList = [];
  	var $url_ffp = '/user_memberships/get_available_ffps.json';
		$url_hlp = '/user_memberships/get_available_hlps.json';
				
	fetchLoyaltyProgramData($url_ffp,'ffp');
	fetchLoyaltyProgramData($url_hlp,'hlp');
});


//utility method to fetch the ffp or hlp list
function fetchLoyaltyProgramData(url,type){
	$.ajax({
		url : url,
		type : 'GET',
		success : function(data) {
			if(type == 'ffp'){
				ffProgramsList = data;
			}
			else if(type == 'hlp'){
				hlProgramsList = data;
			}
			console.log(data);
		},
		error : function() {
			console.log("error");
		}
	});
}

// Show modal to add new loyalty program
$(document).on('click', '#stay-card-loyalty .add-new-button', function(e) {

	e.preventDefault();
	e.stopPropagation();
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
$(document).on('click', "#new-loyalty-program #save", function() {
	
	var $program= $('#new-loyalty-program #program').val();
		$type 	= $('#new-loyalty-program #type').val();
		$name 	= $('#new-loyalty-program #type option:selected').text();
		$level 	= $('#new-loyalty-program #level').val();
		$code   = $("#new-loyalty-program #code").val();
		
		$number = $code.slice(-4); // Get last 4 digits of code.
		$value  = ($type).toLowerCase()+"-"+$number;
		
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
	}	
	
		
	var userId = $('#user_id').val();	
	var confirmNum = $('#guest-card #reservation_id').val();
	
	var newLoyalty = {};
	newLoyalty.user_id = userId;
	newLoyalty.confirmno = confirmNum;
	newLoyalty.user_membership = {};
	newLoyalty.user_membership.membership_type = $type;
	newLoyalty.user_membership.membership_card_number = $code;
	newLoyalty.user_membership.membership_level = $level;
	
	var html = '<option selected="selected" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	
	if($program == "ffp"){
		newLoyalty.user_membership.membership_class = "FFP";
		updateFFPLoyaltyUI($type,$code,$level,$value,$number,$name);
		//$("#stay-card-loyalty #loyalty optgroup").last().before(html);
	}
	else if($program == "hlp"){
		newLoyalty.user_membership.membership_class = "HLP";
		updateHLPLoyaltyUI($type,$code,$level,$value,$number,$name);
		//$("#stay-card-loyalty #loyalty").append(html);
	}
	$('select#loyalty.styled').trigger('change');
	
	removeModal();
	console.log("Add new requent flyer program API call");
	console.log(newLoyalty);
	
});
var $selectedLoyaltyProgram ="";
//populate the list for loyalty type on change in program list
$(document).on('change', "#new-loyalty-program #program", function(event) {
	
	event.stopPropagation();
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
var $selectedLoyaltyType ="";
//populate the list for Level on change in type list
$(document).on('change', "#new-loyalty-program #type", function(event) {
	
	event.stopPropagation();
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

function updateHLPLoyaltyUI($type,$code,$level,$value,$number,$name){
	
	var $html = "<a loyaltytype='hotel' loyaltyid='' id='' href='user_memberships/delete_membership' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$level+"</span></a>";
      
    $("#loyalty-type-hotel .add-new-button").before($html);
    
    var html_for_staycard = '<option selected="selected" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty").append(html_for_staycard);
	$('select#loyalty.styled').trigger('change');
	
}


function updateFFPLoyaltyUI($type,$code,$program,$value,$number,$name){
	
	var $html = "<a loyaltytype='flyer' loyaltyid='' id=''+ href='user_memberships/delete_membership' class='active-item item-loyalty float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$program+"</span></a>";
      
    $("#loyalty-type-flyer .add-new-button").before($html);
    
    var html_for_staycard = '<option selected="selected" value="'+$value+'" data-type="ffp" data-primary="true" data-number="'+$number+'" data-name="'+$name+'" data-code="'+$type+'">'+$type+' '+$code+'</option>';
	$("#stay-card-loyalty #loyalty optgroup").last().before(html_for_staycard);
	$('select#loyalty.styled').trigger('change');
	
}

