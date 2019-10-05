angular.module('sntRover').controller('rvCardContractsLinkingCtrl', ['$scope', 'rvCompanyCardContractsSrv',
	function($scope, rvCompanyCardContractsSrv) {
        
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
        };
        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the searchResults]
         */
        $scope.clickedOnResult = function( index ) {
            $scope.contractData.linkContractsSearch.results[index]
            // API: /api/contracts/link_contract
            /*
                {
                    "id": 123, // contract id
                    "account_id": 1
                }

            */
        };
        /* 
         *  Handle click Unlink contracts.
         */
        $scope.clickedUnlinkContracts = function( index ) {
            /*
            API: /api/contracts/unlink_contract
                Method: POST
                Request:

                {
                    "id": 123, // contract id
                    "account_id": 1
                }



            */
        };

        that.initialise();
    }
]);