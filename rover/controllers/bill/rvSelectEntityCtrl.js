sntRover.controller('rvSelectEntityCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog','RVCompanyCardSearchSrv','RVSearchSrv', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog, RVCompanyCardSearchSrv, RVSearchSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.textInQueryBox = "";
	$scope.results = {};
  	$scope.results.reservations = [];
  	$scope.results.cards = [];
  	$scope.isReservationActive = true;
  	
  	var scrollerOptions = {click: true, preventDefault: false};
    $scope.setScroller('search_scroller', scrollerOptions);
    $scope.refreshScroller('search_scroller');
  	/**
  	* function to perform filtering/request data from service in change event of query box
  	*/
	$scope.queryEntered = function(){
		console.log("queryEntered");
		if($scope.textInQueryBox === "" || $scope.textInQueryBox.length < 3){
			$scope.results = {};
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
	};
  	var searchSuccessCards = function(data){
		$scope.$emit("hideLoader");
		$scope.results.cards = [];
		$scope.results.cards = data.accounts;
		console.log(data);
		//setTimeout(function(){refreshScroller();}, 750);
	};
  	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	$krish = $scope;
  	var displayFilteredResultsCards = function(){ 
  		console.log("displayFilteredResults");
  		console.log($scope.textInQueryBox);
  		
	    //if the entered text's length < 3, we will show everything, means no filtering    
	    if($scope.textInQueryBox.length < 3){
	      //based on 'is_row_visible' parameter we are showing the data in the template      
	      for(var i = 0; i < $scope.results.cards.length; i++){
	          $scope.results.cards[i].is_row_visible = true;
	      }     
	      
	      // we have changed data, so we are refreshing the scrollerbar
	      //refreshScroller();      
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
	      console.log("visibleElementsCount"+visibleElementsCount);
	      // last hope, we are looking in webservice.      
	     if(visibleElementsCount == 0){    
	        var dataDict = {'query': $scope.textInQueryBox.trim()};
	        console.log("api call");
	        console.log(dataDict);
	        $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, searchSuccessCards);
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      //refreshScroller();                  
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
	      	
			//refreshScroller();    
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
	      	//refreshScroller();                  
	    }
	}; //end of displayFilteredResults
	
	$scope.toggleClicked = function(flag){
		
		$scope.isReservationActive = flag;
	}
}]);