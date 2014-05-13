sntRover.controller('guestCardController', ['$scope', 'Likes', '$window', 'RVReservationCardSrv', function($scope, Likes, $window, RVReservationCardSrv){
	
	$scope.current = 'guest-contact';
	//To get data from service
    $scope.guestData = RVReservationCardSrv.getGuestData();

	$scope.guestCardTabSwitch = function(div){
		$scope.current = div;
	};
	
	$scope.guestCardToggle = function(){
		
		
		var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null,
			$maxHeight = $window.innerHeight,
			$breakpoint = ($maxHeight/10);
	
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
		
		
		
	};

	


}]);