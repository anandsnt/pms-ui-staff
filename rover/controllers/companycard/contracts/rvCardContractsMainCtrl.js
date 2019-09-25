angular.module('sntRover').controller('rvCardContractsMainCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', '$timeout',
	function($scope, RVCompanyCardSrv, $stateParams, $timeout) {

		BaseCtrl.call(this, $scope);
		$scope.contractData = {
			mode: '',
			contractsList: [],
			editData: {},
			disableFields: false,
			noContracts: true,
			noStatistics: true,
			selectedContract: ''
		};

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

		/**
		 * Function to set error message
		 * @param {Array} data - error list
		 * @returns void
		 */
		var setErrorMessage = function(data) {
			$scope.errorMessage = data;
		};

		/**
		 * function to set the contractsList object
		 * @param {Array} currentContracts - array of present contracts
		 * @param {Array} futureContracts
		 * @param {Array} pastContracts
		 * @returns void
		 */
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
		},
		/**
		 * success callback for init function
		 * @param {Object} - accepts the API response as parameter
		 * @return void
		 */
		fetchContractsListSuccessCallback = function(data) {
			var currentContracts = data.current_contracts || [],
				pastContracts = data.history_contracts || [],
				futureContracts = data.future_contracts || [];

			$scope.contractData.selectedContract = data.contract_selected || '';
			setErrorMessage([]);

			if (currentContracts.length !== 0 || pastContracts.length !== 0 || futureContracts.length !== 0) {
				// EDIT contract flow
				$scope.contractData.mode = 'EDIT';
				$scope.contractData.noContracts = false;
				$scope.contractData.selectedContract = data.contract_selected;
				// Disable the field if the selected contract is history
				angular.forEach(pastContracts, function(item) {
					if (item.id === $scope.contractData.selectedContract) {
						$scope.contractData.disableFields = true;
					}
				});
				fetchContractDetails($scope.contractData.selectedContract);
			}
			setSideListCount(currentContracts, futureContracts, pastContracts);
		},
		/**
		 * Success callback for contract detail fetch
		 * @param {Object} data - API response of detail fetch
		 */
		fetchContractDetailsSuccessCallback = function(data) {
			$scope.contractData.editData = data;
			$scope.$broadcast('refreshEditScroller');
			$scope.$broadcast('initContractsList');
		},
		/**
		 * Function to fetch the currently selected contract details
		 */
		fetchContractDetails = function(contractId) {
			var account_id;

			if ($stateParams.id === "add") {
				account_id = $scope.contactInformation.id;
			} else {
				account_id = $stateParams.id;
			}
			var options = {
				successCallBack: fetchContractDetailsSuccessCallback,
				failureCallback: setErrorMessage,
				params: {
					"account_id": account_id,
					"contract_id": contractId
				}
			};

			$scope.callAPI(RVCompanyCardSrv.fetchContractsDetails, options);
		},
		/*
		 * Failure callback for contracts fetch API
		 * @param {String} response - error message
		 * @return void
		 */
		fetchContractsListFailureCallback = function(response) {
			setErrorMessage(response);
		},
		/**
		 * Init function fetches the contracts on page load
		 */
		init = function() {
			var options = {
				successCallBack: fetchContractsListSuccessCallback,
				failureCallBack: fetchContractsListFailureCallback,
				params: {
					"account_id": $stateParams.id
				}
			};
			
			$scope.callAPI(RVCompanyCardSrv.fetchContractsList, options);
		};

		/**
		 * Listener to call on new contracts form closure
		 */
		$scope.addListener('closeNewContractsForm', init);

		/**
		 * Listener for fetch event from the contract list 
		 */
		$scope.addListener('fetchContract', function(event, data) {
			fetchContractDetails(data);
		});
		/*
		 * Listener for displaying error message
		 */
		$scope.addListener('setErrorMessage', function(event, data) {
			setErrorMessage(data);
		});
		/**
		 * Listener for addScroller refresh, from contractsList controller
		 */
		$scope.addListener('refreshAddScroller', refreshScroller);

		/**
		 * Function to load the new contracts form
		 */
		$scope.createFirstContract = function() {
			$scope.contractData.mode = 'ADD';
			$scope.contractData.noContracts = false;
			refreshScroller();
		};

		init();
	}
]);
