sntRover.controller('rvSelectEntityCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog','RVCompanyCardSearchSrv','RVSearchSrv', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog, RVCompanyCardSearchSrv, RVSearchSrv){
	BaseCtrl.call(this, $scope);

	$scope.textInQueryBox = "";
  	$scope.isReservationActive = true;
  	$scope.results.accounts = [];
	$scope.results.posting_accounts  = [];
	$scope.results.reservations = [];

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
    * Single digit search done based on the settings in admin
    * The single digit search is done only for numeric characters.
    * CICO-10323
    */
    var isSearchOnSingleDigit = function(searchTerm) {
    	if($rootScope.isSingleDigitSearch){
    		return isNaN(searchTerm);
    	} else {
    		return true;
    	}
    };

    /**
  	* function to perform filtering/request data from service in change event of query box
  	*/
	$scope.queryEntered = function(){
		if ($scope.textInQueryBox.length < 3 && isSearchOnSingleDigit($scope.textInQueryBox)) {
			$scope.results.accounts = [];
			$scope.results.posting_accounts  = [];
			$scope.results.reservations = [];
		}
		else{
	    	($scope.isReservationActive)?displayFilteredResultsReservations():displayFilteredResultsCards();
	   	}
	   	var queryText = $scope.textInQueryBox;
	   	$scope.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
  	};
  	/**
  	* function to clear the entity search text
  	*/
	$scope.clearResults = function(){
	  	$scope.textInQueryBox = "";
	  	$scope.refreshScroller('entities');
	};
  	var searchSuccessCards = function(data){
		$scope.$emit("hideLoader");
		$scope.results.accounts = [];
		$scope.results.accounts = data.accounts;
		$scope.results.posting_accounts = [];
		$scope.results.posting_accounts = data.posting_accounts;
		setTimeout(function(){$scope.refreshScroller('cards_search_scroller');}, 750);
	};
  	/**
  	* function to perform filering on results.
  	* if not fouund in the data, it will request for webservice
  	*/
  	var displayFilteredResultsCards = function(){
	    var dataDict = {'query': $scope.textInQueryBox.trim()};
	    $scope.invokeApi(RVCompanyCardSearchSrv.fetch, dataDict, searchSuccessCards);	      
  	};

  	/**
	* remove the parent reservation from the search results
	*/
	$scope.excludeActivereservationFromsSearch = function(){
		var filteredResults = [];
	  	for(var i = 0; i < $scope.results.reservations.length; i++){
            //CICO-26728 Added the future reservations as well in the search results
	  		if(($scope.results.reservations[i].id !== $scope.reservationData.reservation_id) && ($scope.results.reservations[i].reservation_status === 'CHECKING_IN' || $scope.results.reservations[i].reservation_status === 'CHECKEDIN' || $scope.results.reservations[i].reservation_status === 'CHECKING_OUT' || $scope.results.reservations[i].reservation_status === 'RESERVED')){

	  			filteredResults.push($scope.results.reservations[i]);
	  		}
  		}
  		$scope.results.reservations = filteredResults;
	};

	/**
	* Success call back of data fetch from webservice
	*/
	var searchSuccessReservations = function(data){
        $scope.$emit('hideLoader');
        $scope.results.reservations = [];
		$scope.results.reservations = data;
		if($scope.billingEntity !== "TRAVEL_AGENT_DEFAULT_BILLING" &&
                $scope.billingEntity !== "COMPANY_CARD_DEFAULT_BILLING" &&
                $scope.billingEntity !== "GROUP_DEFAULT_BILLING" &&
                $scope.billingEntity !== "ALLOTMENT_DEFAULT_BILLING"){

				$scope.excludeActivereservationFromsSearch();
		}
		setTimeout(function(){$scope.refreshScroller('res_search_scroller');}, 750);
	};

	/**
	* failure call back of search result fetch
	*/
	var failureCallBackofDataFetch= function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	/**
  	* function to perform filering on results for reservations.
  	* if not fouund in the data, it will request for webservice
  	*/
	var displayFilteredResultsReservations = function(){
	    fetchSearchResults();	    
	};

	var fetchSearchResults = function() {
		var dataDict = {'query': $scope.textInQueryBox.trim()};
		if($rootScope.isSingleDigitSearch && !isNaN($scope.textInQueryBox) && $scope.textInQueryBox.length < 3){
			dataDict.room_search = true;
		}
		$scope.invokeApi(RVSearchSrv.fetch, dataDict, searchSuccessReservations, failureCallBackofDataFetch);
	};

	//Toggle between Reservations , Cards
	$scope.toggleClicked = function(flag){
		$scope.isReservationActive = flag;
		($scope.isReservationActive)?displayFilteredResultsReservations():displayFilteredResultsCards();
	};

}]);