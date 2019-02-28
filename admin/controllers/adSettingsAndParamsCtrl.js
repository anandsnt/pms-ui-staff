admin.controller('settingsAndParamsCtrl', ['$scope', 'settingsAndParamsSrv', 'settingsAndParamsData', 'chargeCodes', function($scope, settingsAndParamsSrv, settingsAndParamsData, chargeCodes) {

    BaseCtrl.call(this, $scope);
    $scope.ccBatchProcessingOptions = [{
        'value': 'PAYMENT_GATEWAY',
        'name': 'Payment Gateway'
    },
    {
        'value': 'HOTEL',
        'name': 'Hotel'
    }];

    $scope.cc_batch_processing = settingsAndParamsData.cc_batch_processing === null ? '' : settingsAndParamsData.cc_batch_processing;
    $scope.cc_auto_settlement_by_eod = settingsAndParamsData.cc_auto_settlement_by_eod;

    $scope.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    $scope.minutes = ['00', '15', '30', '45'];


    $scope.data = settingsAndParamsData.business_date;
    $scope.currency_list = settingsAndParamsData.currency_list;
    $scope.chargeCodes = chargeCodes;
    $scope.selected_charge_code = settingsAndParamsData.no_show_charge_code_id;
    $scope.selected_group_charge_code = settingsAndParamsData.group_charge_code_id;
    $scope.emailRecipientsForEodReports = settingsAndParamsData.email_recipients_for_eod_reports;
    $scope.check_guest_auth_for_interface_postings = settingsAndParamsData.check_guest_auth_for_interface_postings;
    $scope.auto_charge_deposit = settingsAndParamsData.auto_charge_deposit;
    $scope.is_multi_currency = settingsAndParamsData.is_multi_currency;
    $scope.is_multi_currency_enabled = settingsAndParamsData.is_multi_currency_enabled;
    $scope.currency_list  = settingsAndParamsData.currency_list;
    $scope.invoice_currency = settingsAndParamsData.invoice_currency; 

    /**
    * To handle save button action
    *
    */
    $scope.saveClick = function() {

        var saveDetailsSuccessCallback = function() {
            $scope.$emit('hideLoader');
            $scope.goBackToPreviousState();
            
        };
        var selectedChargeCode = typeof $scope.selected_charge_code === 'undefined' ? '' : $scope.selected_charge_code;
        var groupChargeCode = typeof $scope.selected_group_charge_code === 'undefined' ? '' : $scope.selected_group_charge_code;
        var dataToSend = {
            'no_show_charge_code_id': selectedChargeCode,
            'business_date': $scope.data,
            'group_charge_code_id': groupChargeCode,
            'cc_batch_processing': $scope.cc_batch_processing,
            'cc_auto_settlement_by_eod': $scope.cc_auto_settlement_by_eod,
            'email_recipients_for_eod_reports': $scope.emailRecipientsForEodReports,
            'check_guest_auth_for_interface_postings': $scope.check_guest_auth_for_interface_postings,
            'auto_charge_deposit': $scope.auto_charge_deposit,
            'is_multi_currency_enabled': $scope.is_multi_currency_enabled,
            'invoice_currency': $scope.invoice_currency
        };

        $scope.invokeApi(settingsAndParamsSrv.saveSettingsAndParamsSrv, dataToSend, saveDetailsSuccessCallback);
    };
}]);
