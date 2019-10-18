angular.module('sntRover').controller('rvCardContractListCtrl', ['$timeout', '$scope',
	function($timeout, $scope) {
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
                // Reset Contract Link Search Component.
                $scope.contractData.linkContractsSearch.query = '';
                $scope.contractData.linkContractsSearch.results = [];
                $scope.$emit('fetchContract', contractId);
            }
        };
        /**
         * Function for adding a new contract
         */
        $scope.newContract = function() {
            $scope.contractData.mode = 'ADD';
            // Reset Contract Rate Search Component.
            $scope.contractData.selectedRateList = [];
            $scope.contractData.rateSearchQuery = '';
            // Reset Contract Link Search Component.
            $scope.contractData.linkContractsSearch.query = '';
            $scope.contractData.linkContractsSearch.results = [];
            $scope.$emit('refreshContractsScroll');
        };

        /**
         * Function for linking existing contracts.
         */
        $scope.linkContract = function() {
            $scope.contractData.mode = 'LINK';
        };

        /**
         * Listener for initializing the contracts list
         */
        $scope.addListener('initContractsList', init);
    }
]);
