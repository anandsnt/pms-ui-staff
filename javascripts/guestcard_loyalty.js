
// Function to render guest card loyalty
function renderGuestCardLoyalty(){
		$.ajax({
			type: "GET",
            url: '/dashboard/loyalty',
            async: false,
            success: function(data) {    
            	$("#loyalty").html(data);
            },
            error: function(){
                console.log("There is an error!!");
            }
       });
}

// Show modal to set loyalty as primary or to delete it.
$(document).on('click', '#loyalty-tab .active-item, #loyalty-tab .add-new-button', function(e) {

	e.preventDefault();
	var $href = $(this).attr('href'),
     	$id = $(this).attr('loyaltyId'),
    	$type = $(this).attr('loyaltyType');
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
	});
	
});


// Delete selected loyalty
$(document).on('click', "#loyalty-delete", function() {
	
	var $loyalty_id = $("#loyalty_id").val();
	var $type = $("#loyalty_id").attr('name');
	console.log($loyalty_id);
	console.log($type);
	if($type == "flyer"){
		$("#loyalty-type-flyer #ff-program-" +$loyalty_id).remove();
	}
	else if($type == "hotel"){
		$("#loyalty-type-hotel #hl-program-" +$loyalty_id).remove();
	}
	
	removeModal();
	console.log("Delete primary API call");
	// $.ajax({
		// type: "POST",
		// url: '/dashboard/deleteCreditCard',
		// data: {id: $loyalty_id},
		// dataType: 'json',
		// success: function(data) {
			// console.log("Succesfully deleted loyalty primary");
		// },
		// error: function(){
			// console.log("There is an error!!");
		// }
	// });
});

// Add new frequent flyer program
$(document).on('click', "#new-ffp #save", function() {
	
	var $loyalty_id = $("#newffp_id").val();
	
	var $airline = $('#new-ffp-airline').val();
		$program = $('#new-ffp-program').val();
		$code    = $("#code").val();
		
	var $data = {
            code: $program,
            number: $code,
            name: $airline
    };
    
	//console.log("$airline"+$airline+"$program"+$program+"$code"+$code);
	removeModal();
	
	var $html = "<a loyaltytype='flyer' loyaltyid='' id=''+ href='dashboard/loyaltySelectPrimary' class='active-item item-loyalty primary float program_new'>"+
      "<span class='value code'>"+$program+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$airline+"</span></a>";
      
    $("#loyalty-type-flyer .add-new-button").before($html);
    
	console.log("Add new requent flyer program API call");
	console.log($data);
	// $.ajax({
		// type: "POST",
		// url: '/dashboard/AddNewFrequentFlyerProgram',
		// data: {id: $loyalty_id},
		// dataType: 'json',
		// success: function(data) {
			//$loyaltyid=data.id;
			// console.log("Succesfully saved new frequent flyer program");
			
			var $loyaltyid = 1456; //This id will be get as a response of API call
		    var $new_id = "program"+$loyaltyid;
		    
		    $("#loyalty-type-flyer a.program_new").attr('id',$new_id);
		    $("#loyalty-type-flyer a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-flyer a#"+$new_id).removeClass('program_new');
		    
		// },
		// error: function(){
			// console.log("There is an error!!");
		// }
	// });
	
});

// Add new hotel loyalty program
$(document).on('click', "#new-hlp #save", function() {
	
	var $loyalty_id = $("#newhlp_id").val();
	
	var $type = $('#new-hlp-type').val();
		$level= $('#new-hlp-level').val();
		$code = $("#code").val();
		
	var $data = {
            code: $type,
            number: $code,
            name : $level
    };
	//console.log("$type"+$type+"$level"+$level+"$code"+$code);
	removeModal();
	
	
	var $html = "<a loyaltytype='hotel' loyaltyid='' id='' href='dashboard/loyaltySelectPrimary' class='active-item item-loyalty primary float program_new'>"+
      "<span class='value code'>"+$type+"</span>"+
      "<span class='value number'>"+$code+"</span>"+
      "<span class='value name'>"+$level+"</span></a>";
      
    $("#loyalty-type-hotel .add-new-button").before($html);
    
	console.log("Add new hotel loyalty program API call");
	console.log($data);
	// $.ajax({
		// type: "POST",
		// url: '/dashboard/AddNewHotelLoyaltyProgram',
		// data: $data,
		// dataType: 'json',
		// success: function(data) {
			//$loyaltyid=data.id;
			// console.log("Succesfully saved new hotel loyalty program");
			
			var $loyaltyid = 14567; //This id will be get as a response of API call
		    var $new_id = "program"+$loyaltyid;
		    
		    $("#loyalty-type-hotel a.program_new").attr('id',$new_id);
		    $("#loyalty-type-hotel a.program_new").attr('loyaltyid',$loyaltyid);
		    $("#loyalty-type-hotel a#"+$new_id).removeClass('program_new');
			
		// },
		// error: function(){
			// console.log("There is an error!!");
		// }
	// });
    
});
