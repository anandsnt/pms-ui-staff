angular.module('sntRover').controller('rvCardSearchContractOwnerCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout',
	function($scope, rvCompanyCardContractsSrv, $timeout) {
        
        BaseCtrl.call(this, $scope);
        var that = this,
            SCROLL_DELAY = 500;

        that.initialise = function() {
            $scope.contractData.expandOwner = false;
            $scope.contractData.searchResults = [];
            $scope.setScroller('searchResultsList');
        };

        // Handle refresh scroll
        that.refreshSearchList = function() {
            $timeout(function() {
                $scope.refreshScroller('searchResultsList');
            }, SCROLL_DELAY);
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
            },
            accountId = !_.isEmpty($scope.contactInformation) ? $scope.contactInformation.id : $stateParams.id;

            var options = {
                successCallBack: fetchRateContractSuccessCallback,
                failureCallBack: fetchRateContractFailureCallback,
                params: {
                    'query': $scope.contractData.rateSearchQuery,
                    'selected_rate_ids': _.pluck($scope.contractData.selectedRateList, 'id'),
                    'account_id': accountId
                }
            };

            if ($scope.contractData.mode === 'EDIT') {
                options.params.contract_id = $scope.contractData.selectedContractId;
            }

            $scope.callAPI(rvCompanyCardContractsSrv.fetchRateContract, options);
        };

        // Handle rate search.
        $scope.searchRate = function() {
            if ($scope.contractData.rateSearchQuery.length > 2) {
                that.fetchRateContract();
            }
            else {
                $scope.contractData.searchResults = [];
            }
        };
        // Handle clear search.
        $scope.clearQuery = function() {
            $scope.contractData.rateSearchQuery = '';
            $scope.contractData.searchResults = [];
            $scope.$emit('refreshContractsScroll');
        };
        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the searchResults]
         */
        $scope.clickedOnResult = function( index ) {
            var clickedItem = $scope.contractData.searchResults[index],
            linkRateSuccessCallback = function() {
                $scope.contractData.selectedRateList.push(clickedItem);
                $scope.$emit('refreshContractsScroll');
                $scope.contractData.searchResults = [];
                $scope.contractData.rateSearchQuery = '';
            },
            linkRateFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            },
            accountId = !_.isEmpty($scope.contactInformation) ? $scope.contactInformation.id : $stateParams.id;

            var options = {
                successCallBack: linkRateSuccessCallback,
                failureCallBack: linkRateFailureCallback,
                params: {
                    "id": $scope.contractData.selectedContractId,
                    "rate_id": clickedItem.id,
                    "account_id": accountId
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.linkRate, options);
        };

        // Unlink a Rate after confirmation popup.
        $scope.confirmRemoveRate = function( rateId ) {
            
            var unlinkRateSuccessCallback = function() {
                var removeIndex = $scope.contractData.selectedRateList.map(function(item) { 
                                    return item.id; 
                                }).indexOf(rateId);

                $scope.contractData.selectedRateList.splice(removeIndex, 1);
                $scope.$emit('refreshContractsScroll');
            },
            unlinkRateFailureCallback = function( errorMessage ) {
                showErrorMessagePopup(errorMessage);
            },
            accountId = !_.isEmpty($scope.contactInformation) ? $scope.contactInformation.id : $stateParams.id;

            var options = {
                successCallBack: unlinkRateSuccessCallback,
                failureCallBack: unlinkRateFailureCallback,
                params: {
                    "id": $scope.contractData.selectedContractId,
                    "rate_id": rateId,
                    "account_id": accountId
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.unlinkRate, options);
        };

        $scope.clickedOwner = function() {
            $scope.contractData.expandOwner = !$scope.contractData.expandOwner;
        };

        that.initialise();
    }
]);
