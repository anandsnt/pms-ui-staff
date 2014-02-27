$(function($){ 
	// Bill summary tabs
	$("#bills").tabs({
		console.log("billss");
		create:  function( event, ui ) {
			var $tab = ui.panel.attr("id"),
				$scrollable = $("#" + $tab).find(".wrapper"),
				$itemsWidth = 0;

			// Set wrapper width for horizontal scroll
			$("#" + $tab).find(".wrapper li").each(function() {
			    $itemsWidth += $(this).outerWidth(true);
			});
			$($scrollable).css("width", $itemsWidth + 5);

			// Set scroller
			createVerticalScroll("#registration-content");
			createHorizontalScroll("#" + $tab + "-summary");
		},
		beforeActivate: function( event, ui ) {
			var $prevTab = ui.oldPanel.attr("id"),
				$nextTab = ui.newPanel.attr("id"),
		        $changeTab = new chainedAnimation(),
		        $delay = 600,
		        $tabWidth = ui.newPanel.width(),
				$scrollable = $("#" + $nextTab).find(".wrapper"),
				$itemsWidth = 0;

			// Bring in new tab
	        $changeTab.add(function(){  
	            $("#" + $nextTab).removeAttr("style").addClass("loading");
	            $("#" + $prevTab).removeAttr("style").addClass("set-back");
	        });

	        // Show/hide
	        $changeTab.add(function(){ 
	            $("#" + $nextTab).show(); 
	            $("#" + $prevTab).hide();
	        }, $delay);

	        // Clear transition classes
	        $changeTab.add(function(){ 
	            $("#" + $nextTab).removeClass("loading"); 
	            $("#" + $prevTab).removeClass("set-back");
	        });

	        $changeTab.start();

	        // Close toggle elements in previous panel
	       	 var $activeToggle = $("#" + $prevTab).find(".toggle.active"),
	        	$openedToggleElement = $activeToggle.attr("href");

	        	$($activeToggle).removeClass("active");
	        	$($openedToggleElement).addClass("hidden");

	        // Set scroller
			createVerticalScroll("#registration-content");
			if($nextTab)
			{
				createHorizontalScroll("#" + $nextTab + "-summary");
			}
		}
	});
});