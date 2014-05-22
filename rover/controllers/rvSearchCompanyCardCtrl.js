sntRover.controller('searchCompanyCardController',['$scope', 'RVCompanyCardSearchSrv', '$stateParams', function($scope, RVCompanyCardSearchSrv, $stateParams){

	BaseCtrl.call(this, $scope);
	$scope.heading = "Company Card";
	//model used in query textbox, we will be using this across
	$scope.textInQueryBox = "";
	$scope.$emit("updateRoverLeftMenu","cards");
  	$scope.results = [];
	var successCallBackofInitialFetch = function(data){
		$scope.$emit("hideLoader");
		$scope.results = data.accounts;
		setTimeout(function(){refreshScroller();}, 750);
	}
	/**
  	* function used for refreshing the scroller
  	*/
  	var refreshScroller = function(){

	    $scope.$parent.myScroll['comapany_card_scroll'].refresh();
	    //scroller options
	    $scope.$parent.myScrollOptions = {
	        snap: false,
	        scrollbars: true,
	        bounce: true,
	        vScroll: true,
	        vScrollbar: true,
	        hideScrollbar: false
	    };
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
  	* function to perform filtering/request data from service in change event of query box
  	*/
	$scope.queryEntered = function(){
		if($scope.textInQueryBox === ""){
			$scope.results = [];
		}
		else{
	    	displayFilteredResults();  
	   	}
  	};
  
	$scope.clearResults = function(){
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
	      
	      // we have changed data, so we are refreshing the scrollerbar
	      refreshScroller();      
	    }
	    else{
	      var value = ""; 
	      var visibleElementsCount = 0;
	      //searching in the data we have, we are using a variable 'visibleElementsCount' to track matching
	      //if it is zero, then we will request for webservice
	      for(var i = 0; i < $scope.results.length; i++){
	        value = $scope.results[i];
	        if (($scope.escapeNull(value.account_first_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 || 
	            ($scope.escapeNull(value.account_last_name).toUpperCase()).indexOf($scope.textInQueryBox.toUpperCase()) >= 0 ) 
	            {
	               $scope.results[i].is_row_visible = true;
	               visibleElementsCount++;
	            }
	        else {
	          $scope.results[i].is_row_visible = false;
	        }
	              
	      }
	      // last hope, we are looking in webservice.      
	     if(visibleElementsCount == 0){    
	        var dataDict = {'query': $scope.textInQueryBox.trim()};
	        $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, successCallBackofInitialFetch);
	      }
	      // we have changed data, so we are refreshing the scrollerbar
	      refreshScroller();                  
	    }
  };

}]);