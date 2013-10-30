// Show modal to add new loyalty program
$(document).on('click', '#stay-card-loyalty #wakeup-time', function(event) {
    
	event.preventDefault();
	var $href = $(this).attr('href');
	$modal = '<div id="modal" role="dialog" />', $overlay = '<div id="modal-overlay" />';
	var confirmNum = $('#confirm_no').val();
	// Get modal data
	$.ajax({
		type: "POST",
		url : $href,
		data :{	"confirmno": confirmNum	},
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
	var confirmNum = $('#confirm_no').val();
	var wakeUpTime = $('#set-wake-up-call #wakeup-time').attr('value');
	var wakeUpDay = $('#set-wake-up-call #wakeup-day').text();
	var data ={	"confirmno": confirmNum	, "wakeUpTime": wakeUpTime, "wakeUpDay": wakeUpDay};
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