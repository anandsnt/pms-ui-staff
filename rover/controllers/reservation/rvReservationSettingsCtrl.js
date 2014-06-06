sntRover.controller('RVReservationSettingsCtrl', ['$scope', function($scope){
    
    $scope.reservationSettingsVisible = false;
    /**
	* scroller options
	*/
	$scope.resizableOptions = 
	{	
		minWidth: '10',
		maxWidth: '260',
		handles: 'e',
		resize: function( event, ui ) {
			
		},
		stop: function(event, ui){
			preventClicking = true;
			$scope.eventTimestamp = event.timeStamp;
		}
	}

	//scroller options
	$scope.$parent.myScrollOptions = {
		'reservation-settings': {
	        snap: false,
	        scrollbars: true,
	        vScroll: true,
	        vScrollbar: true,
	        hideScrollbar: false,
	        click: true,
	        scrollbars: 'custom' 
    	}
    };

    $scope.accordionOptions = {
    	header: 'a.toggle',
    	collapsible: true,
    	activate: function(event, ui){
    		if(isEmpty(ui.newHeader) && isEmpty(ui.newPanel)){ //means accordion was previously collapsed, activating..
    			ui.oldHeader.removeClass('active');
    		}
    		else if(isEmpty(ui.oldHeader)){ //means activating..
    			ui.newHeader.addClass('active');
    		}
    		$scope.$parent.myScroll['reservation-settings'].refresh();    		    	
    	}

    }
}]);
