angular.module('sntRover').controller('rvCardSearchContractOwnerCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout',
	function($scope, rvCompanyCardContractsSrv, $timeout) {
        
        BaseCtrl.call(this, $scope);
        var that = this,
            SCROLL_DELAY = 500;

        that.initialise = function() {
            $scope.contractData.contractOwner.expand = false;
            $scope.contractData.contractOwner.results = [];
            $scope.contractData.contractOwner.selectedOwner = {};
            $scope.setScroller('searchResultsOwnerList');
        };

        // Handle refresh scroll
        that.refreshSearchList = function() {
            $timeout(function() {
                $scope.refreshScroller('searchResultsOwnerList');
            }, SCROLL_DELAY);
        };

        /* 
         *  Handle API call to fetch contract rates.
         */
        that.fetchOwners = function() {
            var fetchOwnersSuccessCallback = function(data) {
                $scope.contractData.contractOwner.results = data;
                $scope.$emit('refreshContractsScroll');
                that.refreshSearchList();
            },
            fetchOwnersFailureCallback = function(errorMessage) {
                $scope.$emit('setErrorMessage', errorMessage);
            },
            accountId = !_.isEmpty($scope.contactInformation) ? $scope.contactInformation.id : $stateParams.id;

            var options = {
                successCallBack: fetchOwnersSuccessCallback,
                failureCallBack: fetchOwnersFailureCallback,
                params: {
                    'query': $scope.contractData.contractOwner.query,
                    'is_inactive': $scope.contractData.contractOwner.isInactive
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.fetchOwners, options);
        };

        // Handle rate search.
        $scope.searchOwner = function() {
            if ($scope.contractData.contractOwner.query.length > 2) {
                that.fetchOwners();
            }
            else {
                $scope.contractData.contractOwner.results = [];
            }
        };
        // Handle clear search.
        $scope.clearQuery = function() {
            $scope.contractData.contractOwner.query = '';
            $scope.contractData.contractOwner.results = [];
            $scope.$emit('refreshContractsScroll');
        };
        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the results]
         */
        $scope.clickedOnResult = function( index ) {
            if (index === 'NO_OWNER') {
                $scope.contractData.contractOwner.selectedOwner = {};
            }
            else {
                $scope.contractData.contractOwner.selectedOwner = $scope.contractData.contractOwner.results[index];
            }
            $scope.clearQuery();
            $scope.contractData.contractOwner.expand = false;
        };

        $scope.clickedOwner = function() {
            $scope.contractData.contractOwner.expand = !$scope.contractData.contractOwner.expand;
            if ($scope.contractData.contractOwner.expand) {
                $scope.clearQuery();
                $scope.contractData.contractOwner.isInactive = false;
            }
            $scope.$emit('refreshContractsScroll');
        };

        $scope.clickedInactive = function() {
            $scope.contractData.contractOwner.isInactive = !$scope.contractData.contractOwner.isInactive;
        };

        that.initialise();
    }
]);
