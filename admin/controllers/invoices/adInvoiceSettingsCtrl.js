admin.controller('ADInvoiceSettingsCtrl', [
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv',
    '$filter',
    'chargeCodes',
    function($scope, invoiceSettingsData, ADInvoiceSettingsSrv, $filter, chargeCodes) {

    	BaseCtrl.call(this, $scope);

        $scope.isFirstInvoiceNoReadOnly = invoiceSettingsData.first_invoice_no ? "yes" : "no";

        invoiceSettingsData.chargeCodes = chargeCodes;
        invoiceSettingsData.show_rounding_offset_charge_code_on_invoice = false;

        var invoiceSettingsDataCopy = angular.copy(invoiceSettingsData);

        $scope.invoiceSettings = invoiceSettingsData;

        $scope.errorMessage = [];


        /**
        * To handle save button action
        *
        */
        $scope.saveClick = function() {

            var saveInvoiceSettingsSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                if (data.errors.length > 0) {
                    $scope.errorMessage = data.errors;
                    $scope.invoiceSettings.is_print_invoice_enabled = true;
                } else {
                    $scope.errorMessage = [];
                    $scope.goBackToPreviousState();
                }                
            };
            var unwantedKeys = [];

            if ($scope.invoiceSettings.first_invoice_no === invoiceSettingsDataCopy.first_invoice_no) {
                unwantedKeys.push('first_invoice_no');
            }
            $scope.invoiceSettings = dclone($scope.invoiceSettings, unwantedKeys);

            $scope.invokeApi(ADInvoiceSettingsSrv.saveInvoiceSettings, $scope.invoiceSettings, saveInvoiceSettingsSuccessCallback);
        };
}]);