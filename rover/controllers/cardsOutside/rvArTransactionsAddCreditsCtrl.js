sntRover.controller('RVArTransactionsAddCreditsController',['$scope','$rootScope','ngDialog','dateFilter','RVCompanyCardSrv',function($scope,$rootScope,ngDialog,dateFilter,RVCompanyCardSrv){

    //inheriting some useful things
    BaseCtrl.call(this, $scope);
    
    $scope.existingCreditAmount = $scope.arTransactionDetails.available_credit;
    $scope.addedCreditAmount = '';

    // save button click to update credit amount
    $scope.savebuttonClick = function(){

        var addCreditAmountSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.arTransactionDetails.amount_owing = data.amount_owing;
            $scope.arTransactionDetails.available_credit = data.available_credit;
        };

        var failure = function(errorMessage){
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        var params = {
            'id': $scope.filterData.id,
            'amount' : $scope.addedCreditAmount,
            'symbol' : $scope.selectedSymbol
        };

        $scope.invokeApi(RVCompanyCardSrv.addCreditAmount, params, addCreditAmountSuccess, failure);
    };
    
    // upon entering credit amount
    $scope.addCreditAmount = function(){
        
        $scope.totalCreditAmount = parseFloat(parseFloat($scope.existingCreditAmount) + parseFloat($scope.addedCreditAmount)).toFixed(2);
    };

   

}]);
