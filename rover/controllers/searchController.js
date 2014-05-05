sntRover.controller('searchController',['$scope', 'RVSearchSrv', '$stateParams', function($scope, RVSearchSrv, $stateParams){
	
  BaseCtrl.call(this, $scope);
  $scope.textInQueryBox = "";

  var globalCopyOfResults = [];

  var headingListDict = {  
    'DUEIN': "Checking In",
    'INHOUSE': "IN HOUSE",
    'DUEOUT': "Checking Out",
    'LATE_CHECKOUT': "Checking Out Late",
    '': "Search"
  }

	var successCallBackofInitialFetch = function(data){
    $scope.$emit('hideLoader');
		$scope.results = data;
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



  /**
  * function to perform initial actions like setting heading, call webservice..
  */
  var performInitialActions = function(){
      //setting the heading of the screen
      $scope.heading = headingListDict[$stateParams.type]; 
      //preparing for web service call
    	var dataDict = {};
    	if(typeof $stateParams !== 'undefined' && 
        typeof $stateParams.type !== 'undefined' && 
        $stateParams.type!='') {
          //LATE_CHECKOUT is a special case, parameter is diff. here
          if($stateParams.type == "LATE_CHECKOUT"){
            dataDict.is_late_checkout_only = true;
          }
          else{
      		  dataDict.status = $stateParams.type;
          }
          //calling the webservice
          $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofInitialFetch); 
    	}
      
      else{   
        $scope.results = [];
      }
  }

  
  performInitialActions();

  /**
  * function to perform filtering/request data from service in change event of query box
  */
	$scope.queryEntered = function(){
    console.log('in querentered event');
    //setting the heading of the screen to "Search"
    $scope.heading = headingListDict['']; 

    displayFilteredResults();
    


    
  };

  /**
  *
  */
  var displayFilteredResults = function(){      
    if($scope.textInQueryBox.length < 3){
      for(var i = 0; i < $scope.results.length; i++){
          $scope.results[i].is_row_visible = true;
      }
      if($scope.results.length == 0){
        performInitialActions();
      }
    }
    else{
      var value = ""; 
      var visibleElementsCount = 0;
      for(var i = 0; i < $scope.results.length; i++){
        value = $scope.results[i];
        if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
            ($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
            ($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
            ($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 || 
            ($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0)
            {
               $scope.results[i].is_row_visible = true;
               visibleElementsCount++;
            }
        else {
          $scope.results[i].is_row_visible = false;
        }
              
      }
     if(visibleElementsCount == 0){    
        var dataDict = {'query': $scope.textInQueryBox.trim()};
        $scope.invokeApi(RVSearchSrv.fetch, dataDict, successCallBackofInitialFetch); 
      }                 
    }

    

  };



	 
}]);

// sntRover.filter('searchFilter', function(){
//   /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
//   return function(dataArray, searchTerm){
//       if(!dataArray ) return;
//       /* when term is cleared, return full array*/
//       if( !searchTerm){
//           return dataArray
//        }else{
//            /* otherwise filter the array */
//            var term=searchTerm.toUpperCase();
//            return dataArray.filter(function( item){

//               return item.firstname.toUpperCase().indexOf(term) > -1 || 
//                     item.lastname.toUpperCase().indexOf(term) > -1 || 
//                     item.group.toUpperCase().indexOf(term) >= 0 ||
//                     item.room.toString().indexOf(term) >= 0 || 
//                     item.confirmation.toString().indexOf(term) >= 0;    
//            });
//        } 
//   }    
// });