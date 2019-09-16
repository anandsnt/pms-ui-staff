admin.controller('ADPoliceExportDefaults', [
    '$rootScope',
    '$scope',
    'adPoliceExportDefaultSrv',
    '$stateParams',
    '$state',
    'ngDialog',
    'defaultSettings',
    function($rootScope, $scope, adPoliceExportDefaultSrv, $stateParams, $state, ngDialog, defaultSettings) {

        $scope.title = "Police Export Defaults";  
        $scope.countries = angular.copy(defaultSettings);
        $scope.nationalities = angular.copy(defaultSettings);

        $scope.clickedSave = function() {
            var successCallbackSave = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');
            },
            // Failure callback
            failureCallbackSave = function(errorMessage) {
                $scope.errorMessage = errorMessage;
                $scope.$emit('hideLoader');
            },
            postData = {
				'police_export_default_country_id': $scope.countries.countries.id,
				'police_export_default_nationality_id': $scope.nationalities.countries.id }
            // option object
            options = {
                params: postData,
                successCallBack: successCallbackSave,
                failureCallBack: failureCallbackSave
            };
    
            $scope.callAPI(adPoliceExportDefaultSrv.saveDefaults, options);
        }

    }]);