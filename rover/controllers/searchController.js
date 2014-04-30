sntRover.controller('searchController',['$scope', 'RVSearchSrv', '$stateParams', function($scope, RVSearchSrv, $stateParams){
	BaseCtrl.call(this, $scope);

  //setting the heading of the screen
	$scope.heading = "Search";

	var successCallBackofInitialFetch = function(data){
		$scope.results = data;
	};
	//function that converts a null value to a desired string.
	//if no replace value is passed, it returns an empty string
	$scope.escapeNull = function(value, replaceWith){
		var newValue = "";
		if((typeof replaceWith != "undefined") && (replaceWith != null)){
			newValue = replaceWith;
		}
		var valueToReturn = ((value == null || typeof value == 'undefined' ) ? newValue : value);
		return valueToReturn;
	};

    //Map the reservation status to the view expected format
    $scope.getGuestStatusMapped = function(reservationStatus, isLateCheckoutOn){
      var viewStatus = "";
      if(isLateCheckoutOn && "CHECKING_OUT" == reservationStatus){
        viewStatus = "late-check-out";
        return viewStatus;
      }
      if("RESERVED" == reservationStatus){
        viewStatus = "arrival";
      }else if("CHECKING_IN" == reservationStatus){
        viewStatus = "check-in";
      }else if("CHECKEDIN" == reservationStatus){
        viewStatus = "inhouse";
      }else if("CHECKEDOUT" == reservationStatus){
        viewStatus = "departed";
      }else if("CHECKING_OUT" == reservationStatus){
        viewStatus = "check-out";
      }else if("CANCELED" == reservationStatus){
        viewStatus = "cancel";
      }else if(("NOSHOW" == reservationStatus)||("NOSHOW_CURRENT" == reservationStatus)){
        viewStatus = "no-show";
      }
      return viewStatus;
    };

    //Map the room status to the view expected format
    $scope.getRoomStatusMapped = function(roomstatus, fostatus){
      	var mappedStatus = "";
      	if(roomstatus == "READY" && fostatus == "VACANT"){
        	mappedStatus = 'ready';
      	}else{
        	mappedStatus = "not-ready";
      	}
    	return mappedStatus;
    };

	var dataDict = {};
	if(typeof $stateParams !== 'undefined' && typeof $stateParams.type !== 'undefined') {
		dataDict.type = $stateParams.type;
	}

	$scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofInitialFetch);	
	 
}]);

