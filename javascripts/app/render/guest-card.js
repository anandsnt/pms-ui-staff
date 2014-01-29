function resizableGuestCard($maxHeight){
	$('#guest-card').resizable({
		minHeight: 		'90',
		maxHeight: 		($maxHeight-90), // 90 is height of the guest card visible part
		handles: 		's',
		resize: function( event, ui ) {
			if ($(this).height() > 120) {
				$('#guest-card').addClass('open');
			}
			else {
				$('#guest-card').removeClass('open');
			}
		},
	    stop: function(event, ui) {
	    	// Refresh scrollers
	    	setTimeout(function(){
		    	refreshGuestCardScroll();
		    }, 300);
	   	}
	});
}

var setUpGuestcard = function(viewDom) {

	// Resizable guest card when not on tablet
	var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null,
		$maxHeight = $(window).height(),
		$breakpoint = ($maxHeight/2);

	if (!$isTablet) {
		$(window).resize(function() {
	    	$maxHeight = $(window).height();

	    	// Resize guest card if too big
	    	if ($('#guest-card').hasClass('open') && $('#guest-card').height() > ($maxHeight-90))
	    	{
	    		$('#guest-card').css({'height':$maxHeight-90+'px'});
	    	}

	    	// Close guest card if too small
	    	if ($('#guest-card').height() < 90)
	    	{
	    		$('#guest-card').removeClass('open').css({'height':90+'px'});
	    	}

	    	resizableGuestCard($maxHeight);
		});
	}

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

			if ('cc-payment' === $nextTab) {
				sntapp.cardSwipeCurrView = 'GuestCardView';
			} else {
				sntapp.cardSwipeCurrView = '';
			}

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
	viewDom.find($('#guest-birthday')).datepicker({
        showOn      : 'button',
        dateFormat  : 'mm-dd-yy',
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
    resizableGuestCard($maxHeight);

	// Show/hide guest card on click
	$(document).on('click', '#guest-card .ui-resizable-handle', function() {

		// Show if hidden or open in less than 50% of screen height
		if ($('#guest-card').height() == '90' || $('#guest-card').height() < $breakpoint) {
			$('#guest-card').addClass('open').animate({height: ($maxHeight-90)}, 300);

			sntapp.cardSwipePrevView = sntapp.cardSwipeCurrView;
			sntapp.cardSwipeCurrView = $('#cc-payment:visible').length ? 'GuestCardView' : '';
		}
		// Hide if open or shown in more than 50% of screen height
		else {
			$('#guest-card').animate({height: '90px'}, 300, function(){
    			$(this).removeClass('open');
			});

			sntapp.cardSwipeCurrView = sntapp.cardSwipePrevView;
		}

		// Refresh scrollers
		setTimeout(function() {
			refreshGuestCardScroll();
		}, 300);
	});
};