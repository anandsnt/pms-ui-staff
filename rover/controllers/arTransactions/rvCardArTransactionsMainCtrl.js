
sntRover.controller('RVCompanyCardArTransactionsMainCtrl',
	['$scope',
	'$rootScope',
	'$stateParams',
	'ngDialog',
	'$timeout',
	'rvAccountsArTransactionsSrv',
    '$window',
    '$filter',
	function($scope, $rootScope, $stateParams, ngDialog, $timeout, rvAccountsArTransactionsSrv, $window, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';

		$scope.arFlags = {
			'currentSelectedArTab': 'balance',
			'isAddBalanceScreenVisible': false,
			'isArTabActive': false
		};

		$scope.filterData = {
			'query': '',
			'fromDate': '',
			'toDate': '',
            'includePayments': false,
            'statementEmailAddress': ''
		};


		/*
		 * Data Object set to handle various AR transaction lists.
		 */
		$scope.arDataObj = {
			'balanceList': [],
			'paidList': [],
			'unallocatedList': [],
			'allocatedList': [],

			'unpaidAmount': '',
			'paidAmount': '',
			'allocatedCredit': '',
			'unallocatedCredit': '',
			'company_or_ta_bill_id': '',

			'perPage': 50,
			'balancePageNo': 1,
			'paidPageNo': 1,
			'allocatePageNo': 1,
			'unallocatePageNo': 1,

			'balanceTotalCount': 0,
			'paidTotalCount': 0,
			'allocatedTotalCount': 0,
			'unallocatedTotalCount': 0
		};

		/*
		 * Successcallback of API after fetching Ar Transaction details.
		 * Handling data based on tabs currently active.
		 */
		var successCallbackOfFetchAPI = function( data ) {

			$scope.arDataObj.unpaidAmount = data.unpaid_amount;
			$scope.arDataObj.paidAmount = data.paid_amount;
			$scope.arDataObj.allocatedCredit = data.allocated_credit;
			$scope.arDataObj.unallocatedCredit = data.unallocated_credit;
			$scope.arDataObj.company_or_ta_bill_id = data.company_or_ta_bill_id;

			switch($scope.arFlags.currentSelectedArTab) {
			    case 'balance':
			        $scope.arDataObj.balanceList = data.ar_transactions;
			        $scope.arDataObj.balanceTotalCount = data.total_count;
			        $scope.$broadcast("FETCH_COMPLETE_BALANCE_LIST");

		            $timeout(function () {
		                 $scope.$broadcast('updatePagination', 'BALANCE' );
		            }, 1000);

			        break;
			    case 'paid-bills':
			        $scope.arDataObj.paidList = data.ar_transactions;
			        $scope.arDataObj.paidTotalCount = data.total_count;
			        $scope.$broadcast("FETCH_COMPLETE_PAID_LIST");

			        $timeout(function () {
		                 $scope.$broadcast('updatePagination', 'PAID' );
		            }, 1000);

			        break;
			    case 'unallocated':
			        $scope.arDataObj.unallocatedList = data.ar_transactions;
			        $scope.arDataObj.unallocatedTotalCount = data.total_count;
                    $scope.$broadcast('REFRESH_UNALLOCATED_LIST_SCROLLER');

                    $timeout(function () {
                         $scope.$broadcast('updatePagination', 'UNALLOCATE' );
                    }, 1000);

			        break;
			    case 'allocated':
			        $scope.arDataObj.allocatedList = data.ar_transactions;
			        $scope.arDataObj.allocatedTotalCount = data.total_count;
                    $scope.$broadcast('REFRESH_ALLOCATED_LIST_SCROLLER');

                    $timeout(function () {
                         $scope.$broadcast('updatePagination', 'ALLOCATE' );
                    }, 1000);

			        break;
			}
			$scope.$emit('hideLoader');
		};

		/*
		 * Switching btw different tabs in AR transaction screen
		 * @param tab is selected tab
		 */
		$scope.switchArTransactionTab = function(tab) {
			$scope.arFlags.currentSelectedArTab = tab;
			if (tab !== 'balance') {
				$scope.arFlags.isAddBalanceScreenVisible = false;
			}

			$scope.fetchTransactions();
		};
		/*
		 * Show Add balance screen
		 */
		$scope.showAddBalanceScreen = function () {
			$scope.arFlags.isAddBalanceScreenVisible = true;
			$scope.$broadcast('ADD_BALANCE_TAB');
		};

		/* Handling different date picker clicks */
		$scope.clickedFromDate = function() {
			$scope.popupCalendar('FROM');
		};
		$scope.clickedToDate = function() {
			$scope.popupCalendar('TO');
		};
		// To handle from date change
	    $scope.$on('fromDateChanged', function() {
	       $scope.filterChanged();
	    });

	    // To handle to date change
	    $scope.$on('toDateChanged', function() {
	        $scope.filterChanged();
	    });
		// Show calendar popup.
		$scope.popupCalendar = function(clickedOn) {
			$scope.clickedOn = clickedOn;
	      	ngDialog.open({
	      		template: '/assets/partials/companyCard/rvCompanyCardContractsCalendar.html',
		        controller: 'RVArTransactionsDatePickerController',
		        className: '',
		        scope: $scope
	      	});
	    };
	    /*
	     * Fetch transactions API
	     * @param dataToSend data object to API
	     */
		$scope.fetchTransactions = function () {
			var dataToApi = createParametersFetchTheData();

			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, dataToApi, successCallbackOfFetchAPI );
		};
		/*
		 * Here is the method to fetch the data in each tab
		 * Params will be different on each tab
		 */

		$scope.filterChanged = function() {
			$scope.fetchTransactions();
		};
		/*
		 * Add payment method
		 */
		$scope.addPayment = function() {
			$scope.passData = getPassData();
			ngDialog.open({
	      		template: '/assets/partials/companyCard/arTransactions/rvArTransactionsPayCredits.html',
		        controller: 'RVArTransactionsPayCreditsController',
		        className: '',
		        scope: $scope
	      	});
	      	$scope.paymentModalOpened = true;
		};


		/*
		 * To create the parameters which is to be passed to API
		 */

		var createParametersFetchTheData = function () {
			var dataToSend = {
				account_id: $stateParams.id,
				getParams : {
					per_page: $scope.arDataObj.perPage,
					from_date: $scope.filterData.fromDate,
					to_date: $scope.filterData.toDate,
					query: $scope.filterData.query
				}
			};

			switch($scope.arFlags.currentSelectedArTab) {
			    case 'balance':
			        dataToSend.getParams.transaction_type = 'CHARGES';
					dataToSend.getParams.paid = false;
					dataToSend.getParams.page = $scope.arDataObj.balancePageNo;
			        break;
			    case 'paid-bills':
			        dataToSend.getParams.transaction_type = 'CHARGES';
					dataToSend.getParams.paid = true;
					dataToSend.getParams.page = $scope.arDataObj.paidPageNo;
			        break;
			    case 'unallocated':
			        dataToSend.getParams.transaction_type = 'PAYMENTS';
					dataToSend.getParams.allocated = false;
					dataToSend.getParams.page = $scope.arDataObj.unallocatePageNo;
			        break;
			    case 'allocated':
			        dataToSend.getParams.transaction_type = 'PAYMENTS';
					dataToSend.getParams.allocated = true;
                    dataToSend.getParams.page = $scope.arDataObj.allocatePageNo;
			        break;
			}
			return dataToSend;
		};


	    /*
		* Data object to pass to the credit pay controller
		*/
	    var getPassData = function() {
			var passData = {
				"account_id": $stateParams.id,
				"is_swiped": false,
				"details": {
					"firstName": "",
					"lastName": ""
				}
			};

			return passData;
		};

		/*
		 * Initial loading of the screen
		 *
		 */
		var init = function() {
			$scope.fetchTransactions();
		};

		// Catch error messges from child controllers.
		$scope.$on('SHOW_ERROR_MSG', function( event, errorMessage ) {
			$scope.errorMessage = errorMessage;
		});
        // Refresh balance list - after adding new manual balance
        // and after succesfull payment with Allocate payment after posting checked
		$scope.$on('REFRESH_BALANCE_LIST', function() {
			$scope.arFlags.currentSelectedArTab = 'balance';
			$scope.fetchTransactions();
		});
		// Refresh selected list
		$scope.$on("REFRESH_SELECTED_LIST", function() {
			$scope.fetchTransactions();
		});

		/*
		 * Initial loading of this AR transactions tab
		 */

		$rootScope.$on("arTransactionTabActive", function(event) {
			init();
			$scope.arFlags.isArTabActive = true;
		});

		/*
	     * Fetch transactions APIs
	     * @param pageType { String } , Page No { String }to API
	     */
		var loadAPIData = function ( pageType, pageNo ) {
			switch(pageType) {
			    case 'BALANCE':
			        $scope.arDataObj.balancePageNo = pageNo;
					break;
			    case 'PAID':
			        $scope.arDataObj.paidPageNo = pageNo;
			        break;
			    case 'ALLOCATE':
			        $scope.arDataObj.allocatePageNo = pageNo;
			        break;
			    case 'UNALLOCATE':
			        $scope.arDataObj.unallocatePageNo = pageNo;
			        break;
			}
			$scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, createParametersFetchTheData(), successCallbackOfFetchAPI );
		};

	    // Pagination options for BALANCE
	    $scope.balancePagination = {
	        id: 'BALANCE',
	        api: [ loadAPIData, 'BALANCE' ],
	        perPage: $scope.arDataObj.perPage
	    };

	    // Pagination options for PAID
	    $scope.paidPagination = {
	        id: 'PAID',
	        api: [ loadAPIData, 'PAID' ],
	        perPage: $scope.arDataObj.perPage
	    };

	    // Pagination options for AR_BALANCE
	    $scope.allocatePagination = {
	        id: 'ALLOCATE',
	        api: [ loadAPIData, 'ALLOCATE' ],
	        perPage: $scope.arDataObj.perPage
	    };

		// Pagination options for AR_BALANCE
	    $scope.unallocatePagination = {
	        id: 'UNALLOCATE',
	        api: [ loadAPIData, 'UNALLOCATE' ],
	        perPage: $scope.arDataObj.perPage
	    };

	    // -------/ PAGINATION LOGIC /----------- //

        // Handler for statement button click
        $scope.clickedArStatementButton = function() {

            var dataFetchSuccess = function(data) {
                $scope.$emit('hideLoader');
                $scope.statementEmailAddress = !!data.to_address ? data.to_address : '';
                ngDialog.open({
                    template: '/assets/partials/companyCard/arTransactions/rvArStatementPopup.html',
                    className: '',
                    closeByDocument: false,
                    scope: $scope
                });
            },
            dataFailureCallback = function(errorData) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorData;
            };
            var params = { 'id': $stateParams.id };

            $scope.invokeApi(rvAccountsArTransactionsSrv.fetchArStatementData, params, dataFetchSuccess, dataFailureCallback);
        };

        // Checks whether include payment checkbox should be shown or not
        $scope.showIncludePayments = function() {
            return ( $scope.arFlags.currentSelectedArTab === 'balance' || $scope.arFlags.currentSelectedArTab === 'paid-bills' );
        };

        // Toggle the value of include payments filter
        $scope.toggleIncludePaymentSelection = function() {
            $scope.filterData.includePayments = !$scope.filterData.includePayments;
        };

        // Get parameters for fetch data
        var getParamsToSend = function() {
            var paramsToSend = {
                "id": $stateParams.id,
                "from_date": $scope.filterData.fromDate,
                "to_date": $scope.filterData.toDate,
                "query": $scope.filterData.textInQueryBox,
                "transaction_type": "PAYMENTS"
            };

            if ($scope.arFlags.currentSelectedArTab === 'balance') {
                paramsToSend.paid = 'false';
                paramsToSend.transaction_type = 'CHARGES';
                paramsToSend.include_payments = $scope.filterData.includePayments;
            } else if ($scope.arFlags.currentSelectedArTab === 'paid-bills') {
                paramsToSend.paid = 'true';
                paramsToSend.transaction_type = 'CHARGES';
                paramsToSend.include_payments = $scope.filterData.includePayments;
            } else if ($scope.arFlags.currentSelectedArTab === 'unallocated') {
                paramsToSend.transaction_type = 'PAYMENTS';
                paramsToSend.allocated = 'false';
            } else if ($scope.arFlags.currentSelectedArTab === 'allocated') {
                paramsToSend.transaction_type = 'PAYMENTS';
                paramsToSend.allocated = 'true';
            }
            // CICO-10323. for hotels with single digit search,
            // If it is a numeric query with less than 3 digits, then lets assume it is room serach.

            if ($rootScope.isSingleDigitSearch &&
                !isNaN($scope.filterData.textInQueryBox) &&
                $scope.filterData.textInQueryBox.length < 3) {

                paramsToSend.room_search = true;
            }
            return paramsToSend;
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
            var printDataFetchSuccess = function(successData) {
                $scope.$emit('hideLoader');
                $scope.printData = successData;
                $scope.errorMessage = "";
                // hide hotel logo
                $("header .logo").addClass('logo-hide');
                $("#invoiceDiv.invoice").addClass('no-print');
                $("#regDiv.registration-card").addClass('no-print');
                // inoder to set class 'print-statement' on rvCompanyCardDetails.html
                $scope.$emit("PRINT_AR_STATEMENT", true);
                // add the orientation
                addPrintOrientation();

                /*
                *   ======[ READY TO PRINT ]======
                */
                // this will show the popup with full bill
                $timeout(function() {
                    /*
                    *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                    */

                    $window.print();
                    if ( sntapp.cordovaLoaded ) {
                        cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
                    }
                }, 1000);

                /*
                *   ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                */

                $timeout(function() {
                    $("header .logo").removeClass('logo-hide');
                    $("#invoiceDiv.invoice").removeClass('no-print');
                    $("#regDiv.registration-card").removeClass('no-print');
                    // inoder to re-set/remove class 'print-statement' on rvCompanyCardDetails.html
                    $scope.$emit("PRINT_AR_STATEMENT", false);
                    // remove the orientation after similar delay
                    removePrintOrientation();
                }, 1000);
            };

            var printDataFailureCallback = function(errorData) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorData;
            };

            $scope.invokeApi(rvAccountsArTransactionsSrv.fetchArStatementPrintData, params, printDataFetchSuccess, printDataFailureCallback);
        };

        // Handler for AR statement print
        $scope.pritArStatement = function () {
            var params = getParamsToSend();

            printArStatement( params );

        };

        // To show email sent callbacks
        $scope.showEmailSentStatusPopup = function(status) {
            ngDialog.open({
                template: '/assets/partials/popups/rvEmailSentStatusPopup.html',
                className: '',
                scope: $scope
            });
        };

        // Send email AR statement
        $scope.emailArStatement = function() {
            var params = getParamsToSend();

            params.to_address = $scope.filterData.statementEmailAddress;
            $scope.closeDialog();

            var emailSuccess = function(successData) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = "";
                $scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
                $scope.status = "success";
                $scope.showEmailSentStatusPopup();
            },
            emailFailureCallback = function(errorData) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorData;
                $scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
                $scope.status = "alert";
                $scope.showEmailSentStatusPopup();
            };

            $scope.invokeApi(rvAccountsArTransactionsSrv.emailArStatement, params, emailSuccess, emailFailureCallback);
        };
}]);
