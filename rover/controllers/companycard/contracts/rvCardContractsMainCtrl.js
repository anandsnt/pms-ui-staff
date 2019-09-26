angular.module('sntRover').controller('rvCardContractsMainCtrl', ['$scope', 'RVCompanyCardSrv', '$stateParams', '$timeout', 'ngDialog',
	function($scope, RVCompanyCardSrv, $stateParams, $timeout, ngDialog) {

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

			setErrorMessage([]);

			if (currentContracts.length !== 0 || pastContracts.length !== 0 || futureContracts.length !== 0) {
				if ($scope.contractData.mode === '') {
					$scope.contractData.selectedContract = data.contract_selected || '';
				}
				// EDIT contract flow
				$scope.contractData.mode = 'EDIT';
				$scope.contractData.noContracts = false;
				// Disable the field if the selected contract is history
				angular.forEach(pastContracts, function(item) {
					if (item.id === data.contract_selected) {
						$scope.contractData.disableFields = true;
					}
				});
				fetchContractDetails(data.contract_selected);
			}
			if ($scope.contractData.selectedContract !== '') {
				refreshContractScrollers();
			}
			setSideListCount(currentContracts, futureContracts, pastContracts);
		},
		/**
		 * Success callback for contract detail fetch
		 * @param {Object} data - API response of detail fetch
		 */
		fetchContractDetailsSuccessCallback = function(data) {
			$scope.contractData.editData = data;
		},
		/**
		 * Function to fetch the currently selected contract details
		 */
		fetchContractDetails = function(contractId) {
			var accountId;

			$scope.contractData.selectedContract = contractId;
			if ($stateParams.id === "add") {
				accountId = $scope.contactInformation.id;
			} else {
				accountId = $stateParams.id;
			}
			var options = {
				successCallBack: fetchContractDetailsSuccessCallback,
				failureCallback: setErrorMessage,
				params: {
					"account_id": accountId,
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
		 * Refresh the appropriate scroller based on mode
		 */
		var refreshContractScrollers = function() {
			if ($scope.contractData.mode === 'ADD') {
				$scope.$broadcast('refreshAddScroller');
			} else if ($scope.contractData.mode === 'EDIT') {
				$scope.$broadcast('refreshEditScroller');
				$scope.$broadcast('initContractsList');
			}
		};

		/**
		 * Listener to call on new contracts form closure
		 */
		$scope.addListener('fetchContractsList', init);

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
		 * Listener for refreshing appropriate scrollers
		 */
		$scope.addListener('refreshContractsScroll', refreshContractScrollers);

		/**
		 * Function to load the new contracts form
		 */
		$scope.createFirstContract = function() {
			$scope.contractData.mode = 'ADD';
			$scope.contractData.noContracts = false;
			refreshContractScrollers();
		};

		init();
	}
]);
