angular.module('sntRover').controller('rvCardContractsMainCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout', 'rvPermissionSrv',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout, rvPermissionSrv) {

		BaseCtrl.call(this, $scope);
		/* Items related to ScrollBars
		 * 1. When the tab is activated, refresh scroll.
		 * 2. Scroll is actually on a sub-scope created by ng-include.
		 *    So ng-iscroll will create the ,myScroll Array there, if not defined here.
		 */

		$scope.setScroller('cardContractsScroll');

		var refreshScroller = function() {
			$timeout(function() {
				if ($scope.myScroll && $scope.myScroll['cardContractsScroll']) {
					$scope.myScroll['cardContractsScroll'].refresh();
				}
				$scope.refreshScroller('cardContractsScroll');
			}, 500);
		};

		/** ** Scroll related code ends here. ****/

		var setSideListCount = function(cc, fc, hc) {
			$scope.contractData.sideList = [
				{
					contracts: fc,
					type: 'FUTURE',
					count: fc.length
				},
				{
					contracts: cc,
					type: 'CURRENT',
					count: cc.length
				},
				{
					contracts: hc,
					type: 'PAST',
					count: hc.length
				}
			];
		}, fetchContractsListSuccessCallback = function(data) {
			var cc = data.current_contracts || [],
				hc = data.history_contracts || [],
				fc = data.future_contracts || [];

			if (cc.length !== 0 && hc.length !== 0 && fc.length !== 0) {
				// EDIT contract flow
				// $scope.contractData.mode = 'EDIT';
				// $scope.contractData.noContracts = false;
				// $scope.contractData.selectedContract = data.contract_selected;
				// fetchContractDetails()
			}
			setSideListCount(cc, fc, hc);
		}, fetchFailureCallback = function(response) {
			$scope.errorMessage = data;
		}, init = function() {
			$scope.contractData = {
				mode: '',
				sideList: [],
				noContracts: true,
				noStatistics: false,
				selectedContract: ''
			};
			$scope.callAPI(RVCompanyCardSrv.fetchContractsList, {
				successCallBack: fetchContractsListSuccessCallback,
				failureCallBack: fetchFailureCallback,
				params: {
					"account_id": $stateParams.id
				}
			});
		};

		init();

		$scope.createFirstContract = function() {
			$scope.contractData.mode = 'ADD';
			$scope.contractData.noContracts = false;
			refreshScroller();
		};
	}
]);
