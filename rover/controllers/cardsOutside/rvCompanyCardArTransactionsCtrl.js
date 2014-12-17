
sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', '$rootScope' ,'RVCompanyCardSrv', '$timeout','$stateParams', 'ngDialog', '$state',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state) {

		BaseCtrl.call(this, $scope);

		var init = function(){
			console.log("init transactions");
			$scope.arTransactionDetails = {};
			$scope.arTransactionDetails.ar_transactions = [];

			fetchData();
			$scope.setScroller('ar-transaction-list');
		};

		// Initializing filter data
		$scope.filterData = {
			'id': $scope.contactInformation == undefined? "" :$scope.contactInformation.id,
			'filterActive': false,
			'showFilterFlag': 'OPEN',
			'fromDate': $rootScope.businessDate,
			'toDate': '',
			'textInQueryBox':'',
			'isShowPaid': '',
			'start': 1,
			'pageNo':1,
			'perPage':50,
			'textInQueryBox': '',
			'viewFromOutside': false
		};

		if(typeof $stateParams.type != 'undefined'){
			$scope.filterData.viewFromOutside = true;
			$scope.filterData.id = ($stateParams.id == 'add')? '': $stateParams.id;
		}
		
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
			
			var arAccountsFetchSuccess = function(data) {
			    $scope.$emit('hideLoader');
			    $scope.arTransactionDetails = {};
			    $scope.arTransactionDetails = data;
				setTimeout(function() {
					$scope.refreshScroller('ar-transaction-list');
				}, 0);

				// Compute the start, end and total count parameters
				if($scope.nextAction){
					$scope.filterData.start = $scope.filterData.start + $scope.filterData.perPage ;
				}
				if($scope.prevAction){
					$scope.filterData.start = $scope.filterData.start - $scope.filterData.perPage ;

				}
				$scope.filterData.end = $scope.filterData.start + $scope.arTransactionDetails.ar_transactions.length - 1;
			};

			var failure = function(){
			    $scope.$emit('hideLoader');
			};

			var params = getParamsToSend();
			console.log(params);

			if(typeof params.id != 'undefined' && params.id != ''){
				$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, params, arAccountsFetchSuccess, failure);
			}
		};

		// In the case of new card, handle the generated id upon saving the card.
		$scope.$on("IDGENERATED", function(event,data) {
			console.log("IDGENERATED = "+data.id);
			$scope.filterData.id = data.id;
			fetchData();
		});


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
			initPaginationParams();
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
	    	console.log("from date changed");
	    	initPaginationParams();
	        fetchData();
	    });

		// To handle to date change
	    $scope.$on('toDateChanged',function(){
	    	console.log("to date changed");
	    	initPaginationParams();
	        fetchData();
	    });

	    $scope.toggleTransaction = function(){
	    	//$scope.transaction.paid = !$scope.transaction.paid;
	    	console.log("call API");
	    };

	    /**
		 * function to perform filtering/request data from service in change event of query box
		 */
		$scope.queryEntered = function() {
			
			var queryText = $scope.filterData.textInQueryBox;
			//setting first letter as captial
			$scope.filterData.textInQueryBox = queryText.charAt(0).toUpperCase() + queryText.slice(1);
			
			initPaginationParams();
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

		var initPaginationParams = function(){
			$scope.filterData.pageNo = 1;
			$scope.filterData.start = 1;
			$scope.filterData.end = $scope.filterData.start + $scope.arTransactionDetails.ar_transactions.length - 1;
			$scope.nextAction = false;
			$scope.prevAction = false;
		}

		$scope.loadNextSet = function(){
			$scope.filterData.pageNo++;
			$scope.nextAction = true;
			$scope.prevAction = false;
			fetchData();
		};

		$scope.loadPrevSet = function(){
			$scope.filterData.pageNo--;
			$scope.nextAction = false;
			$scope.prevAction = true;
			fetchData();
		};

		$scope.clearSearchField = function(){
			$scope.filterData.textInQueryBox = '';
			initPaginationParams();
			fetchData();
		};

		$scope.clearToDateField = function(){
			$scope.filterData.toDate = '';
			initPaginationParams();
			fetchData();
		};
		$scope.isNextButtonDisabled = function(){
			var isDisabled = false;
			//if($scope.end >= RVSearchSrv.totalSearchResults || $scope.disableNextButton){
			if(typeof $scope.arTransactionDetails == "undefined")
				return true;
			if($scope.filterData.end >= $scope.arTransactionDetails.total_count){
				isDisabled = true;
			}
			return isDisabled;
		};

		$scope.isPrevButtonDisabled = function(){
			var isDisabled = false;
			if($scope.filterData.pageNo == 1){
				isDisabled = true;
			}
			return isDisabled;

		};

		/**
		 * function to execute on clicking on each result
		 */
		$scope.goToReservationDetails = function(reservationID, confirmationID) {
			console.log("$scope.filterData.viewFromOutside"+$scope.filterData.viewFromOutside);
			if($scope.filterData.viewFromOutside){
				console.log(reservationID);
				console.log(confirmationID);
				$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
					id: reservationID,
					confirmationId: confirmationID,
					isrefresh: true
				});
			}
		}	

	    init();

}]);
