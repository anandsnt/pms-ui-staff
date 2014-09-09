sntRover.controller('rvSelectEntityCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog','RVCompanyCardSearchSrv','RVSearchSrv', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog, RVCompanyCardSearchSrv, RVSearchSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.textInQueryBox = "";
  	$scope.isReservationActive = true;
  	
  	var scrollerOptions = {click: true, preventDefault: false};
    $scope.setScroller('cards_search_scroller', scrollerOptions);
    $scope.setScroller('res_search_scroller', scrollerOptions);
    $scope.refreshScroller('cards_search_scroller');
    $scope.refreshScroller('res_search_scroller');

    var scrollerOptions = { preventDefault: false};
    $scope.setScroller('entities', scrollerOptions);  

    setTimeout(function(){
                $scope.refreshScroller('entities'); 
                }, 
            500);
  	/**
  	* function to perform filtering/request data from service in change event of query box
  	*/
	$scope.queryEntered = function(){
		console.log("queryEntered");
		if($scope.textInQueryBox === "" || $scope.textInQueryBox.length < 3){
			$scope.results.cards = [];
			$scope.results.reservations = [];
		}
		else{
	    	displayFilteredResultsCards();
	    	displayFilteredResultsReservations(); 
	   	}
	   	var queryText = $scope.textInQueryBox;
	   	$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
  	};
  
	$scope.clearResults = function(){
	  	$scope.textInQueryBox = "";
	  	$scope.refreshScroller('entities');
	};
  	var searchSuccessCards = function(data){
		$scope.$emit("hideLoader");
		$scope.results.cards = [];
		$scope.results.cards = data.accounts;
		console.log(data);
		setTimeout(function(){$scope.refreshScroller('cards_search_scroller');}, 750);
	};
  	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	var displayFilteredResultsCards = function(){ 
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.textInQueryBox.length < 3){
	      //based on 'is_row_visible' parameter we are showing the data in the template      
	      for(var i = 0; i < $scope.results.cards.length; i++){
	          $scope.results.cards[i].is_row_visible = true;
	      }     
	      
	      // we have changed data, so we are refreshing the scrollerbar
	      $scope.refreshScroller('cards_search_scroller');      
	    }
	    else{
	      var value = ""; 
	      var visibleElementsCount = 0;
	      //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
	      //if it is zero, then we will request for webservice
	      for(var i = 0; i < $scope.results.cards.length; i++){
	        value = $scope.results.cards[i];
	        if (($scope.escapeNull(value.account_first_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
	            ($scope.escapeNull(value.account_last_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ) 
	            {
	               $scope.results.cards[i].is_row_visible = true;
	               visibleElementsCount++;
	            }
	        else {
	          $scope.results.cards[i].is_row_visible = false;
	        }
	              
	      }
	      // last hope, we are looking in webservice.      
	     if(visibleElementsCount == 0){    
	        var dataDict = {'query': $scope.textInQueryBox.trim()};
	        $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, searchSuccessCards);
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      $scope.refreshScroller('cards_search_scroller');                  
	    }
  	};	
	
	/**
	* Success call back of data fetch from webservice
	*/
	var searchSuccessReservations = function(data){
        $scope.$emit('hideLoader');
        $scope.results.reservations = [];
		$scope.results.reservations = data;
		console.log(data);
		setTimeout(function(){$scope.refreshScroller('res_search_scroller');}, 750);
	};

	/**
	* failure call back of search result fetch	
	*/
	var failureCallBackofDataFetch= function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	
	var displayFilteredResultsReservations = function(){ 
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.textInQueryBox.length < 3){
	      	//based on 'is_row_visible' parameter we are showing the data in the template      
	      	for(var i = 0; i < $scope.results.length; i++){
	          $scope.results.reservations[i].is_row_visible = true;
	      	}     
	      	
			$scope.refreshScroller('res_search_scroller');
	    }
	    else{

		    if($scope.textInQueryBox.indexOf($scope.textInQueryBox) == 0 && $scope.results.reservations.length > 0){
		        var value = ""; 
		        //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
		        //if it is zero, then we will request for webservice
		        var totalCountOfFound = 0;		        
		        for(var i = 0; i < $scope.results.reservations.length; i++){
		          value = $scope.results.reservations[i];
		          if (($scope.escapeNull(value.firstname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.lastname).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
		              ($scope.escapeNull(value.group).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ||
		              ($scope.escapeNull(value.room).toString()).indexOf($scope.textInQueryBox) >= 0 || 
		              ($scope.escapeNull(value.confirmation).toString()).indexOf($scope.textInQueryBox) >= 0)
		              {
		                 $scope.results.reservations[i].is_row_visible = true;
		                 totalCountOfFound++;
		              }
		          else {
		            $scope.results.reservations[i].is_row_visible = false;
		          }  
		        }
		        if(totalCountOfFound == 0){
		        	 var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, searchSuccessReservations, failureCallBackofDataFetch);
		        }
		      }
		    else{
		        var dataDict = {'query': $scope.textInQueryBox.trim()};
		        $scope.invokeApi(RVSearchSrv.fetch, dataDict, searchSuccessReservations, failureCallBackofDataFetch);         
		    }
	      	// we have changed data, so we are refreshing the scrollerbar
	      	$scope.refreshScroller('res_search_scroller');                
	    }
	}; //end of displayFilteredResults
	
	//Toggle between Reservations , Cards
	$scope.toggleClicked = function(flag){
		$scope.isReservationActive = flag;
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
}]);