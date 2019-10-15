angular.module('sntRover').controller('rvCardContractsMainCtrl', ['rvPermissionSrv', '$rootScope', '$scope', 'rvCompanyCardContractsSrv', '$stateParams',
	function(rvPermissionSrv, $rootScope, $scope, rvCompanyCardContractsSrv, $stateParams) {

		BaseCtrl.call(this, $scope);

		/**
		 * Initialize contract object
		 */
		var init = function() {
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
				accountId: '',
				hasEditAccessCodePermission: rvPermissionSrv.getPermissionValue('EDIT_CONTRACT_ACCESS_CODE'),
				hasDeleteContractPermission: rvPermissionSrv.getPermissionValue('DELETE_CONTRACT'),
				linkContractsSearch: {
					query: '',
					results: []
				}
			};
		},
		that = this;

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
		 * success callback for fetch contracts
		 * @param {Object} - accepts the API response as parameter
		 * @return void
		 */
		fetchContractsListSuccessCallback = function(data, params) {
			var currentContracts = data.current_contracts || [],
				pastContracts = data.history_contracts || [],
				futureContracts = data.future_contracts || [];

			setErrorMessage([]);
			setSideListCount(currentContracts, futureContracts, pastContracts);

			if (currentContracts.length !== 0 || pastContracts.length !== 0 || futureContracts.length !== 0) {
				if (params.action === 'UNLINK' || $scope.contractData.selectedContract === '') {
					$scope.contractData.selectedContract = data.contract_selected || '';
				}
				$scope.contractData.mode = 'EDIT';
				$scope.contractData.noContracts = false;
				that.fetchContractDetails($scope.contractData.selectedContract);
			}
			else {
				// Reset the data object
				init();
			}
			if ($scope.contractData.selectedContract !== '' && $scope.contractData.mode !== '') {
				refreshContractScrollers();
			}
		},
		/**
		 * Success callback for contract detail fetch
		 * @param {Object} data - API response of detail fetch
		 */
		fetchContractDetailsSuccessCallback = function(data) {
			$scope.contractData.editData = data;
			$scope.contractData.selectedRateList = data.contract_rates;
			$scope.contractData.disableFields = data.end_date < $rootScope.businessDate;
			$scope.$broadcast('addDataReset');
			$scope.$broadcast('refreshEditScroller');
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

			$scope.callAPI(rvCompanyCardContractsSrv.fetchContractsDetails, options);
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
		 * Function fetches the contracts on page load
		 */
		that.fetchContracts = function( action ) {
			$scope.contractData.accountId = $stateParams.id === "add" ? $scope.contactInformation.id : $stateParams.id;
			var options = {
				successCallBack: fetchContractsListSuccessCallback,
				failureCallBack: fetchContractsListFailureCallback,
				successCallBackParameters: {
					'action': action
				},
				params: {
					"account_id": $scope.contractData.accountId
				}
			};

			if ($scope.contractData.accountId !== undefined) {
				$scope.callAPI(rvCompanyCardContractsSrv.fetchContractsList, options);
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
		$scope.addListener('fetchContractsList', function(event, action) {
			that.fetchContracts(action);
		});

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
		 * Listener for updating contracted nights
		 */
		$scope.addListener('updateContractedNights', function(event, data) {
			var saveContractNightsSuccessCallback = function() {
                setErrorMessage([]);
            },
            saveContractNightsFailureCallback = function(error) {
                setErrorMessage(error);
            },
            accountId;
    
            if ($stateParams.id === "add") {
                accountId = $scope.contactInformation.id;
            }
            else {
                accountId = $stateParams.id;
            }
    
            var options = {
                    successCallBack: saveContractNightsSuccessCallback,
                    failureCallBack: saveContractNightsFailureCallback,
                    params: {
                        "account_id": accountId,
                        "contract_id": $scope.contractData.selectedContract,
                        "postData": {'occupancy': data}
                    }
                };
            
            $scope.callAPI(rvCompanyCardContractsSrv.updateNight, options);
		});

		/**
		 * Function to load the new contracts form
		 */
		$scope.createFirstContract = function() {
			$scope.contractData.mode = 'ADD';
			$scope.contractData.noContracts = false;
			refreshContractScrollers();
		};

		/**
		 * Function to load Link Contracts screen.
		 */
		$scope.moveToLinkContract = function() {
			$scope.contractData.mode = 'LINK';
			$scope.contractData.noContracts = false;
			refreshContractScrollers();
		};
		
		init();
		that.fetchContracts();
	}
]);
