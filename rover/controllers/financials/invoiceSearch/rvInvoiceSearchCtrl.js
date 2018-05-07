sntRover.controller('RVInvoiceSearchController',
	['$scope',
	'$rootScope',
	'$timeout',
	'RVInvoiceSearchSrv',
	'ngDialog',
	'$filter',
	'RVBillCardSrv',
	'$window',
	function($scope, $rootScope, $timeout, RVInvoiceSearchSrv, ngDialog, $filter, RVBillCardSrv, $window) {

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
                        // 'per_page': rvAccountsSrv.DEFAULT_PER_PAGE,
                        'page_no': page || 1,
                        'per_page': PER_PAGE
                    },
                    options = {
						params: params,
						successCallBack: successCallBackOfPayment
					};

				$scope.callAPI(RVInvoiceSearchSrv.searchForInvoice, options);
			} else {
				$scope.invoiceSearchFlags.isQueryEntered = false;
			}
		};

		/*
		 * Opens the popup which have the option to choose the bill layout while print/email
		 * @param billNo boolean bill no
		 * @param isActiveBill boolean is bill active or not
		 */
		$scope.showFormatBillPopup = function(billNo, isActiveBill) {
			$scope.billNo = 1;
			$scope.isSettledBill = true;
			$scope.isInformationalInvoice = false;
			$scope.reservationBillData = {
				"reservation_id": 2192441
			};
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
		$scope.isPrint = false;
		$( '#print-orientation' ).remove();
	};
			// print the page
	var printBill = function(data) {
		var printDataFetchSuccess = function(successData) {

			$scope.isPrint = true;
			$scope.printData = successData;
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

		};

		var printDataFailureCallback = function(errorData) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorData;
		};

		$scope.invokeApi(RVBillCardSrv.fetchBillPrintData, data, printDataFetchSuccess, printDataFailureCallback);
	};
		// print bill
	$scope.clickedPrint = function(requestData) {
		$scope.closeDialog();
		printBill(requestData);
		//scrollToTop();
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
			$scope.totalResultCount = 0;
			$scope.isPrint = false;
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