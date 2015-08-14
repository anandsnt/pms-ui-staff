sntRover.controller('RVArTransactionsAddCreditsController',['$scope','$rootScope','ngDialog','dateFilter','RVCompanyCardSrv',function($scope,$rootScope,ngDialog,dateFilter,RVCompanyCardSrv){

    //inheriting some useful things
    BaseCtrl.call(this, $scope);

    $scope.existingCreditAmount = $scope.arTransactionDetails.available_credit;
    $scope.addedCreditAmount = '';
    $scope.selectedSymbol = '+';

    // save button click to update credit amount
    $scope.savebuttonClick = function(){

        var addCreditAmountSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = "";
            ngDialog.close();

            var credits = parseFloat(data.available_credit).toFixed(2);
            if(credits === '-0.00') {
                credits = parseFloat('0.00').toFixed(2);
            }

            $scope.arTransactionDetails.amount_owing = parseFloat(data.amount_owing).toFixed(2);
            $scope.arTransactionDetails.available_credit = credits;
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

        var totalCreditAmount = parseFloat(parseFloat($scope.existingCreditAmount) + parseFloat($scope.selectedSymbol + $scope.addedCreditAmount)).toFixed(2);
        if(totalCreditAmount === '-0.00') {
            totalCreditAmount = parseFloat('0.00').toFixed(2);
        }

        $scope.totalCreditAmount = totalCreditAmount;
    };



}]);
