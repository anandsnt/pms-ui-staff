$(function($) {

	// Resizable guest card variables
	var $maxHeight = $(window).height(), $breakpoint = ($maxHeight / 2), $cardHeight = '90px';
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
});
