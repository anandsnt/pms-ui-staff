admin.controller('ADInvoiceSettingsCtrl', [
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv',
    '$filter',
    function($scope, invoiceSettingsData, ADInvoiceSettingsSrv, $filter) {

    	BaseCtrl.call(this, $scope);

        $scope.isFirstInvoiceNoReadOnly = invoiceSettingsData.first_invoice_no ? "yes" : "no";

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