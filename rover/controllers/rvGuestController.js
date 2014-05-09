
sntRover.controller('guestCardController', ['$scope', 'Likes', '$window','RVContactInfoSrv', function($scope, Likes, $window, RVContactInfoSrv){

	$scope.decloneUnwantedKeysFromContactInfo =  function(){
			// API call needs only rest of keys in the data
	    var	unwantedKeys = ["address","birthday","country",
						    "is_opted_promotion_email","job_title",
						    "mobile","passport_expiry",
						    "passport_number","postal_code",
						    "reservation_id","title","user_id",
						    "works_at","birthday"
	  					  ];
	   var declonedData = dclone($scope.guestCardData.contactInfo, unwantedKeys); 
	    return declonedData;
	};

	// init guestcard header data
	var declonedData = $scope.decloneUnwantedKeysFromContactInfo();
	var currentGuestCardHeaderData = declonedData;
	$scope.current = 'guest-contact';

	// tab actions
	$scope.guestCardTabSwitch = function(div){

		if($scope.current ==='guest-contact' && div !== 'guest-contact')
			$scope.$broadcast('saveContactInfo');
		$scope.current = div;
	};



	$scope.updateContactInfo =  function(){
		var saveUserInfoSuccessCallback = function(data){
			$scope.$emit('hideLoader');
		};
		var saveUserInfoFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
	    var newUpdatedData = $scope.decloneUnwantedKeysFromContactInfo();
	    // check if there is any chage in data.if so call API for updating data
	    if(JSON.stringify(currentGuestCardHeaderData) !== JSON.stringify(newUpdatedData)){
	    	currentGuestCardHeaderData =newUpdatedData; 
	    	var data ={'data':currentGuestCardHeaderData,
	    	'userId':$scope.guestCardData.contactInfo.user_id
	    }
	    $scope.invokeApi(RVContactInfoSrv.saveContactInfo,data,saveUserInfoSuccessCallback,saveUserInfoFailureCallback); 
	} 
	};

	// TO DO:handle click outside tabs
	$scope.guestCardClick = function($event){
		// if($event.target.id != 'guest-contact'){
		// 	$scope.$broadcast('saveContactInfo');
		// }
	};


	/**
	* for dragging of guest card 
	*/
	var maxHeight = $(window).height();
    $scope.guestCardVisible = false; //varibale used to determine whether to show guest card's different tabs

    //scroller options
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

}]);