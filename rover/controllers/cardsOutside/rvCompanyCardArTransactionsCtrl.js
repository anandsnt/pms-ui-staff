
sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', '$rootScope' ,'RVCompanyCardSrv', '$timeout','$stateParams', 'ngDialog',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog) {

		BaseCtrl.call(this, $scope);
		var init = function(){
			fetchData();
		};

		$scope.filterData = {
			'id': ($stateParams.id != 'add') ? $stateParams.id : '',
			'filterActive': true,
			'showFilterFlag': 'OPEN',
			'fromDate': $rootScope.businessDate,
			'toDate': '',
			'isShowPaid': ''
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
				"to_date": $scope.filterData.toDate
			};
			return paramsToSend;
		};
		// To fetch data for ar transactions
		var fetchData = function(params){
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    $scope.arTransactionDetails = {};
			    $scope.arTransactionDetails = data;
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

	    init();
		
}]);
