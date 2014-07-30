sntRover.controller('searchController', [
  '$scope',
  '$state',
  '$rootScope',
  'RVSearchSrv',
  '$stateParams',
  '$filter',
  'searchResultdata',
  '$timeout',
  '$vault',
  function($scope, $state, $rootScope, RVSearchSrv, $stateParams, $filter, searchResultdata, $timeout, $vault) {
	
  var that = this;

  // passing in $vault too as params
  BaseCtrl.call( this, $scope, $vault, $rootScope.isReturning() );

  $scope.shouldShowLateCheckout = true;

  $scope.$emit("updateRoverLeftMenu", "search");

  // save the current search param to $vault
  $vault.set( 'lastSearchParam', JSON.stringify($stateParams) );

  // model used in query textbox, we will be using this across
  if ( $rootScope.isReturning() ) {
    $scope.textInQueryBox = $vault.get( 'lastSearchQuery' );
    $vault.remove( 'lastSearchQuery' );
  } else {
    $scope.textInQueryBox = '';
  }
  
  
  var oldTerm = "";
  var oldType = "";
  var firstClickedItem = "direct";
  $scope.currentType = "direct";
  $scope.isLateCheckoutList = false;
  $scope.searchTermPresent = false;
  if( !!$stateParams && !!$stateParams.type && $stateParams.type.trim() != '' ) {
      oldType = $stateParams.type;
      firstClickedItem = $scope.currentType = $stateParams.type;
      $scope.isLateCheckoutList = (oldType === 'LATE_CHECKOUT') ? true : false;
  } else {
    // TODO: check if there was a search term present
  }

  // setup scroller with probeType
  var scrollerOptions = {
    click: true,
    preventDefault: false,
    probeType: 2
  };

  $scope.setScroller( 'result_showing_area', scrollerOptions );


  
  /**
  * function used for refreshing the scroller
  */
  var refreshScroller = function(){  
    $scope.refreshScroller('result_showing_area');
  };

  var headingListDict = {  
    'DUEIN':  "Checking In",
    'INHOUSE': "In House",
    'DUEOUT': "Checking Out",
    'LATE_CHECKOUT': "Checking Out Late",
    '': "Search"
  };
  $scope.heading = headingListDict[oldType]; 
  $scope.setTitle($scope.heading);
    
	$scope.results = searchResultdata;
  oldType = "";
  oldTerm = $scope.textInQueryBox;
  setTimeout(refreshScroller, 1000);
  $scope.searchTermPresent = !!oldTerm ? true : false;
      
  //success callback of data fetching from the webservice
	var successCallBackofInitialFetch = function(data){
    $scope.$emit('hideLoader');
    $scope.results = data;
    oldType = "";
    oldTerm = $scope.textInQueryBox;
    setTimeout(refreshScroller, 1000);
    $scope.searchTermPresent = (oldTerm.length>0) ? true : false;
	};

	
  /*
  * function used in template to map the reservation status to the view expected format
  */
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

  //click function on search area, mainly for closing the drawer
  $scope.clickedOnSearchArea = function(){
    $scope.$emit("closeDrawer");
  };
  //Map the room status to the view expected format
  $scope.getMappedClassWithResStatusAndRoomStatus = function(reservation_status, roomstatus, fostatus, roomReadyStatus, checkinInspectedOnly){
    	var mappedStatus = "room-number";
      if(reservation_status == 'CHECKING_IN'){
      	switch(roomReadyStatus) {

			case "INSPECTED":
				mappedStatus += ' room-green';
				break;
			case "CLEAN":
				if (checkinInspectedOnly == "true") {
					mappedStatus += ' room-orange';
					break;
				} else {
					mappedStatus += ' room-green';
					break;
				}
				break;
			case "PICKUP":
				mappedStatus += " room-orange";
				break;

			case "DIRTY":
				mappedStatus += " room-red";
				break;

		}
      }
  	 return mappedStatus;
  };

  //Map the room status to the view expected format
  $scope.getRoomStatusMapped = function(roomstatus, fostatus) {
    var mappedStatus = "";
    if (roomstatus == "READY" && fostatus == "VACANT") {
    mappedStatus = 'ready';
    } else {
    mappedStatus = "not-ready";
    }
    return mappedStatus;
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


  /**
  * function to perform initial actions like setting heading, call webservice..
  */
  var performInitialActions = function(){
      $scope.heading = headingListDict[oldType]; 
      $scope.setTitle($scope.heading);
      //preparing for web service call
    	var dataDict = {};
    	if(oldType != '') {          
          //LATE_CHECKOUT is a special case, parameter is diff. here (is_late_checkout_only)
          if(oldType == "LATE_CHECKOUT"){
            dataDict.is_late_checkout_only = true;
          }
          else{
      		  dataDict.status = oldType;
          }
          //calling the webservice
          $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofInitialFetch); 
    	}
      
      else{   
        $scope.results = [];
      }
    };



  /**
  * function to perform filtering/request data from service in change event of query box
  */
	$scope.queryEntered = function(){

		var queryText = $scope.textInQueryBox;

    // write this to the $vault
    $vault.set( 'lastSearchQuery', angular.copy($scope.textInQueryBox) );
		
		$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
	    //setting the heading of the screen to "Search"
	    $scope.heading = headingListDict['']; 
		if(queryText.length <=3){
			if(firstClickedItem == "direct"){
				$scope.currentType = firstClickedItem;
			} 
		} else {
			$scope.currentType = "";
		}
	 
    displayFilteredResults();  
  };
  
  $scope.clearResults = function(){
   if(typeof $stateParams !== 'undefined' && typeof $stateParams.type !== 'undefined' && 
      $stateParams.type != null && $stateParams.type.trim() != '') {
        oldType = $stateParams.type;
    }   
  	performInitialActions();
  	$scope.textInQueryBox = "";
  };


  /**
  * function to perform filering on results.
  * if not fouund in the data, it will request for webservice
  */
  var displayFilteredResults = function(){ 

    //if the entered text's length < 3, we will show everything, means no filtering    
    if($scope.textInQueryBox.length < 3){
      //based on 'is_row_visible' parameter we are showing the data in the template      
      for(var i = 0; i < $scope.results.length; i++){
          $scope.results[i].is_row_visible = true;
      }     
      //the following code is for a special case
      /*
      after not found any data in a webservice call, user will clear the entered data
      then there is a functionality found in pms that, it is showing the old data
      that is here
      */ 

      if($scope.textInQueryBox.length == 0 && oldType == ''){        
        if(typeof $stateParams !== 'undefined' && typeof $stateParams.type !== 'undefined' && 
            $stateParams.type != null && $stateParams.type.trim() != '') {
              oldType = $stateParams.type;
          }
        performInitialActions();
      }
      // we have changed data, so we are refreshing the scrollerbar
      refreshScroller();    
    }
    else{
      if(oldType == "" && oldTerm != "" && $scope.textInQueryBox.indexOf(oldTerm) == 0 && $scope.results.length > 0){
        var value = ""; 
        //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
        //if it is zero, then we will request for webservice
        for(var i = 0; i < $scope.results.length; i++){
          value = $scope.results[i];
          if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
              ($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
              ($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
              ($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 || 
              ($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0)
              {
                 $scope.results[i].is_row_visible = true;
              }
          else {
            $scope.results[i].is_row_visible = false;
          }  
        }
      }
      else{
        var dataDict = {'query': $scope.textInQueryBox.trim()};
        $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofInitialFetch);         
      }
      // we have changed data, so we are refreshing the scrollerbar
      refreshScroller();                  
    }
  };
  $scope.getQueueClass = function(isReservationQueued, isQueueRoomsOn){
  	    var queueClass = '';
  		if(isReservationQueued=="true" && isQueueRoomsOn == "true"){
  			queueClass = 'queued';
  		}
  		return queueClass;
  };

  $scope.goToReservationDetails = function(reservationID, confirmationID){
      $scope.currentReservationID = reservationID;
      $scope.currentConfirmationID = confirmationID;
      $state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:reservationID, confirmationId:confirmationID, isrefresh: true});
  };

  //Relaunch the reservation details screen when the ows connection retry succeeds
  $scope.$on('OWSConnectionRetrySuccesss', function(event){
      $scope.goToReservationDetails($scope.currentReservationID, $scope.currentConfirmationID);
  });

  //end of controller
}]);
