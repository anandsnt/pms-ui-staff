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

            var saveInvoiceSettingsSuccessCallback = function() {
                 $scope.errorMessage = [];
                 $scope.$emit('hideLoader');
                 $scope.goBackToPreviousState();
            };

            $scope.invokeApi(ADInvoiceSettingsSrv.saveInvoiceSettings, $scope.invoiceSettings, saveInvoiceSettingsSuccessCallback);
        };


}]);