sntRover.controller('RVInvoiceSearchController',
	['$scope',
	'$rootScope',
	'$timeout',
	'RVInvoiceSearchSrv',
	'$filter',
	function($scope, $rootScope, $timeout, RVInvoiceSearchSrv, $filter) {
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
		 * Initialization
		 */
		that.init = () => {
			$scope.invoiceSearchData = {};
			$scope.invoiceSearchData.query = '';
			$scope.invoiceSearchFlags = {};
			$scope.invoiceSearchFlags.showFindInvoice = true;
			$scope.invoiceSearchFlags.isQueryEntered = false;
			$scope.totalResultCount = 0;
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