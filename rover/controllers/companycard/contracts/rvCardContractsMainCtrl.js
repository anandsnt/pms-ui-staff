angular.module('sntRover').controller('rvCardContractsMainCtrl', ['$rootScope', '$scope', 'RVCompanyCardSrv', '$stateParams', 'ngDialog',
	function($rootScope, $scope, RVCompanyCardSrv, $stateParams, ngDialog) {

		BaseCtrl.call(this, $scope);
		$scope.contractData = {
			mode: '',
			contractsList: [],
			editData: {},
			disableFields: false,
			noContracts: true,
			noStatistics: true,
			selectedContract: '',
			rateSearchResult: [],
			rateSearchQuery: '',
			selectedRateList: [],
			selectedRateIdList: [],
			accountId: $stateParams.id === "add" ? $scope.contactInformation.id : $stateParams.id,
			showNightsModal: false,
			selectedContract: ''
		};
		var that = this;

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
			setSideListCount(currentContracts, futureContracts, pastContracts);

			if (currentContracts.length !== 0 || pastContracts.length !== 0 || futureContracts.length !== 0) {
				if ($scope.contractData.mode === '') {
					$scope.contractData.selectedContract = data.contract_selected || '';
				}
				// EDIT contract flow
				$scope.contractData.mode = 'EDIT';
				$scope.contractData.noContracts = false;
				that.fetchContractDetails($scope.contractData.selectedContract);
			}
			if ($scope.contractData.selectedContract !== '') {
				refreshContractScrollers();
			}
		},
		/**
		 * Success callback for contract detail fetch
		 * @param {Object} data - API response of detail fetch
		 */
		fetchContractDetailsSuccessCallback = function(data) {
			$scope.contractData.editData = data;
			$scope.contractData.disableFields = data.end_date < $rootScope.businessDate;
			if ($scope.contractData.showNightsModal) {
				ngDialog.open({
					template: '/assets/partials/companyCard/contracts/rvContractedNightsPopup.html',
					controller: 'rvContractedNightsCtrl',
					className: '',
					scope: $scope
				});
				$scope.contractData.showNightsModal = false;
			}
			$scope.$broadcast('addDataReset');
		},
		/**
		 * Failure callback for contracts detail fetch
		 * @param {Array} error - array of errors
		 */
		fetchContractDetailsFailureCallback = function(error) {
			setErrorMessage(error);
			$scope.$broadcast('addDataReset');
		};

		/**
		 * Function to fetch the currently selected contract details
		 */
		that.fetchContractDetails = function(contractId) {
			var accountId;

			$scope.contractData.selectedContract = contractId;
			if ($stateParams.id === "add") {
				accountId = $scope.contactInformation.id;
			} else {
				accountId = $stateParams.id;
			}
			var options = {
				successCallBack: fetchContractDetailsSuccessCallback,
				failureCallback: fetchContractDetailsFailureCallback,
				params: {
					"account_id": accountId,
					"contract_id": contractId
				}
			};

			$scope.callAPI(RVCompanyCardSrv.fetchContractsDetails, options);
		};
		/*
		 * Failure callback for contracts fetch API
		 * @param {String} response - error message
		 * @return void
		 */
		var fetchContractsListFailureCallback = function(response) {
			setErrorMessage(response);
		};

		/**
		 * Init function fetches the contracts on page load
		 */
		that.init = function() {
			var options = {
				successCallBack: fetchContractsListSuccessCallback,
				failureCallBack: fetchContractsListFailureCallback,
				params: {
					"account_id": $stateParams.id
				}
			};

			if ($stateParams.id !== 'add') {
				$scope.callAPI(RVCompanyCardSrv.fetchContractsList, options);
			}
		};

		/**
		 * Refresh the appropriate scroller based on mode
		 */
		var refreshContractScrollers = function() {
			if ($scope.contractData.mode === 'ADD') {
				$scope.$broadcast('refreshAddScroller');
			} 
			else if ($scope.contractData.mode === 'EDIT') {
				$scope.$broadcast('refreshEditScroller');
				$scope.$broadcast('initContractsList');
			}
		};

		/**
		 * Listener to call on new contracts form closure
		 */
		$scope.addListener('fetchContractsList', that.init);

		/**
		 * Listener for fetch event from the contract list 
		 */
		$scope.addListener('fetchContract', function(event, data) {
			that.fetchContractDetails(data);
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

		that.init();
	}
]);
