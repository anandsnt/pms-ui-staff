angular.module('sntRover').controller('rvCardSearchContractedRateCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout',
	function($scope, rvCompanyCardContractsSrv, $timeout) {
        
        BaseCtrl.call(this, $scope);
        var that = this;

        that.initialise = function() {
            $scope.contractData.searchResults = [];
            $scope.setScroller('searchResultsList');
        };

        // Handle refresh scroll
        that.refreshSearchList = function() {
            $timeout(function() {
                $scope.refreshScroller('searchResultsList');
            }, 500);
        };

        /* 
         *  Handle API call to fetch contract rates.
         */
        that.fetchRateContract = function() {
            var fetchRateContractSuccessCallback = function(data) {
                $scope.contractData.searchResults = data.contract_rates;
                $scope.$emit('refreshContractsScroll');
                that.refreshSearchList();
            },
            fetchRateContractFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            };

            var options = {
                successCallBack: fetchRateContractSuccessCallback,
                failureCallBack: fetchRateContractFailureCallback,
                params: {
                    'query': $scope.contractData.rateSearchQuery,
                    'selected_rate_ids': _.pluck($scope.contractData.selectedRateList, 'id')
                }
            };

            if ($scope.contractData.mode === 'EDIT') {
                options.params.contract_id = $scope.contractData.selectedContractId;
            }

            $scope.callAPI(rvCompanyCardContractsSrv.fetchRateContract, options);
        };

        // Handle rate search.
        $scope.searchRate = function() {
            if ($scope.contractData.rateSearchQuery.length > 1) {
                that.fetchRateContract();
            }
        };
        // Handle clear search.
        $scope.clearQuery = function() {
            $scope.contractData.rateSearchQuery = '';
        };
        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the searchResults]
         */
        $scope.clickedOnResult = function( index ) {
            $scope.contractData.selectedRateList.push($scope.contractData.searchResults[index]);
            $scope.$emit('refreshContractsScroll');
            $scope.contractData.searchResults = [];
            $scope.contractData.rateSearchQuery = '';
        };
        /* 
         *  Handle click(for remove) on each item in the selected rate list
         *  @params {Number} [index of the selected rate list]
         */
        $scope.removeRate = function( index ) {
            var clickedItem = $scope.contractData.selectedRateList[index];

            // get index of object with id:37
            var removeIndex = $scope.contractData.selectedRateList.map(function(item) { 
                                return item.id; 
                            }).indexOf(clickedItem.id);

            // remove object
            $scope.contractData.selectedRateList.splice(removeIndex, 1);
        };

        that.initialise();
    }
]);
