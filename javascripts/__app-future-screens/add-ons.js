$(function($){ 
	// Bill summary tabs
	$('#addon-items').tabs({
		create:  function( event, ui ) {
			// Set scroller
			if (viewScroll) { destroyViewScroll(); }
		    setTimeout(function(){
		    	createViewScroll('#addons-content');
		    }, 300);
		},
		beforeActivate: function( event, ui ) {
		    var $prevTab = ui.oldPanel.attr('id'),
				$nextTab = ui.newPanel.attr('id'),
		        $changeTab = new chainedAnimation(),
		        $delay = 600;
		        
			// Bring in new tab
	        $changeTab.add(function(){  
	            $('#' + $nextTab).removeAttr('style').addClass('loading');
	            $('#' + $prevTab).removeAttr('style').addClass('set-back');
	        });

	        // Show/hide
	        $changeTab.add(function(){ 
	            $('#' + $nextTab).show(); 
	            $('#' + $prevTab).hide();
	        }, $delay);

	        // Clear transition classes
	        $changeTab.add(function(){ 
	            $('#' + $nextTab).removeClass('loading'); 
	            $('#' + $prevTab).removeClass('set-back');
	        });

	        $changeTab.start();

	        // Reset scroller
	        if (viewScroll) { destroyViewScroll(); }
		    setTimeout(function(){
		    	createViewScroll('#addons-content');
		    }, 300);
	    }
	});

	// Delivery date datepicker
	$('#delivery-date').datepicker({
        showOn      : 'button',
        dateFormat  : 'mm-dd-y',
        minDate		: 0,
        maxDate   	: '+0D +1M +0Y',
        monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        beforeShow: function(input, inst){
            // Insert overlay
            $('<div id="ui-datepicker-overlay" />').insertAfter('#ui-datepicker-div');
        },
        onClose: function(dateText, inst){ 
            $('#ui-datepicker-overlay').remove();
        }
    });

	// TODO - fire this when item is added, not just on click
    // Add to cart feedback
    $(document).on('click', '.button.add-to-cart', function(e){
        e.stopImmediatePropagation();

        modalInit('modals/alerts/added-to-cart/', 750);
    });

    // TODO - fire this when purchase is made, not just on click
    // Add to cart feedback
    $(document).on('click', '.button.confirm-purchase', function(e){
        e.stopImmediatePropagation();

        modalInit('modals/alerts/purchase-confirmation/', 750);
    });
});