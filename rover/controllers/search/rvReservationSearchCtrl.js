sntRover.controller('rvReservationSearchController',['$scope', 'RVSearchSrv', '$filter',  function($scope, RVSearchSrv, $filter){
	/*
	* Base reservation search, will extend in some place
	* it contain only minimal function, please add functions & methods where
	* you wanted to add.
	*/
	var that = this;
  	BaseCtrl.call(this, $scope);	

  	//model against query textbox, we will be using this across
  	$scope.textInQueryBox = "";

  	// variables used track the text entered in search box & type if pre-loaded search results (nhouse, checkingin..)
	var oldTerm = "";
	var oldType = "";

	//results
	$scope.results = [];

	/**
	* Success call back of data fetch from webservice
	*/
	var successCallBackofDataFetch = function(data){

        $scope.$emit('hideLoader');
		$scope.results = data;
	    oldType = "";
	    oldTerm = $scope.textInQueryBox;
	    setTimeout(function(){refreshScroller();}, 1000);
	    $scope.searchTermPresent = (oldTerm.length>0) ? true : false;
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
	$scope.$on("updateReservationTypeFromOutside", function(event, data){
	    oldType = data;
	});

  	/**
  	* function to perform initial actions like setting heading, call webservice..
  	*/
  	var resetData = function(){
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
          $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofDataFetch); 
    	}
      
	    else{   
	       $scope.results = [];
	    }
    };

  	/**
  	* reciever function to show/hide the search result area.
  	*/
  	$scope.$on("showSearchResultsArea", function(event, searchAreaVisibilityStatus){
  		$scope.showSearchResultsArea = searchAreaVisibilityStatus;  
  	});

	/**
	* function to perform filtering/request data from service in change event of query box
	*/
	$scope.queryEntered = function(){

		var queryText = $scope.textInQueryBox;
		$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);

		/*if(queryText.length <=3){
			if(firstClickedItem == "direct"){
				$scope.currentType = firstClickedItem;
			} 
		} else {
			$scope.currentType = "";
		}*/
		if($scope.textInQueryBox.length == 0 && oldType == ''){
			$scope.$emit("SearchResultsCleared");
			return;
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
			//the following code is for a special case
			/*
			after not found any data in a webservice call, user will clear the entered data
			then there is a functionality found in pms that, it is showing the old data
			that is here
			*/ 
			/*if($scope.textInQueryBox.length == 0 && oldType == ''){        
			if(typeof $stateParams !== 'undefined' && typeof $stateParams.type !== 'undefined' && 
			    $stateParams.type != null && $stateParams.type.trim() != '') {
			      oldType = $stateParams.type;
			  }
			performInitialActions();
			}*/
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
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofDataFetch);         
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
  $scope.getMappedClassWithResStatusAndRoomStatus = function(reservation_status, roomstatus, fostatus){
    	var mappedStatus = "room-number";
      if(reservation_status == 'CHECKING_IN'){
      	if(roomstatus == "READY" && fostatus == "VACANT"){
        	mappedStatus +=  " ready";
      	}else{
        	mappedStatus += " not-ready";
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
   		}
   		if(reservationStatus.toUpperCase() in classes){
   			return classes[reservationStatus.toUpperCase()];
   		}
   };

    $scope.clearResults = function(){

	   /*if(typeof $stateParams !== 'undefined' && typeof $stateParams.type !== 'undefined' && 
	      $stateParams.type != null && $stateParams.type.trim() != '') {
	        oldType = $stateParams.type;
	    }   
	  	performInitialActions();*/
	  	$scope.textInQueryBox = "";

  	};

}]);