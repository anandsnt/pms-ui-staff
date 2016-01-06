admin.controller('ADInvoiceSettingsCtrl',[
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv',
    function($scope,invoiceSettingsData,ADInvoiceSettingsSrv) {

    	BaseCtrl.call(this, $scope);

        $scope.isFirstInvoiceNoReadOnly = invoiceSettingsData.first_invoice_no ? "yes" : "no";

        $scope.invoiceSettings = invoiceSettingsData;

        /**
        * To handle save button action
        *
        */
        $scope.saveClick = function(){

            var saveInvoiceSettingsSuccessCallback = function(){
                 $scope.$emit('hideLoader');
                 $scope.goBackToPreviousState();
            };

            $scope.invokeApi(ADInvoiceSettingsSrv.saveInvoiceSettings, $scope.invoiceSettings ,saveInvoiceSettingsSuccessCallback);
        };


}]);