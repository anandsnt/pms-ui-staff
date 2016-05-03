
sntRover.controller('RVCompanyCardArTransactionsCtrl', ['$scope', '$rootScope' ,'RVCompanyCardSrv', '$timeout','$stateParams', 'ngDialog', '$state', '$vault', '$window', 'RVReservationCardSrv',
	function($scope, $rootScope, RVCompanyCardSrv, $timeout, $stateParams, ngDialog, $state, $vault, $window, RVReservationCardSrv) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.setScroller('ar-transaction-list');

		var init = function(){
			$scope.arTransactionDetails = {};
			$scope.arTransactionDetails.ar_transactions = [];
			$scope.paymentModalOpened = false;
			fetchData();
			$scope.statementEmailAddress = '';
		};

		var refreshArTabScroller = function(){
			$timeout(function() {
				$scope.refreshScroller('ar-transaction-list');
			}, 100);
		};
		// Refresh the scroller when the tab is active.
		$rootScope.$on("arTransactionTabActive", function(event) {
			refreshArTabScroller();
		});

		// Initializing filter data

		$scope.filterData = {
			'id': $scope.contactInformation === undefined? "" :$scope.contactInformation.id,
			'filterActive': false,
			'showFilterFlag': 'OPEN',
			'fromDate': '',
			'toDate': '',
			'textInQueryBox':'',
			'isShowPaid': false,
			'start': 1,
			'pageNo':1,
			'perPage':50,
			'textInQueryBox': '',
			'viewFromOutside': false,
			'transactionType' : 'ALL'
		};

		$scope.arTransactionDetails = {
			'available_credit' : parseFloat("0.00").toFixed(2),
			'amount_owing' : parseFloat("0.00").toFixed(2),
			'open_guest_bills' : 0,
			'total_count': 0,
			'ar_transactions':[]
		};

		if(typeof $stateParams.type !== 'undefined'){
			$scope.filterData.viewFromOutside = true;
			$scope.filterData.id = ($stateParams.id === 'add')? '': $stateParams.id;
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
				"per_page": $scope.filterData.perPage,
				"transaction_type" : $scope.filterData.transactionType
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

		//CICO-11669 -Added new summary fields
		var setSummaryValues = function(data) {
			$scope.arTransactionDetails.total_payments = data.total_payments;
		    $scope.arTransactionDetails.total_charges = data.total_charges;
		    $scope.arTransactionDetails.current_balance = data.current_balance;
		    $scope.arTransactionDetails.unallocated_credit = data.unallocated_credit;
	    };

		// To fetch data for ar transactions
		var fetchData = function(clearErrorMsg){
			$scope.arDetailsFetched = false;
			var arAccountsFetchSuccess = function(data) {
				$scope.arDetailsFetched = true;
			    $scope.$emit('hideLoader');

			    if(typeof clearErrorMsg === 'undefined' || clearErrorMsg) {
			    	$scope.errorMessage = '';
			    }

			    $scope.arTransactionDetails = {};
			    $scope.arTransactionDetails = data;

			    var credits = parseFloat(data.available_credit).toFixed(2);
			    if(credits === '-0.00') {
			    	credits = parseFloat('0.00').toFixed(2);
			    }

			    $scope.arTransactionDetails.available_credit = credits;
			    $scope.arTransactionDetails.amount_owing = parseFloat(data.amount_owing).toFixed(2);
			    
			    refreshArTabScroller();

				// Compute the start, end and total count parameters
				if($scope.nextAction){
					$scope.filterData.start = $scope.filterData.start + $scope.filterData.perPage ;
				}
				if($scope.prevAction){
					$scope.filterData.start = $scope.filterData.start - $scope.filterData.perPage ;

				}
				$scope.filterData.end = $scope.filterData.start + $scope.arTransactionDetails.ar_transactions.length - 1;
			};

			var failure = function(errorMessage){
			    $scope.$emit('hideLoader');
			    $scope.errorMessage = errorMessage;
			};

			var params = getParamsToSend();

			if(typeof params.id !== 'undefined' && params.id !== ''){
				$scope.invokeApi(RVCompanyCardSrv.fetchArAccountsList, params, arAccountsFetchSuccess, failure);
			}
		};

		// In the case of new card, handle the generated id upon saving the card.
		$scope.$on("IDGENERATED", function(event,data) {
			$scope.filterData.id = data.id;
			fetchData();
		});


		// To click filter button
		$scope.clickedFilter = function(){
			$scope.filterData.filterActive = !$scope.filterData.filterActive;
			$scope.$emit('ARTransactionSearchFilter', $scope.filterData.filterActive);
		};

		// To handle show filter changes
		$scope.chagedShowFilter = function(){
			if($scope.filterData.showFilterFlag === 'ALL') {
				$scope.filterData.isShowPaid = '';
			}
			else {
				$scope.filterData.isShowPaid = false;
			}
			initPaginationParams();
			fetchData();
		};

		//Handle the change in transaction type filter
		$scope.onTransactionTypeChange = function() {
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
	    	initPaginationParams();
	        fetchData();
	    });

		// To handle to date change
	    $scope.$on('toDateChanged',function(){
	    	initPaginationParams();
	        fetchData();
	    });


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
		};

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
		$scope.clearFromDateField = function(){
			$scope.filterData.fromDate = '';
			initPaginationParams();
			fetchData();
		};
		$scope.isNextButtonDisabled = function(){
			var isDisabled = false;

			if(typeof $scope.arTransactionDetails === "undefined") {
				return true;
			}
			if($scope.filterData.end >= $scope.arTransactionDetails.total_count){
				isDisabled = true;
			}
			return isDisabled;
		};

		$scope.isPrevButtonDisabled = function(){
			var isDisabled = false;
			if($scope.filterData.pageNo === 1){
				isDisabled = true;
			}
			return isDisabled;

		};

		/*
		 * Function to handle paid/open toggle button click.
		 */
		$scope.toggleTransaction = function(index){
	    	$scope.arTransactionDetails.ar_transactions[index].paid = !$scope.arTransactionDetails.ar_transactions[index].paid;

	    	var transactionSuccess = function(data) {
	            $scope.$emit('hideLoader');
	            $scope.errorMessage = '';

	            var credits = parseFloat(data.available_credits).toFixed(2);
			    if(credits === '-0.00') {
			    	credits = parseFloat('0.00').toFixed(2);
			    }

	            $scope.arTransactionDetails.available_credit = credits;
	            $scope.arTransactionDetails.open_guest_bills = data.open_guest_bills;

	            if($scope.filterData.showFilterFlag === 'OPEN' && $scope.arTransactionDetails.ar_transactions[index].paid){
	            	$scope.arTransactionDetails.total_count--;
	            }
	            if($scope.filterData.showFilterFlag === 'OPEN' && !$scope.arTransactionDetails.ar_transactions[index].paid){
	            	$scope.arTransactionDetails.total_count++;
	            }

	            setSummaryValues(data);
	        };

	        var failure = function(errorMessage){
	            $scope.$emit('hideLoader');
	            $scope.errorMessage = errorMessage;
	            $scope.arTransactionDetails.ar_transactions[index].paid = !$scope.arTransactionDetails.ar_transactions[index].paid;
	        };

	        var params = {
	            'id': $scope.filterData.id,
	            'transaction_id': $scope.arTransactionDetails.ar_transactions[index].transaction_id
	        };

	        if($scope.arTransactionDetails.ar_transactions[index].paid){
	        	// To pay API call
	        	$scope.invokeApi(RVCompanyCardSrv.payForReservation, params, transactionSuccess ,failure);
	    	}
	    	else{
	    		// To Open Api call
	    		$scope.invokeApi(RVCompanyCardSrv.openForReservation, params, transactionSuccess ,failure);
	    	}
	    };

		/*
		 * function to execute on clicking on each result
		 */
		$scope.goToReservationDetails = function(index) {

			if($scope.filterData.viewFromOutside){
				$vault.set('cardId', $stateParams.id);
				$vault.set('type', $stateParams.type);
				$vault.set('query', $stateParams.query);

				var associatedType = $scope.arTransactionDetails.ar_transactions[index].associated_type,
					associatedId = $scope.arTransactionDetails.ar_transactions[index].associated_id;

				if(associatedType === 'Reservation') {
					$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {
						id: associatedId,
						confirmationId: $scope.arTransactionDetails.ar_transactions[index].reservation_confirm_no,
						isrefresh: true,
						isFromCards: true
					});
				} else if (associatedType === 'PostingAccount') {
					$state.go('rover.accounts.config',{
						id: associatedId,
						activeTab: 'ACCOUNT',
						isFromArTransactions: true
					});
				}


			}
		};

		// clicked pay all button
	    $scope.clickedPayAll = function(){

	        var payAllSuccess = function(data) {
	            $scope.$emit('hideLoader');

	            if(data.errors.length > 0){
	                $scope.errorMessage = [data.errors[0]];
	            }
	            else{
	                $scope.errorMessage = "";
	            }
	            var clearErrorMsg = false;
	            fetchData(clearErrorMsg);
	        };

	        var failure = function(errorMessage){
	            $scope.$emit('hideLoader');
	            $scope.errorMessage = errorMessage;
	        };

	        var params = {
	            'id':$scope.filterData.id
	        };
	        $scope.invokeApi(RVCompanyCardSrv.payAll, params, payAllSuccess, failure);
	    };

	    // Show add credits amount popup
		$scope.addCreditAmount = function(){
			ngDialog.open({
	      		template:'/assets/partials/companyCard/rvArTransactionsAddCredits.html',
		        controller: 'RVArTransactionsAddCreditsController',
		        className: '',
		        scope: $scope
	      	});
		};

		$scope.payAmount = function(){
			$scope.passData = getPassData();
			ngDialog.open({
	      		template:'/assets/partials/companyCard/rvArTransactionsPayCredits.html',
		        controller: 'RVArTransactionsPayCreditsController',
		        className: '',
		        scope: $scope
	      	});
	      	$scope.paymentModalOpened = true;
		};

		$scope.getTimeConverted = function(time){
			if(time === null || time === undefined){
				return "";
			}
			var timeDict = tConvert(time);
			return (timeDict.hh + ":" + timeDict.mm + " " + timeDict.ampm);
		};

	    init();

	    // To print the current screen details.
	    $scope.clickedPrintButton = function(){

			// CICO-11667 to enable landscpe printing on transactions page.
			// Sorry , we have to access the DOM , so using jQuery..
			$("body").prepend("<style id='paper-orientation'>@page { size: landscape; }</style>");

			/*
			 *	======[ READY TO PRINT ]======
			 */
			// this will show the popup
		    $timeout(function() {
		    	/*
		    	 *	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
		    	 */

		        $window.print();

		        if ( sntapp.cordovaLoaded ) {
		            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
		        };

		        // Removing the style after print.
		        $("#paper-orientation").remove();

		    }, 100);

		    /*
		     *	======[ PRINTING COMPLETE. JS EXECUTION WILL COMMENCE ]======
		     */

	    };

	    //Reloads the AR Transaction Listing
	    $scope.reloadARTransactionListing = function() {
	    	fetchData();
	    };

	    /*
		* Data object to pass to the credit pay controller
		*/
	    var getPassData = function() {
			var passData = {
				"account_id": $scope.contactInformation.id,
				"is_swiped": false,
				"details": {
					"firstName": "",
					"lastName": ""
				}
			};
			return passData;
		};

		/*
		 *	MLI SWIPE actions
		 */
		var processSwipedData = function(swipedCardData) {

			var passData = getPassData();
			var swipeOperationObj = new SwipeOperation();
			var swipedCardDataToRender = swipeOperationObj.createSWipedDataToRender(swipedCardData);
			passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
			$scope.$broadcast('SHOW_SWIPED_DATA_ON_PAY_SCREEN', swipedCardDataToRender);

		};

		/*
		 * Handle swipe action
		 */

		$scope.$on('SWIPE_ACTION', function(event, swipedCardData) {
			if ($scope.paymentModalOpened) {
				var swipeOperationObj = new SwipeOperation();
				var getTokenFrom = swipeOperationObj.createDataToTokenize(swipedCardData);
				var tokenizeSuccessCallback = function(tokenValue) {
					$scope.$emit('hideLoader');
					swipedCardData.token = tokenValue;
					processSwipedData(swipedCardData);
				};
				$scope.invokeApi(RVReservationCardSrv.tokenize, getTokenFrom, tokenizeSuccessCallback);
			} else {
				return;
			};
		});

		$scope.$on('HANDLE_MODAL_OPENED', function(event) {
			$scope.paymentModalOpened = false;
		});

		/*
		 *	CICO-27364 : To Handle invoice button click.
		 *	show popup with PRINT, EMAIL options.
		 */
		$scope.clickedArStatementButton = function(){

			var dataFetchSuccess = function(data){
				$scope.$emit('hideLoader');
				$scope.statementEmailAddress = data.data.to_address;

				ngDialog.open({
		      		template:'/assets/partials/companyCard/rvArStatementPopup.html',
			        className: '',
			        closeByDocument: false,
			        scope: $scope
		      	});
			},
	      	dataFailureCallback = function(errorData){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorData;
			};
			var params = { 'id': $scope.filterData.id };
			$scope.invokeApi(RVCompanyCardSrv.fetchArStatementData, params, dataFetchSuccess, dataFailureCallback);
		};

	    // add the print orientation before printing
		var addPrintOrientation = function() {
			$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
		};

		// add the print orientation after printing
		var removePrintOrientation = function() {
			$( '#print-orientation' ).remove();
		};

		// print AR Statement
		var printArStatement = function(params) {
			var printDataFetchSuccess = function(successData){
				$scope.$emit('hideLoader');
				$scope.printData = successData;
				$scope.errorMessage = "";
				// hide hotel logo
				$("header .logo").addClass('logo-hide');
				// inoder to set class 'print-statement' on rvCompanyCardDetails.html
				$scope.$emit("PRINT_AR_STATEMENT",true);
			    // add the orientation
			    addPrintOrientation();

			    /*
			    *	======[ READY TO PRINT ]======
			    */
			    // this will show the popup with full bill
			    $timeout(function() {
			    	/*
			    	*	======[ PRINTING!! JS EXECUTION IS PAUSED ]======
			    	*/

			    	$window.print();
			    	if ( sntapp.cordovaLoaded ) {
			    		cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
			    	};
			    }, 1000);

			    /*
			    *	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
			    */

			    $timeout(function() {
					$("header .logo").removeClass('logo-hide');
					// inoder to re-set/remove class 'print-statement' on rvCompanyCardDetails.html
					$scope.$emit("PRINT_AR_STATEMENT",false);
					// remove the orientation after similar delay
			    	removePrintOrientation();
			    }, 1000);
			};

			var printDataFailureCallback = function(errorData){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorData;
			};
			$scope.invokeApi(RVCompanyCardSrv.fetchArStatementPrintData, params, printDataFetchSuccess, printDataFailureCallback);
		};

		// Handle AR Statement-PRINT button click
		$scope.clickedPrintArStatementButton = function(){
			var params = getParamsToSend();
			printArStatement( params );
		};

		// Handle AR Statement-EMAIL button click
		$scope.clickedEmailArStatementButton = function(){
			var params = getParamsToSend();
			params.to_address = $scope.statementEmailAddress;

			var emailSuccess = function(successData){
				$scope.$emit('hideLoader');
				$scope.errorMessage = "";
				$scope.closeDialog();
			};
			var emailFailureCallback = function(errorData){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorData;
			};
			$scope.invokeApi(RVCompanyCardSrv.emailArStatement, params, emailSuccess, emailFailureCallback);
		};

		// To close popup.
		$scope.closeDialog = function() {
            ngDialog.close();
        };

		// CICO-28089 - Handle click on each transaction.
		// will expand with detailed view.
		// Fetching data for detailed view here..
		$scope.clickedOnTransaction = function( index, event ){
			
			var element = event.target;

			if(element.className ==='switch-button' || element.className ==='switch-button on' || element.parentNode.className ==='switch-button' || element.parentNode.className ==='switch-button on'){
				$scope.toggleTransaction(index);
			}
			else{
				var transaction = $scope.arTransactionDetails.ar_transactions[index];
				transaction.details = [];

				if(!transaction.active){
					var transactionFetchSuccess = function(data){
						$scope.$emit('hideLoader');
						$scope.errorMessage = '';
						transaction.active = ! transaction.active;
						transaction.details = data;
						refreshArTabScroller();
					},
					transactionFetchFailure = function(errorMessage){
						$scope.$emit('hideLoader');
						$scope.errorMessage = errorMessage;
					};
					var param = {
						'bill_id':transaction.bill_id
					};
					$scope.invokeApi(RVCompanyCardSrv.fetchTransactionDetails, param, transactionFetchSuccess, transactionFetchFailure);
				}
				else{
					transaction.active = ! transaction.active;
					refreshArTabScroller();
				}
			}
		};

}]);
