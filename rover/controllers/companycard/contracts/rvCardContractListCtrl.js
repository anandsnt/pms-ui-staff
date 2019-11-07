angular.module('sntRover').controller('rvCardContractListCtrl', ['$timeout', '$scope', 'rvCompanyCardContractsSrv',
	function($timeout, $scope, rvCompanyCardContractsSrv) {
        BaseCtrl.call(this, $scope);
        $scope.setScroller('contractListScroller');
        var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('contractListScroller');
			}, 500);
		};
        var init = function() {
            var openedContract = $scope.contractData.selectedContractId,
                contractsList = $scope.contractData.contractsList;

            angular.forEach(contractsList, function(item) {
                item.opened = false;
                angular.forEach(item.contracts, function(contract) {
                    if (openedContract === contract.id) {
                        item.opened = true;
                    }
                });
            });
            refreshScroller();
        };

        // Clear Rate search.
        var clearRateSearchBox = function() {
            // Reset Contract Rate Search Component.
            $scope.contractData.selectedRateList = [];
            $scope.contractData.rateSearchQuery = '';
        },
        // Clear Rate search.
        clearContractLinkSearchBox = function() {
            // Reset Contract Link Search Component.
            $scope.contractData.linkContractsSearch.query = '';
            $scope.contractData.linkContractsSearch.results = [];
        };

        /**
         * Open the selected contracts list
         * @param {String} listType - PAST, PRESENT, FUTURE string values
         */
        $scope.openContractsList = function(item) {
            item.opened = !item.opened;
            refreshScroller();
        };
        /**
         * Fetch selected contract deatails
         * @param {Number} contractId - ID of the selected contract
         */
        $scope.fetchDetails = function(contractId) {
            if (contractId !== $scope.contractData.selectedContractId || $scope.contractData.mode !== 'EDIT') {
                $scope.contractData.mode = 'EDIT';
                clearRateSearchBox();
                clearContractLinkSearchBox();
                $scope.$emit('fetchContract', contractId);
            }
        };
        /**
         * Function for adding a new contract
         */
        $scope.newContract = function() {
            $scope.contractData.mode = 'ADD';
            clearRateSearchBox();
            clearContractLinkSearchBox();
            $scope.$emit('refreshContractsScroll');
        };

        /**
         * Function for linking existing contracts.
         */
        $scope.linkContract = function() {
            $scope.contractData.mode = 'LINK';
            clearRateSearchBox();
            clearContractLinkSearchBox();
        };

        // Handle unlink Contract
        $scope.clickedUnlinkContracts = function() {
            var unLinkContractSuccessCallback = function() {
                $scope.$emit('fetchContractsList', 'UNLINK');
            },
            unLinkContractFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            };

            var options = {
                successCallBack: unLinkContractSuccessCallback,
                failureCallBack: unLinkContractFailureCallback,
                params: {
                    "id": $scope.contractData.selectedContractId,
                    "account_id": $scope.contractData.accountId
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.unLinkContract, options);
        };

        /**
         * Listener for initializing the contracts list
         */
        $scope.addListener('initContractsList', init);
    }
]);
