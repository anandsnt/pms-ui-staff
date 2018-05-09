sntRover.controller('RVInvoiceSearchController',
	['$scope',
	'$rootScope',
	'$timeout',
	'RVInvoiceSearchSrv',
	'ngDialog',
	'$filter',
	'RVBillCardSrv',
	'$window',
	'rvAccountTransactionsSrv',
	'rvAccountsConfigurationSrv',
	function($scope, $rootScope, $timeout, RVInvoiceSearchSrv, ngDialog, $filter, RVBillCardSrv, $window, rvAccountTransactionsSrv, rvAccountsConfigurationSrv) {

		BaseCtrl.call(this, $scope);

		const scrollOptions =  {preventDefaultException: { tagName: /^(INPUT|LI)$/ }, preventDefault: false},
			that = this,
			PER_PAGE = 10;	

		$scope.setScroller('invoice-list', scrollOptions);
		/**
		* function to set Headinng
		* @return - {None}
		*/
		$scope.setTitleAndHeading = function(title) {
 
			$scope.setTitle(title);
			$scope.$parent.heading = title;
		};

		// To refresh the scroll
		const refreshScroll = function() {
			$timeout(function() { 
				$scope.refreshScroller('invoice-list');
			}, 1000);
		};

		/*
		 * To clear the results and search term when clicks close button in search field
		 */ 
		$scope.clearQuery = () => {
			$scope.invoiceSearchFlags.showFindInvoice = true;
			$scope.invoiceSearchData.query = '';
			$scope.invoiceSearchFlags.isQueryEntered = false;
			$scope.totalResultCount = 0;
			$scope.invoiceSearchData.reservationsList = [];
			refreshScroll();
		};
		/*
		 * Method to search invoice
		 * @param page is page number of pagination
		 */
		$scope.searchInvoice = (page) => {
			if ($scope.invoiceSearchData.query.length > 1) {
				$scope.invoiceSearchFlags.isQueryEntered = true;
				const successCallBackOfPayment = (data) => {						
						$scope.invoiceSearchFlags.showFindInvoice = false;
						$scope.invoiceSearchData.reservationsList = data.data;
						$scope.totalResultCount = data.data.total_count;
						if ($scope.totalResultCount === 0) {
							$scope.invoiceSearchFlags.showFindInvoice = true;
						}
						$timeout (function() {
							$scope.$broadcast('updatePagination', 'INVOICE_SEARCH');
						}, 800);	
						refreshScroll();
					},
					params = {
						'query': $scope.invoiceSearchData.query,
						'no_control_number': true,
						'page_no': page || 1,
						'per_page': PER_PAGE
					},
					options = {
						params: params,
						successCallBack: successCallBackOfPayment
					};

				$scope.callAPI(RVInvoiceSearchSrv.searchForInvoice, options);
			} else {
				$scope.totalResultCount = 0;
				$scope.invoiceSearchData.reservationsList = [];
				$scope.invoiceSearchFlags.isQueryEntered = false;
				$scope.invoiceSearchFlags.showFindInvoice = true;
			}
		};

		/*
		 * Opens the popup which have the option to choose the bill layout while print/email
		 * @param billNo boolean bill no
		 * @param isActiveBill boolean is bill active or not
		 */
		$scope.showFormatBillPopup = function(parentIndex, billIndex) {
			$scope.billNo = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].bill_no;
			if ($rootScope.isInfrasecActivated && $rootScope.isInfrasecActivatedForWorkstation) {
				$scope.isSettledBill = !$scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_control_code_exist;
			} else {
				$scope.isSettledBill = true;
			}			
			$scope.isInformationalInvoice = false;
			if ($scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.type === 'RESERVATION') {
				$scope.invoiceSearchFlags.isClickedReservation = true;
				$scope.reservationBillData = {
					"reservation_id": $scope.invoiceSearchData.reservationsList.results[parentIndex].associated_item.item_id
				};
			} else {
				// We have to show toggle in popup
				$scope.reservationBillData = {}; // To handle print in posting accounts
				$scope.isFromInvoiceSearchScreen = true;
				$scope.clickedInvoiceData = $scope.invoiceSearchData.reservationsList.results[parentIndex];
				$scope.invoiceSearchFlags.isClickedReservation = false;
			}
			
			ngDialog.open({
					template: '/assets/partials/popups/billFormat/rvBillFormatPopup.html',
					controller: 'rvBillFormatPopupCtrl',
					className: '',
					scope: $scope
			});
		};
		// add the print orientation before printing
		var addPrintOrientation = function() {
			$( 'head' ).append( "<style id='print-orientation'>@page { size: portrait; }</style>" );
		};

		// add the print orientation after printing
		var removePrintOrientation = function() {
			$( '#print-orientation' ).remove();
		};

		// print the page
		var printBill = function(data) {
			var printDataFetchSuccess = function(successData) {
					if ($scope.invoiceSearchFlags.isClickedReservation) {
						$scope.printData = successData;
					} else {
						$scope.printData = successData.data;
					}
					
					$scope.errorMessage = "";

					// CICO-9569 to solve the hotel logo issue
					$("header .logo").addClass('logo-hide');
					$("header .h2").addClass('text-hide');

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
						}
					}, 200);

					/*
					*	======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
					*/

					$timeout(function() {
						// CICO-9569 to solve the hotel logo issue
						$("header .logo").removeClass('logo-hide');
						$("header .h2").addClass('text-hide');

						// remove the orientation after similar delay
						removePrintOrientation();
					}, 200);

				},
				printDataFailureCallback = function(errorData) {
					$scope.$emit('hideLoader');
					$scope.errorMessage = errorData;
				}, 
				options = {
					params: data,
					successCallBack: printDataFetchSuccess,
					failureCallBack: printDataFailureCallback
				};

			if ($scope.invoiceSearchFlags.isClickedReservation) {
				$scope.callAPI(RVBillCardSrv.fetchBillPrintData, options);				
			} else {
				$scope.callAPI(rvAccountTransactionsSrv.fetchAccountBillsForPrint, options);				
			}			
		};

		// print bill
		$scope.clickedPrint = function(requestData) {
			$scope.closeDialog();
			printBill(requestData);
		};
		/*
		 * To send email
		 */
		$scope.clickedEmail = function(data) {
			$scope.closeDialog();
			var sendEmailSuccessCallback = function() {
					$scope.$emit('hideLoader');
					$scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
					$scope.status = "success";
					$scope.showEmailSentStatusPopup();
				},
				sendEmailFailureCallback = function() {
					$scope.$emit('hideLoader');
					$scope.statusMsg = $filter('translate')('EMAIL_SEND_FAILED');
					$scope.status = "alert";
					$scope.showEmailSentStatusPopup();
				},
				options = {
					params: data,
					successCallBack: sendEmailSuccessCallback,
					failureCallBack: sendEmailFailureCallback
				};

			if ($scope.invoiceSearchFlags.isClickedReservation) {
				$scope.callAPI(RVBillCardSrv.sendEmail, options);				
			} else {
				$scope.callAPI(rvAccountsConfigurationSrv.emailInvoice, options);				
			}
		};
		/*
		 * Initialization
		 */
		that.init = () => {
			$scope.invoiceSearchData = {};
			$scope.invoiceSearchData.query = '';
			$scope.invoiceSearchFlags = {};
			$scope.invoiceSearchFlags.showFindInvoice = true;
			$scope.invoiceSearchFlags.isQueryEntered = false;
			$scope.invoiceSearchFlags.isClickedReservation = true;
			$scope.totalResultCount = 0;
			$scope.printData = {};
			$scope.invoiceSearchPagination = {
				id: 'INVOICE_SEARCH',
				api: $scope.searchInvoice,
				perPage: PER_PAGE
			};
			var title = $filter('translate')('FIND_INVOICE');

			$scope.setTitleAndHeading(title);
		};
		
		that.init();
}]);