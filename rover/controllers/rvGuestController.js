sntRover.controller('guestCardController', ['$scope', 'Likes', '$window','RVContactInfoSrv', function($scope, Likes, $window, RVContactInfoSrv){
	
	console.log("--------------")
	console.log($scope.guestCardData.contactInfo);
	//console.log($scope.countriesList.length);
	console.log("--------------")

	$scope.current = 'guest-contact';
	// //To get data from service
 //    $scope.guestData = RVReservationCardSrv.getGuestData();


    // to be changed
    $scope.guestCardHeight = 90;

	$scope.guestCardTabSwitch = function(div){

		if($scope.current ==='guest-contact')
			$scope.$broadcast('saveContactInfo');
		$scope.current = div;
	};
	
	$scope.updateData =  function(){
 		var saveUserInfoSuccessCallback = function(data){
	        $scope.$emit('hideLoader');
	    };
	    var saveUserInfoFailureCallback = function(data){
	        $scope.$emit('hideLoader');
	    };

	    var	unwantedKeys = ["address","birthday","country",
							"is_opted_promotion_email","job_title",
							"mobile","passport_expiry",
							"passport_number","postal_code",
							"reservation_id","title","user_id",
							"works_at","birthday"
							];
		var dataTobeUpdated = dclone($scope.guestCardData.contactInfo, unwantedKeys); 

	    var data ={'data':dataTobeUpdated,
	    			'userId':$scope.guestCardData.contactInfo.user_id
	    		}
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback);  
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