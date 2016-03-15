sntRover.controller('rvBillFormatPopupCtrl',['$scope','$rootScope','$filter','RVBillCardSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillCardSrv, ngDialog){

    var getBillSettingsInfoRequestParams = function() {
        var params = {};
        if($scope.reservationBillData && $scope.reservationBillData.reservation_id) {
            params.id = $scope.reservationBillData.reservation_id;
            params.is_type = "Reservation";
        } else {
            if (!!$scope.groupConfigData) {
                params.id = $scope.groupConfigData.summary.group_id;
                params.is_group = true;
                params.is_type = "Account";

            } else {
                params.id = $scope.accountConfigData.summary.posting_account_id;
                params.is_group = false;
                params.is_type = "Account";
            }

        }
        params.bill_no = $scope.billNo;

        return params;

    };
    var fetchBillSettingsInfo = function() {
        var params = getBillSettingsInfoRequestParams();
        var onBillSettingsInfoFetchSuccess = function(response) {
            $scope.$emit('hideLoader');
            $scope.data = response.data;
        };
        $scope.invokeApi(RVBillCardSrv.getBillSettingsInfo,params,onBillSettingsInfoFetchSuccess);
    };

    var getPrintEmailRequestParams = function() {
        var params = {};

        if($scope.reservationBillData && $scope.reservationBillData.reservation_id) {
            params.reservation_id = $scope.reservationBillData.reservation_id;
        } else {
            if (!!$scope.groupConfigData) {
                params.group_id = $scope.groupConfigData.summary.group_id;
                params.is_group = true;
            } else {
                params.account_id = $scope.accountConfigData.summary.posting_account_id;
                params.is_group = false;
            }

        }
        params.bill_number = $scope.billNo;

        return params;
    };

    $scope.printBill = function() {
        var printRequest = getPrintEmailRequestParams();
        printRequest.bill_layout = $scope.data.default_bill_settings;
        $scope.clickedPrint(printRequest);
    };

    $scope.emailBill = function() {
        var emailRequest = getPrintEmailRequestParams();
        emailRequest.bill_layout = $scope.data.default_bill_settings;
        emailRequest.to_address = $scope.data.to_address;
        $scope.clickedEmail(emailRequest);
    };

    $scope.closeDialog = function() {
        ngDialog.close();
    };

    var init = function() {
        $scope.data = {};
        fetchBillSettingsInfo();
    };
    init();

}]);