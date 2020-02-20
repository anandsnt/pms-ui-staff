angular.module('sntRover').controller('rvCardSearchContractOwnerCtrl', ['$scope', 'rvCompanyCardContractsSrv', '$timeout', '$stateParams',
	function($scope, rvCompanyCardContractsSrv, $timeout, $stateParams) {
        
        BaseCtrl.call(this, $scope);
        var that = this;

        /* 
         *  Handle API call to fetch contract rates.
         */
        that.fetchOwners = function() {
            $scope.contractData.contractOwner.results = [];
            var fetchOwnersSuccessCallback = function(data) {
                $scope.contractData.contractOwner.results = data;
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
            
            $scope.callAPI(rvCompanyCardContractsSrv.fetchOwners, options);
        };
        
        // Handle click on inactive checkbox.
        $scope.clickedInactive = function() {
            $scope.contractData.contractOwner.isInactive = !$scope.contractData.contractOwner.isInactive;
        };

        /* 
         *  Handle click on each item in the result list
         *  @params {Number} [index of the results]
         */
        $scope.clickedOnResult = function( item ) {
            if (typeof item === 'undefined') {
                $scope.contractData.contractOwner.selectedOwner = {};
            }
            else {
                $scope.contractData.contractOwner.selectedOwner = item;
            }
        };

        $scope.checkNoContract = function() {
            var isNoContractOwner = false,
                selectedOwner = $scope.contractData.contractOwner.selectedOwner;

            if (contractData.contractOwner.results.length === 0 || selectedOwner.id === null || selectedOwner.id === '') {
                isNoContractOwner = true;
            }

            return isNoContractOwner;
        };
        
        // Fetch owner details for ADD mode.
        if ($scope.contractData.mode === 'ADD') {
            that.fetchOwners();
        }
    }
]);
