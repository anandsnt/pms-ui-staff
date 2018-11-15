admin.controller('ADInvoiceSettingsCtrl', [
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv',
    '$filter',
    function($scope, invoiceSettingsData, ADInvoiceSettingsSrv, $filter) {

    	BaseCtrl.call(this, $scope);

        $scope.isFirstInvoiceNoReadOnly = invoiceSettingsData.first_invoice_no ? "yes" : "no";

        $scope.invoiceSettings = invoiceSettingsData;

        $scope.errorMessage = [];


        /**
        * To handle save button action
        *
        */
        $scope.saveClick = function() {

            var saveInvoiceSettingsSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                if (data.errors) {
                    $scope.errorMessage = data.errors;
                    $scope.invoiceSettings.is_print_invoice_enabled = true;
                } else {
                    $scope.errorMessage = [];
                    $scope.goBackToPreviousState();
                }                
            };

            $scope.invokeApi(ADInvoiceSettingsSrv.saveInvoiceSettings, $scope.invoiceSettings, saveInvoiceSettingsSuccessCallback);
        };


}]);