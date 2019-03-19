sntRover.controller('companyTravelAgentMandatoryFieldsController',
    ['$scope', '$timeout', 'RVCompanyCardSrv',
    function($scope, $timeout, RVCompanyCardSrv) {

        BaseCtrl.call(this, $scope);
        /*
         * Void Bill 
         * @param voidType type void or void_and_repost
         */
        // $scope.voidBill = function(voidType) {

        //     var successCallBackOfVoidBill = function(data) {
        //             $scope.$emit("VOID_BILL_GENERATED", data.bills);
        //         },
        //         paramsToService = {
        //             'bill_id': ($scope.isFromAccounts) ? $scope.transactionsDetails.bills[$scope.currentActiveBill].bill_id : $scope.reservationBillData.bills[$scope.currentActiveBill].bill_id,
        //             'data': {
        //                 "void_type": voidType,
        //                 "void_reason": $scope.voidData.reason
        //             }
        //         },
        //         options = {
        //             params: paramsToService,
        //             successCallBack: successCallBackOfVoidBill
        //         };
                        
        //     $scope.callAPI( RVBillCardSrv.generateVoidBill, options );

        // };  

}]);