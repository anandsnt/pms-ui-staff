angular.module('sntRover').controller('rvCardContractListCtrl', ['$timeout', '$scope',
	function($timeout, $scope) {
        BaseCtrl.call(this, $scope);
        $scope.selectedType = '';
        $scope.opened = false;
        $scope.setScroller('contractListScroller');
        var refreshScroller = function() {
			$timeout(function() {
				$scope.refreshScroller('contractListScroller');
			}, 500);
		};
        var init = function() {
            var openedContract = $scope.contractData.selectedContract,
                contractsList = $scope.contractData.contractsList;

            angular.forEach(contractsList, function(item) {
                angular.forEach(item.contracts, function(contract) {
                    if (openedContract === contract.id) {
                        $scope.selectedType = item.type;
                        $scope.opened = true;
                    }
                });
            });
            refreshScroller();
        };

        /**
         * Open the selected contracts list
         * @param {String} listType - PAST, PRESENT, FUTURE string values
         */
        $scope.openContractsList = function(listType) {
            if ($scope.opened) {
                $scope.opened = $scope.selectedType !== listType;
            } else {
                $scope.opened = true;
            }
            $scope.selectedType = listType;
            refreshScroller();
        };
        /**
         * Fetch selected contract deatails
         * @param {Number} contractId - ID of the selected contract
         */
        $scope.fetchDetails = function(contractId) {
            $scope.contractData.mode = 'EDIT';
            $scope.$emit('fetchContract', contractId);
        };
        /**
         * Function for adding a new contract
         */
        $scope.newContract = function() {
            $scope.contractData.mode = 'ADD';
            $scope.contractData.editData = {};
            $scope.contractData.selectedRateList = [];
            $scope.contractData.rateSearchQuery = '';
            $scope.$emit('refreshContractsScroll');
        };

        /**
         * Listener for initializing the contracts list
         */
        $scope.addListener('initContractsList', init);
    }
]);