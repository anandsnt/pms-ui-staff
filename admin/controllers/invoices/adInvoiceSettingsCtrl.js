admin.controller('ADInvoiceSettingsCtrl',[
    '$scope',
    'invoiceSettingsData',
    'ADInvoiceSettingsSrv', 
    function($scope,invoiceSettingsData,ADInvoiceSettingsSrv) {

    	BaseCtrl.call(this, $scope);
    	
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