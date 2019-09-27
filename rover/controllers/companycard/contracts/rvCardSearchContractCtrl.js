angular.module('sntRover').controller('rvCardSearchContractCtrl', ['$scope', 'rvCompanyCardContractsSrv',
	function($scope, rvCompanyCardContractsSrv) {
        BaseCtrl.call(this, $scope);

        $scope.contractData.searchResults = [];
        if ($scope.contractData.mode === 'ADD') {
            $scope.contractData.selectedRateList = [];
        }
        else {
            $scope.contractData.selectedRateList = $scope.contractData.contract_rates;
        }

        var fetchRateContract = function(contractId) {
            var fetchRateContractSuccessCallback = function(data) {
                $scope.contractData.searchResults = data.contract_rates;
            };

            var options = {
                successCallBack: fetchRateContractSuccessCallback,
                params: {
                    "account_id": $scope.contractData.accountId,
                    "query": $scope.contractData.rateSearchQuery
                }
            };

            $scope.callAPI(rvCompanyCardContractsSrv.fetchRateContract, options);
        };

        $scope.searchRate = function() {
            console.log("search", $scope.contractData.rateSearchQuery);
            fetchRateContract();
        };

        $scope.clearQuery = function() {
            console.log("search", $scope.contractData.rateSearchQuery);
            $scope.contractData.rateSearchQuery = '';
        };

        $scope.clickedOnResult = function( index ) {
            console.log('clickedOnResult', $scope.contractData.searchResults[index]);
        };

        $scope.removeRate = function( index ) {
            console.log("removeRate", $scope.contractData.selectedRateList[index]);
        };
    }
]);