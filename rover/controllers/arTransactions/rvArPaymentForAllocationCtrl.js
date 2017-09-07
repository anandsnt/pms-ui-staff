sntRover.controller('RVArPaymentForAllocationController', ['$scope', '$rootScope','$stateParams',  'rvAccountsArTransactionsSrv', 'ngDialog', function($scope, $rootScope, $stateParams, rvAccountsArTransactionsSrv, ngDialog ) {

    BaseCtrl.call(this, $scope);
    //Initialization
    var init = function(){
        fetchPaymentMethods();
    };
    //Function to fetch payment methods
    var fetchPaymentMethods = function(){
        var dataToApi = {
            id: $stateParams.id
        };
        $scope.invokeApi(rvAccountsArTransactionsSrv.fetchPaymentMethods, dataToApi, (data) => {
            $scope.payments = data.payments;
            $scope.$emit('hideLoader');
        } );
    };
    //Close popup
    $scope.closePopup = function () {
        ngDialog.close();
    };

    init();

}]);
