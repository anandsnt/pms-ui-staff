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
		data :{	"reservation_id": reservation_id},
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

	var wakeUpTime = $('#set-wake-up-call #wakeup-time').attr('value');
	var reservation_id = getReservationId();
	var wakeUpDay = $('#set-wake-up-call #wakeup-day').text();
	var data ={	"reservation_id": reservation_id	, "wake_up_time": wakeUpTime, "day": wakeUpDay};
	console.log(data);
	$.ajax({
		type: "POST",
		url : 'wakeup/set_wakeup_calls',
		data :data,
		success : function(data) {
			if(data.status == "success"){
				removeModal();
				$("#reservation_card_wake_up_time").html(wakeUpTime);
			}
		},
		error : function() {
			alert("Sorry, not there yet!");
		}
	});
}


function onOffSwitchWakeupDate() {
    var onOffSwitch = '.switch-button#wakeupDate';

    $(onOffSwitch).each(function(){
        var onOff = $(this),
            onOffChecked = 'on',
            onOffDisabled = 'disabled',
            onOffInput = 'input[type="checkbox"]',
            text = '.value',
            textOn = onOff.attr('data-on'),
            textOff = onOff.attr('data-off');

        if (onOff.children(onOffInput).length) {
            onOff.removeClass(onOffChecked);
            onOff.find(text).text(textOff);

            onOff.children(onOffInput + ':checked').each(function(){
                onOff.addClass(onOffChecked);
                onOff.find(text).text(textOn);
            });

            onOff.children(onOffInput + ':disabled').each(function(){
                onOff.addClass.addClass(onOffDisabled);
                onOff.find(text).text('');
            });
        }
    });
};

$(document).on('click', '.switch-button#wakeupDate', function(e){
        e.stopPropagation();
        onOffSwitchWakeupDate();
    });
