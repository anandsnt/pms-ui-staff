sntRover.controller('guestCardController', ['$scope', 'Likes', '$window', 'RVReservationCardSrv', function($scope, Likes, $window, RVReservationCardSrv){
	
	var maxHeight = $(window).height();

	$scope.current = 'guest-contact';

    $scope.guestCardVisible = false;    
    $scope.resizableOptions = {
    	minHeight: '90',
    	maxHeight: maxHeight - 90,
    	handles: 's',
    	resize: function( event, ui ) {
			if ($(this).height() > 120 && !$scope.guestCardVisible) { //against angular js principle, sorry :(				
				$scope.guestCardVisible = true;
				$scope.$apply();
			}
			else if($(this).height() <= 120 && $scope.guestCardVisible){
				$scope.guestCardVisible = false;
				$scope.$apply();
			}
		}
    }

	$scope.guestCardTabSwitch = function(div){
		$scope.current = div;
	};
	
	$scope.guestCardToggle = function(){
		
		$scope.guestCardHeight = ($scope.guestCardHeight === 90) ? 550:90;
		
		// var $isTablet = navigator.userAgent.match(/Android|iPad/i) != null,
		// 	$maxHeight = $window.innerHeight,
		// 	$breakpoint = ($maxHeight/10);
	
		// if (!$isTablet) {
		// 	$(window).resize(function() {
		//     	$maxHeight = $(window).height();
	
		//     	// Resize guest card if too big
		//     	if ($('#guest-card').hasClass('open') && $('#guest-card').height() > ($maxHeight-90))
		//     	{
		//     		$('#guest-card').css({'height':$maxHeight-90+'px'});
		//     	}
	
		//     	// Close guest card if too small
		//     	if ($('#guest-card').height() < 90)
		//     	{
		//     		$('#guest-card').removeClass('open').css({'height':90+'px'});
		//     	}
	
		//     	resizableGuestCard($maxHeight);
		// 	});
	//}
		
		
		
	};

	


}]);