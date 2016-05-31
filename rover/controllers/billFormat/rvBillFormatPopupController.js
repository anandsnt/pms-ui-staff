sntRover.controller('rvBillFormatPopupCtrl',['$scope','$rootScope','$filter','RVBillCardSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillCardSrv, ngDialog){

    BaseCtrl.call(this, $scope);
    $scope.isCompanyCardInvoice = true;
    $scope.disableCompanyCardInvoice = false;
    $scope.hideCompanyCardInvoiceToggle = true;

    /*
    *  Get the request params for bill settings info
    */
    var getBillSettingsInfoRequestParams = function() {
        var params = {};
        if($scope.reservationBillData && $scope.reservationBillData.reservation_id) {
            params.id = $scope.reservationBillData.reservation_id;
            params.is_type = "Reservation";
        } else {
            $scope.hideCompanyCardInvoiceToggle = false;
            if (!!$scope.groupConfigData) {
                params.id = $scope.groupConfigData.summary.group_id;
                params.is_group = true;
                params.is_type = "Account";

                var card = $scope.groupConfigData.summary;
                if(!!card.company.name && !!card.travel_agent.name && card.company.name !== '' && card.travel_agent.name !== ''){
                    // Both cards are attached.
                }
                else if(card.company.name === '' && card.travel_agent.name === ''){
                    // Both cards are not attached.
                    $scope.hideCompanyCardInvoiceToggle = true;
                }
                else if(card.company.name === '' && card.travel_agent.name !== ''){
                    // Only TA card is attached.
                    $scope.isCompanyCardInvoice = false;
                    $scope.disableCompanyCardInvoice = true;
                }
                else{
                    // Only Company card is attached.
                    $scope.disableCompanyCardInvoice = true;
                }

            } else {
                params.id = $scope.accountConfigData.summary.posting_account_id;
                params.is_group = false;
                params.is_type = "Account";

                var card = $scope.accountConfigData.summary;
                if(!!card.company.name && !!card.travel_agent.name && card.company.name !== '' && card.travel_agent.name !== ''){
                    // Both cards are attached.
                }
                else if(card.company.name === '' && card.travel_agent.name === ''){
                    // Both cards are not attached.
                    $scope.hideCompanyCardInvoiceToggle = true;
                }
                else if(card.company.name === '' && card.travel_agent.name !== ''){
                    // Only TA card is attached.
                    $scope.isCompanyCardInvoice = false;
                    $scope.disableCompanyCardInvoice = true;
                }
                else{
                    // Only Company card is attached.
                    $scope.disableCompanyCardInvoice = true;
                }
            }

        }
        params.bill_no = $scope.billNo;

        return params;

    };

    /*
    *  Fetches the bill settings info for the guest/account bills
    */
    var fetchBillSettingsInfo = function() {
        var params = getBillSettingsInfoRequestParams();
        var onBillSettingsInfoFetchSuccess = function(response) {
            $scope.$emit('hideLoader');
            $scope.data = response.data;
        };
        $scope.invokeApi(RVBillCardSrv.getBillSettingsInfo,params,onBillSettingsInfoFetchSuccess);
    };

    /*
    *  Get the request params for the email and print bill request
    */
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
            params.type = $scope.isCompanyCardInvoice ? 'COMPANY' : 'TRAVELAGENT';

        }
        params.bill_number = $scope.billNo;
        return params;
    };

    /*
    *  Function which get invoked when the print btn from bill format popup is clicked
    */
    $scope.printBill = function() {
        var printRequest = getPrintEmailRequestParams();
        printRequest.bill_layout = $scope.data.default_bill_settings;
        $scope.clickedPrint(printRequest);
    };

    /*
    *  Function which get invoked when the email btn from bill format popup is clicked
    */
    $scope.emailBill = function() {
        var emailRequest = getPrintEmailRequestParams();
        emailRequest.bill_layout = $scope.data.default_bill_settings;
        emailRequest.to_address = $scope.data.to_address;
        $scope.clickedEmail(emailRequest);
    };

    /*
    *  Initialize the controller
    */
    var init = function() {
        $scope.data = {};
        fetchBillSettingsInfo();
    };
    // Toggle on COMPANY/TA-CARD invoice generation tab.
    $scope.changeCompanyCardInvoiceToggle = function(){
        $scope.isCompanyCardInvoice = !$scope.isCompanyCardInvoice;
    };

    init();

}]);