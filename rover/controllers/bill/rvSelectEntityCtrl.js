sntRover.controller('rvSelectEntityCtrl',['$scope','$rootScope','$filter','RVGuestCardLoyaltySrv', 'ngDialog','RVCompanyCardSearchSrv', function($scope, $rootScope,$filter, RVGuestCardLoyaltySrv, ngDialog, RVCompanyCardSearchSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.textInQueryBox = "";
	$scope.results = {};
  	$scope.results.reservations = [];
  	$scope.results.cards = [];
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
	    	displayFilteredResults();  
	   	}
	   	var queryText = $scope.textInQueryBox;
	   	$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
  	};
  
	$scope.clearResults = function(){
	  	$scope.textInQueryBox = "";
	};
  	var successCallBackofInitialFetch = function(data){
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
  	var displayFilteredResults = function(){ 
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
	        $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, successCallBackofInitialFetch);
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      //refreshScroller();                  
	    }
  	};	
	
}]);