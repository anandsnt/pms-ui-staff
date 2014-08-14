sntRover.controller('rvReservationSearchWidgetController',['$scope', '$rootScope', 'RVSearchSrv', '$filter', '$state', '$stateParams', function($scope, $rootScope, RVSearchSrv, $filter, $state, $stateParams){

	/*
	* Base reservation search, will extend in some place
	* it contain only minimal function, please add functions & methods where
	* you wrapping this.
	*/
	var that = this;
  	BaseCtrl.call(this, $scope);	

  	//model against query textbox, we will be using this across
  	$scope.textInQueryBox = "";

  	// variable used track the & type if pre-loaded search results (nhouse, checkingin..)
	$scope.searchType = "default";

	// these varibales will be used to various conditiopns for ui rendering
	$scope.isLateCheckoutList = false;

	//showSearchResultsAre
	$scope.showSearchResultsArea = false;

	//results
	$scope.results = [];

	//prevent unwanted result whoing while typeing
	$scope.isTyping = false;
	$scope.isSwiped = false;


	$scope.showAddNewGuestButton = false; //read cooment below :(
	/**
	*	should we show ADD Guest Button
	*	we can determine this from wrapper class
	*	will be helpful if the requirement changed from only for stand alone pms to other
	* 	and also also we can handle it inside
	*/
	$scope.$on("showAddNewGuestButton", function(event, showAddNewGuestButton){
		$scope.showAddNewGuestButton = showAddNewGuestButton;
	});

	/**
	* Success call back of data fetch from webservice
	*/
	var successCallBackofDataFetch = function(data){

        $scope.$emit('hideLoader');
		$scope.results = data;
	    $scope.searchType = "default";
	    setTimeout(function(){
	    	refreshScroller();
	      	$scope.$apply(function(){$scope.isTyping = false;});
	    }, 100);
	};


	/**
	* failure call back of search result fetch	
	*/
	var failureCallBackofDataFetch= function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.searchType = "default";
		$scope.errorMessage = errorMessage;
		setTimeout(function(){
	    	refreshScroller();
	      	$scope.$apply(function(){$scope.isTyping = false;});
	    }, 100);
	};

	/**
	* a reciever function to update data from outside
	*/
	$scope.$on("updateDataFromOutside", function(event, data){
	    $scope.results = data;
	    refreshScroller();
	});

	/**
	* a reciever function to update data from outside
	*/
	$scope.$on("updateReservationTypeFromOutside", function(event, type){
	    $scope.searchType = type;
	    $scope.isLateCheckoutList = (type === 'LATE_CHECKOUT') ? true:false;
	});

  	/**
  	* reciever function to show/hide the search result area.
  	*/
  	$scope.$on("showSearchResultsArea", function(event, searchAreaVisibilityStatus){
  		$scope.showSearchResultsArea = searchAreaVisibilityStatus; 
  		// if it is hiding, we need to clear the search text
  		if(!searchAreaVisibilityStatus) {
  			$scope.textInQueryBox = '';
  		}
  	});

	/**
	* function to perform filtering/request data from service in change event of query box
	*/
	$scope.queryEntered = function(){
		$scope.isSwiped = false;
		var queryText = $scope.textInQueryBox;

		//inoreder to prevent unwanted results showing while tyeping..
		if(!$scope.isTyping){
			$scope.isTyping = true;
		}

		//setting first letter as captial: soumya
		$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);

		if($scope.textInQueryBox.length == 0 && $scope.searchType == "default"){
			$scope.clearResults();
			return;
		}
		if(!$scope.showSearchResultsArea ){
			$scope.showSearchResultsArea = true;
		}
	    displayFilteredResults();  

	}; //end of query entered

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
	      	setTimeout(function(){
	      		$scope.isTyping = false;
	      	}, 200);
			refreshScroller();    
	    }
	    else{

		    if($scope.searchType == "default" &&  $scope.textInQueryBox.indexOf($scope.textInQueryBox) == 0 && $scope.results.length > 0){
		        var value = ""; 
		        //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
		        //if it is zero, then we will request for webservice
		        var totalCountOfFound = 0;		        
		        for(var i = 0; i < $scope.results.length; i++){
		          value = $scope.results[i];
		          if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
		              ($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 || 
		              ($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0)
		              {
		                 $scope.results[i].is_row_visible = true;
		                 totalCountOfFound++;
		              }
		          else {
		            $scope.results[i].is_row_visible = false;
		          }  
		        }
		        if(totalCountOfFound == 0){
		        	 var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofDataFetch, failureCallBackofDataFetch);
		        }
		      }
		    else{
		        var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofDataFetch, failureCallBackofDataFetch);         
		    }
	      	// we have changed data, so we are refreshing the scrollerbar
	      	refreshScroller();                  
	    }
	}; //end of displayFilteredResults

	/**
	* function to execute on focusing on search box
	*/
	$scope.focusOnSearchText = function(){
		//we are showing the search area
		$scope.$emit("showSearchResultsArea", true);		
		refreshScroller();

		// set the prev state here only, not outside
		// else it will override any other declarations by other controllers
		if ( !$stateParams.type ) {
			$rootScope.setPrevState = {
				title: 'Dashboard',
				callback: 'clearResults',
				scope: $scope,
				noStateChange: true
			};
		};
	};


	/**
	* function used for refreshing the scroller
	*/
	var refreshScroller = function(){  
		$scope.refreshScroller('result_showing_area');
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

  //Map the room status to the view expected format
  // $scope.getMappedClassWithResStatusAndRoomStatus = function(reservation_status, roomstatus, fostatus){
    	// var mappedStatus = "room-number";
      // if(reservation_status == 'CHECKING_IN'){
      	// if(roomstatus == "READY" && fostatus == "VACANT"){
        	// mappedStatus +=  " ready";
      	// }else{
        	// mappedStatus += " not-ready";
      	// }
      // }
  	 // return mappedStatus;
  // };

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

   /*
   * function to get reservation class against reservation status
   */
   $scope.getReservationClass = function(reservationStatus){
   		var classes = {
   			"CHECKING_IN": 'guest-check-in',
   			"CHECKEDIN": 'guest-inhouse',
   			"CHECKING_OUT": 'guest-check-out',
   			"CANCELED": 'guest-cancel',
   			"NOSHOW": 'guest-no-show',
   			"NOSHOW_CURRENT": 'guest-no-show',
   		};
   		if(reservationStatus.toUpperCase() in classes){
   			return classes[reservationStatus.toUpperCase()];
   		}
   	};
   	/**
   	* function to execute on clicking clear icon button
   	*/
    $scope.clearResults = function(){
    	$scope.results = [];
	  	$scope.textInQueryBox = "";
	  	$scope.$emit("SearchResultsCleared");
	  	$rootScope.setPrevState.hide = true;
  	};
  	
  	/**
  	* function to execute on clicking on each result
  	*/
	$scope.goToReservationDetails = function(reservationID, confirmationID){
		$scope.currentReservationID = reservationID;
		$scope.currentConfirmationID = confirmationID;
		//$scope.$emit("UpdateSearchBackbuttonCaption", "");
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:reservationID, confirmationId:confirmationID, isrefresh: true});
  	};

	//Relaunch the reservation details screen when the ows connection retry succeeds
	$scope.$on('OWSConnectionRetrySuccesss', function(event){
	  $scope.goToReservationDetails($scope.currentReservationID, $scope.currentConfirmationID);
	});	
	$scope.searchSwipeSuccessCallback = function(searchByCCResults){
		 $rootScope.setPrevState.hide = false;
		 $scope.$emit('hideLoader');
		 $scope.isSwiped = true;
		 data = searchByCCResults;
		 if(data.length == 0){
		 	$scope.$emit("updateDataFromOutside", data);  
		 	$scope.focusOnSearchText();
		 } else if(data.length == 1){
		 		var reservationID = data[0].id;
		 		var confirmationID = data[0].confirmation;
		 		$scope.goToReservationDetails(reservationID, confirmationID);
		 } else {
		 	$scope.$emit("updateDataFromOutside", data);  
		 	$scope.focusOnSearchText();
		 }

	};
	$scope.$on('SWIPEHAPPENED', function(event, data){
	 	var ksn = data.RVCardReadTrack2KSN;
  		if(data.RVCardReadETBKSN != "" && typeof data.RVCardReadETBKSN != "undefined"){
			ksn = data.RVCardReadETBKSN;
		}

		//var url = '/staff/payments/search_by_cc';
		var swipeData = {
			'et2' : data.RVCardReadTrack2,
			'ksn' : ksn,
			'etb' : data.RVCardReadETB

		};
		
		$scope.invokeApi(RVSearchSrv.searchByCC, swipeData, $scope.searchSwipeSuccessCallback);
	 	
	 	
	 });
	 
	 $scope.showNoMatches = function(resultLength, queryLength, isTyping, isSwiped){
	 	var showNoMatchesMessage = false;
	 	if(isSwiped && resultLength == 0){
	 		showNoMatchesMessage = true;
	 	} else {
	 		if(resultLength == 0 && queryLength>=3 && !isTyping){
	 			showNoMatchesMessage = true;
	 		}
	 	}
	 	return showNoMatchesMessage;
	 };
	 $scope.getQueueClass = function(isReservationQueued, isQueueRoomsOn){
  	    var queueClass = '';
  		if(isReservationQueued=="true" && isQueueRoomsOn == "true"){
 			queueClass = 'queued';
 		}
 		return queueClass;
      };
      
      
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

}]);