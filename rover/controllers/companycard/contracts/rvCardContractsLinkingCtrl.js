angular.module('sntRover').controller('rvCardContractsLinkingCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout', '$stateParams',
	function($scope, rvCompanyCardContractsSrv, $timeout, $stateParams) {
        
        BaseCtrl.call(this, $scope);
        var that = this;

        that.initialise = function() {
            $scope.contractData.linkContractsSearch.results = [];
            $scope.setScroller('searchContractsResultsList');
        };

        // Handle refresh scroll
        that.refreshSearchList = function() {
            $timeout(function() {
                $scope.refreshScroller('searchContractsResultsList');
            }, 500);
        };

        /* 
         *  Handle API call to fetch contract rates.
         */
        that.fetchContractsForLinking = function() {
            var fetchContractsForLinkingSuccessCallback = function(data) {
                $scope.contractData.linkContractsSearch.results = data.contracts;
                $scope.$emit('searchContractsResultsList');
                that.refreshSearchList();
            },
            fetchContractsForLinkingFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            };

            $scope.contractData.accountId = $stateParams.id === "add" ? $scope.contactInformation.id : $stateParams.id;
            var options = {
                successCallBack: fetchContractsForLinkingSuccessCallback,
                failureCallBack: fetchContractsForLinkingFailureCallback,
                params: {
                    "account_id": $scope.contractData.accountId,
                    "query": $scope.contractData.linkContractsSearch.query
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.fetchContractsForLinking, options);
        };

        // Handle rate search.
        $scope.searchContracts = function() {
            if ($scope.contractData.linkContractsSearch.query.length > 2) {
                that.fetchContractsForLinking();
            }
        };
        // Handle clear search.
        $scope.clearQuery = function() {
            $scope.contractData.linkContractsSearch.query = '';
            $scope.contractData.linkContractsSearch.results = [];
        };
        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the searchResults]
         */
        $scope.clickedOnResult = function( index ) {
            var clickedItem = $scope.contractData.linkContractsSearch.results[index];

            var linkContractSuccessCallback = function() {
                //clickedItem.is_already_linked = true;
                $scope.contractData.selectedContractId = clickedItem.id;
                $scope.contractData.linkContractsSearch.query = '';
                $scope.$emit('fetchContractsList');
            },
            linkContractFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            };

            var options = {
                successCallBack: linkContractSuccessCallback,
                failureCallBack: linkContractFailureCallback,
                params: {
                    "id": clickedItem.id,
                    "account_id": $scope.contractData.accountId
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.linkContract, options);
        };

        // Handle Cancel Search
        $scope.cancelSearch = function() {
            if ($scope.contractData.noContracts) {
                $scope.contractData.mode = '';
            }
            else {
                $scope.contractData.mode = 'EDIT';
            }
        };
        
        that.initialise();
    }
]);