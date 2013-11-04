var setUpGuestcard = function(viewDom) {

	// Resizable guest card variables
	var $maxHeight = $(window).height(), $breakpoint = ($maxHeight / 2), $cardHeight = '90px';
	$(window).resize(function() { $maxHeight = $(window).height(); });

	// Hide guest card content until it's resized
	viewDom.find($('#guest-card-header .switch-button, #guest-card-content')).hide();

	// Guest card tabs
	viewDom.find($('#guest-card-content')).tabs({
		create : function(event, ui) {
			var $tab = ui.panel.attr('id');

			// Set scroller
			if (guestCardScroll) {
				destroyGuestCardScroll();
			}
			setTimeout(function() {
				createGuestCardScroll('#' + $tab);
				refreshGuestCardScroll();
			}, 300);

		},
		beforeActivate : function(event, ui) {
			var $nextTab = ui.newPanel.attr('id');

			// Reset scroller
			if (guestCardScroll) {
				destroyGuestCardScroll();
			}
			setTimeout(function() {
				createGuestCardScroll('#' + $nextTab);
			}, 300);

		}
	});

	// Birthday datepicker
	viewDom.find($('#birthday')).datepicker({
        showOn      : 'button',
        dateFormat  : 'mm-dd-y',
        changeMonth : true,
        changeYear  : true,
        maxDate   	: '+0D +0M +0Y',
        yearRange   : '-99:+0',
        monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        beforeShow: function(input, inst){
            // Insert overlay
            $('<div id="ui-datepicker-overlay" />').insertAfter('#ui-datepicker-div');
        },
        onClose: function(dateText, inst){ 
            $('#ui-datepicker-overlay').remove();
        }
    });

    // Resize guest card
	$('#guest-card').resizable({
		minHeight : '90',
		maxHeight : ($maxHeight - 90), // 90 is height of the guest card visible part
		handles : 's',
		resize : function(event, ui) {
			if ($(this).height() > 120) {
				$('#guest-card-header .switch-button, #guest-card-content').show();
			} else {
				$('#guest-card-header .switch-button, #guest-card-content').hide();
			}
		},
		stop : function(event, ui) {
			$cardHeight = $(this).css('height');
			// Refresh scrollers

			// setTimeout(function() {
				// callFunctions();
			// }, 300);

		}
	});

	// Show/hide guest card on click
	$(document).on('click', '#guest-card .ui-resizable-handle', function() {

		// Show if hidden or open in less than 50% of screen height
		if ($('#guest-card').height() == '90' || $('#guest-card').height() < $breakpoint) {
			$('#guest-card').animate({
				height : ($maxHeight - 90)
			}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').show();
		}
		// Hide if open or shown in more than 50% of screen height
		else {
			$('#guest-card').animate({
				height : '90px'
			}, 300);
			$('#guest-card-header .switch-button, #guest-card-content').hide();
		}

		// Refresh scrollers
		setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
	});
};