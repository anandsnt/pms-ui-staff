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
			
		$scope.currentActivePage = 1;	

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
			$scope.currentActivePage = page || 1;
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
		 * Update informational invoice flag
		 * Based on checkbox in popup
		 */
		var updateInformationalInvoiceListener = $scope.$on("UPDATE_INFORMATIONAL_INVOICE", function(event, isInformationalInvoice) {
			$scope.isInformationalInvoice = isInformationalInvoice;
		});

		/*
	     * Function to get invoice button class
	     */
		$scope.getInvoiceButtonClass = function(parentIndex, billIndex) {

			var invoiceButtonClass = "blue";

			if (!$scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_active && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_folio_number_exists && $scope.roverObj.noReprintReEmailInvoice) {
				if ($scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once) {
					invoiceButtonClass = "grey";
				}
			}
			return invoiceButtonClass;
		};
		/*
	     * Function to get invoice button class
	     */
		$scope.isInvoiceButtonDisabled = function(parentIndex, billIndex) {

			var isDisabledInvoice = false;

			if (!$scope.transactionsDetails.bills[$scope.currentActiveBill].is_active && $scope.transactionsDetails.bills[$scope.currentActiveBill].is_folio_number_exists && $scope.roverObj.noReprintReEmailInvoice) {
				if ($scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once && $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once) {
					isDisabledInvoice = true;
				}
			}
			return isDisabledInvoice;
		};
		
		/*
		 * Opens the popup which have the option to choose the bill layout while print/email
		 * @param billNo boolean bill no
		 * @param isActiveBill boolean is bill active or not
		 */
		$scope.showFormatBillPopup = function(parentIndex, billIndex) {
			$scope.billNo = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].bill_no;
	
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
			$scope.isSettledBill = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_active;
			$scope.isEmailedOnce = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_emailed_once;
			$scope.isPrintedOnce = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_printed_once;
			$scope.isFolioNumberExists = $scope.invoiceSearchData.reservationsList.results[parentIndex].bills[billIndex].is_folio_number_exists;
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

		var invoiceSearchPrintCompleted = function() {
			// CICO-9569 to solve the hotel logo issue
			$("header .logo").removeClass('logo-hide');
			$("header .h2").addClass('text-hide');

			// remove the orientation after similar delay
			removePrintOrientation();
			$scope.searchInvoice($scope.currentActivePage);
		};

		// print the page
		that.printBill = function(data) {
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

						if (sntapp.cordovaLoaded) {
							cordova.exec(invoiceSearchPrintCompleted,
								function(error) {
									invoiceSearchPrintCompleted();
								}, 'RVCardPlugin', 'printWebView', []);
						}
						else
						{
							window.print();
							invoiceSearchPrintCompleted();
						}
					}, 1000);

				},
				printDataFailureCallback = function(errorData) {
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
			that.printBill(requestData);
		};
		/*
		 * To send email
		 */
		$scope.clickedEmail = function(data) {
			$scope.closeDialog();
			var sendEmailSuccessCallback = function() {
					$scope.statusMsg = $filter('translate')('EMAIL_SENT_SUCCESSFULLY');
					$scope.status = "success";
					$scope.showEmailSentStatusPopup();
				},
				sendEmailFailureCallback = function() {
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
			$scope.searchPlaceHolder = ($rootScope.roverObj.hasActivatedFolioNumber) ? 
										$filter('translate')('SEARCH_PLACE_HOLDER_WITH_FOLIO_NUMBER') : 
										$filter('translate')('SEARCH_PLACE_HOLDER_WITHOUT_FOLIO_NUMBER');
			var title = $filter('translate')('FIND_INVOICE');

			$scope.setTitleAndHeading(title);
		};
		
		that.init();

		$scope.$on('$destroy', updateInformationalInvoiceListener);
}]);