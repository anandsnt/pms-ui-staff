$(function($){ 
	// Bill summary tabs
	$('#bills').tabs({
		console.log("billss");
		create:  function( event, ui ) {
			var $tab = ui.panel.attr('id'),
				$tabWidth = ui.panel.width(),
				$scrollable = $('#' + $tab).find('.wrapper'),
				$items = $('#' + $tab).find('.wrapper li').size(),
				$itemsWidth = ($items * 10) + 20; // * 65 is single item width, + 20 is padding

			// Set vertical if total items width is larger than tab width
			if ($itemsWidth > $tabWidth)
			{
				$('#' + $tab + '-summary').css({ 'padding-top' : '10px' });
				$($scrollable).css({ 'width' : $itemsWidth + 'px' });
				
				if (horizontalScroll) { destroyHorizontalScroll(); }
			    setTimeout(function(){
			    	createHorizontalScroll('#' + $tab + '-summary');
			    	refreshHorizontalScroll();
			    }, 600);
			}

			// Set scroller
			if (viewScroll) { destroyViewScroll(); }
		    setTimeout(function(){
		    	createViewScroll('#registration-content');
		    }, 300);
		},
		beforeActivate: function( event, ui ) {
			var $prevTab = ui.oldPanel.attr('id'),
				$nextTab = ui.newPanel.attr('id'),
		        $changeTab = new chainedAnimation(),
		        $delay = 600,
		        $tabWidth = ui.newPanel.width(),
				$scrollable = $('#' + $nextTab).find('.wrapper'),
				$items = $('#' + $nextTab).find('.wrapper li').size(),
				$itemsWidth = ($items * 65) + 20; // * 65 is single item width, + 20 is padding

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

	        // Close toggle elements in previous panel
	       	 var $activeToggle = $('#' + $prevTab).find('.toggle.active'),
	        	$openedToggleElement = $activeToggle.attr('href');

	        	$($activeToggle).removeClass('active');
	        	$($openedToggleElement).addClass('hidden');

	        // Set vertical scroller if total items width is larger than tab width
			if ($itemsWidth > $tabWidth)
			{
				$('#' + $nextTab + '-summary').css({ 'padding-top' : '10px' });
				$($scrollable).css({ 'width' : $itemsWidth + 'px' });

				if (horizontalScroll) { destroyHorizontalScroll(); }
			    setTimeout(function(){
			    	createHorizontalScroll('#' + $nextTab + '-summary');
			    	refreshHorizontalScroll();
			    }, 600);
			}

			// Set scroller
			if (viewScroll) { destroyViewScroll(); }
		    setTimeout(function(){
		    	createViewScroll('#registration-content');
		    }, 300);
		}
	});
});