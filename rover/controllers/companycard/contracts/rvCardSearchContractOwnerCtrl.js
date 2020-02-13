angular.module('sntRover').controller('rvCardSearchContractOwnerCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout', '$stateParams',
	function($scope, rvCompanyCardContractsSrv, $timeout, $stateParams) {
        
        BaseCtrl.call(this, $scope);
        var that = this,
            SCROLL_DELAY = 500;

        that.initialise = function() {
            $scope.contractData.contractOwner.results = [];
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
                    'account_id': accountId
                }
            };
            
            if ($scope.contractData.mode === 'EDIT') {
                options.params.id = $scope.contractData.selectedContractId;
            }
            $scope.callAPI(rvCompanyCardContractsSrv.fetchOwners, options);
        };
        
        // Handle click on inactive checkbox.
        $scope.clickedInactive = function() {
            $scope.contractData.contractOwner.isInactive = !$scope.contractData.contractOwner.isInactive;
        };

        that.initialise();
        that.fetchOwners();
    }
]);
