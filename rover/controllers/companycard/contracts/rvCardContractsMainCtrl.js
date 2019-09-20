angular.module('sntRover').controller('rvCardContractsMainCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog', 'dateFilter', '$timeout',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog, dateFilter, $timeout) {

		BaseCtrl.call(this, $scope);
		/* Items related to ScrollBars
		 * 1. When the tab is activated, refresh scroll.
		 * 2. Scroll is actually on a sub-scope created by ng-include.
		 *    So ng-iscroll will create the ,myScroll Array there, if not defined here.
		 */

		$scope.setScroller('cardNewContractsScroll');

		var refreshScroller = function() {
			$timeout(function() {
				if ($scope.myScroll && $scope.myScroll['cardNewContractsScroll']) {
					$scope.myScroll['cardNewContractsScroll'].refresh();
				}
				$scope.refreshScroller('cardNewContractsScroll');
			}, 500);
		};

		/** ** Scroll related code ends here. ****/

		var setSideListCount = function(currentContracts, futureContracts, pastContracts) {
			$scope.contractData.contractsList = [
				{
					contracts: futureContracts,
					type: 'FUTURE',
					count: futureContracts.length
				},
				{
					contracts: currentContracts,
					type: 'CURRENT',
					count: currentContracts.length
				},
				{
					contracts: pastContracts,
					type: 'PAST',
					count: pastContracts.length
				}
			];
		}, fetchContractsListSuccessCallback = function(data) {
			var currentContracts = data.current_contracts || [],
				pastContracts = data.history_contracts || [],
				futureContracts = data.future_contracts || [];

			if (currentContracts.length !== 0 && pastContracts.length !== 0 && futureContracts.length !== 0) {
				// EDIT contract flow
				// $scope.contractData.mode = 'EDIT';
				// $scope.contractData.noContracts = false;
				// $scope.contractData.selectedContract = data.contract_selected;
				// fetchContractDetails()
			}
			setSideListCount(currentContracts, futureContracts, pastContracts);
		}, fetchFailureCallback = function(response) {
			$scope.errorMessage = data;
		}, init = function() {
			$scope.contractData = {
				mode: '',
				contractsList: [],
				noContracts: true,
				noStatistics: true,
				selectedContract: ''
			};
			var options = {
				successCallBack: fetchContractsListSuccessCallback,
				failureCallBack: fetchFailureCallback,
				params: {
					"account_id": $stateParams.id
				}
			}
			
			$scope.callAPI(RVCompanyCardSrv.fetchContractsList, options);
		};

		$scope.addListener('closeContractsForm', init);

		$scope.createFirstContract = function() {
			$scope.contractData.mode = 'ADD';
			$scope.contractData.noContracts = false;
			refreshScroller();
		};

		/**
		 * function for close activity indicator.
		 */
		$scope.closeActivityIndication = function() {
			$scope.$emit('hideLoader');
		};

		init();
	}
]);
