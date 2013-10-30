// Show modal to add new loyalty program
$(document).on('click', '#stay-card-loyalty #wakeup-time', function(event) {
    
	event.preventDefault();
	var $href = $(this).attr('href');
	$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';
	var reservation_id = getReservationId();
	// Get modal data
	$.ajax({
		type: "POST",
		url : $href,
		data :{	"reservation_id": reservation_id	},
		success : function(data) {
			setModal();
			$('#modal').html(data);
			// renderWakeupCallData();
		},
		error : function() {
			alert("Sorry, not there yet!");
		}
	});
	
});


$(document).on('click', '#set-wake-up-call #save-wakeup-call', function(event){
	saveWakeUpCall();
});

$(document).on('change', 'select.styled#wake-up', function(e){
        e.stopImmediatePropagation();
        
        var selectedOption = $(this).find('option:selected').val();
        
        $("#set-wake-up-call #wakeup-time").html("");
        $("#set-wake-up-call #wakeup-time").html(selectedOption);
        $("#set-wake-up-call #wakeup-time").attr("value",selectedOption);
});

function saveWakeUpCall(){
	var reservation_id = getReservationId();
	var wakeUpTime = $('#set-wake-up-call #wakeup-time').text();
	var wakeUpDay = $('#set-wake-up-call #wakeup-day').text();
	var data ={	"reservation_id": reservation_id	, "wakeUpTime": wakeUpTime, "wakeUpDay": wakeUpDay};
	console.log(data);
	$.ajax({
		type: "POST",
		url : 'dashboard/wakeup_calls',
		data :data,
		success : function(data) {
			if(data.status == "success"){
				
			}
		},
		error : function() {
			alert("Sorry, not there yet!");
		}
	});
}

