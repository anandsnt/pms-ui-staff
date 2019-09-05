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
        $scope.defaultSettings = defaultSettings;
    }]);