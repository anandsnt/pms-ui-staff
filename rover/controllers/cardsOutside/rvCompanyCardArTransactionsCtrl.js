
sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', '$rootScope' ,'RVCompanyCardSrv', '$timeout','$stateParams', 'ngDialog',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog) {

		BaseCtrl.call(this, $scope);
		var init = function(){
			fetchData();
			$scope.setScroller('ar-transaction-list');

		};

		$scope.filterData = {
			'id': ($stateParams.id != 'add') ? $stateParams.id : '',
			'filterActive': true,
			'showFilterFlag': 'OPEN',
			'fromDate': $rootScope.businessDate,
			'toDate': '',
			'isShowPaid': '',
			'textQuery': '',
			'pageNo':'1',
			'perPage':'50',
			'textInQueryBox': ''
		};
		
		// In the case of new card, handle the generated id upon saving the card.
		$scope.$on("IDGENERATED", function(id) {
			console.log("IDGENERATED");
			$scope.filterData.id = $scope.contactInformation.id;
		});
		// Get parameters for fetch data
		var getParamsToSend = function(){
			var paramsToSend = {
				"id": $scope.filterData.id,
				"paid" : $scope.filterData.isShowPaid,
				"from_date":$scope.filterData.fromDate,
				"to_date": $scope.filterData.toDate,
				"query": $scope.filterData.textInQueryBox,
				"page_no" : $scope.filterData.pageNo,
				"per_page": $scope.filterData.perPage
			};
			//CICO-10323. for hotels with single digit search, 
			//If it is a numeric query with less than 3 digits, then lets assume it is room serach.
			if($rootScope.isSingleDigitSearch && 
				!isNaN($scope.filterData.textInQueryBox) && 
				$scope.filterData.textInQueryBox.length < 3){
				
				paramsToSend.room_search = true;
			}
			return paramsToSend;
		};
		// To fetch data for ar transactions
		var fetchData = function(params){
			console.log("fetchdata");
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    $scope.arTransactionDetails = {};
			    $scope.arTransactionDetails = data;
				setTimeout(function() {
					$scope.refreshScroller('ar-transaction-list');
				}, 0)
			    console.log($scope.arTransactionDetails);
			};

			var failure = function(){
			    $scope.$emit('hideLoader');
			};

			var params = getParamsToSend();
			console.log(params);
			$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, params, arAccountsFetchSuccess, failure);
		};
		// To click filter button
		$scope.clickedFilter = function(){
			$scope.filterData.filterActive = !$scope.filterData.filterActive;
		};

		// To handle show filter changes
		$scope.chagedShowFilter = function(){
			if($scope.filterData.showFilterFlag == 'ALL')
				$scope.filterData.isShowPaid = '';
			else
				$scope.filterData.isShowPaid = false;
			fetchData();
		};

		/* Handling different date picker clicks */
		$scope.clickedFromDate = function(){
			$scope.popupCalendar('FROM');
		};
		$scope.clickedToDate = function(){
			$scope.popupCalendar('TO');
		};
		// Show calendar popup.
		$scope.popupCalendar = function(clickedOn) {
			$scope.clickedOn = clickedOn;
	      	ngDialog.open({
	      		template:'/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
		        controller: 'RVArTransactionsDatePickerController',
		        className: '',
		        scope: $scope
	      	});
	    };

	    // To handle from date change
	    $scope.$on('fromDateChanged',function(){
	        fetchData();
	    });

		// To handle to date change
	    $scope.$on('toDateChanged',function(){
	        fetchData();
	    });

	    $scope.toggleTransaction = function(){
	    	//$scope.transaction.paid = !$scope.transaction.paid;
	    	console.log("call API");
	    };

	    init();
	    /**
		 * function to perform filtering/request data from service in change event of query box
		 */
		$scope.queryEntered = function() {
			
			var queryText = $scope.filterData.textInQueryBox;
			//setting first letter as captial
			$scope.filterData.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
			
			if (queryText.length < 3 && isCharacterWithSingleDigit(queryText)) {
				return false;
			}
			fetchData();
		
		}; //end of query entered

		/**
		* Single digit search done based on the settings in admin
		* The single digit search is done only for numeric characters.
		* CICO-10323 
		*/
		function isCharacterWithSingleDigit(searchTerm){
			if($rootScope.isSingleDigitSearch){
				return isNaN(searchTerm);
			} else {
				return true;
			}
		};

		
		
}]);
