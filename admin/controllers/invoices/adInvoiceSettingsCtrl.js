admin.controller('ADInvoiceSettingsCtrl',[
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv',
    '$filter',
    function($scope,invoiceSettingsData,ADInvoiceSettingsSrv, $filter) {

    	BaseCtrl.call(this, $scope);

        $scope.isFirstInvoiceNoReadOnly = invoiceSettingsData.first_invoice_no ? "yes" : "no";

        $scope.invoiceSettings = invoiceSettingsData;

        $scope.errorMessage = [];

        var EMPTY_INVOICE_PREFIX_ERROR = $filter('translate')('EMPTY_INVOICE_NO_PREFIX');

        /**
        * To handle save button action
        *
        */
        $scope.saveClick = function(){

            var saveInvoiceSettingsSuccessCallback = function(){
                 $scope.errorMessage = [];
                 $scope.$emit('hideLoader');
                 $scope.goBackToPreviousState();
            };
            if (!$scope.invoiceSettings.invoice_no_prefix) {
                $scope.errorMessage = [EMPTY_INVOICE_PREFIX_ERROR];
                return;
            }
            $scope.invokeApi(ADInvoiceSettingsSrv.saveInvoiceSettings, $scope.invoiceSettings ,saveInvoiceSettingsSuccessCallback);
        };


}]);