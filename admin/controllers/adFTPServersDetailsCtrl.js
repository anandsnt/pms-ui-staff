admin.controller('ADFTPServersDetailsCtrl', ['$scope', 'ADFTPServersSrv', '$state', '$stateParams', function($scope, ADFTPServersSrv, $state, $stateParams) {
    /*
    * Controller class for FTP Server add/edit
    */

    // inheriting from base controller
    BaseCtrl.call(this, $scope);

    var fetchSuccessOfServerDetails = function(data) {
        $scope.$emit('hideLoader');
        $scope.serverDetails = data;
    };

    var fetchFailedOfServerDetails = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
    };

    $scope.goBack = function() {
        $state.go('admin.ftpservers');
    };

    $scope.saveServerDetails = function() {
        var postData = {};

        postData = $scope.serverDetails;

        var fetchSuccessOfSaveServerDetails = function() {
            $scope.goBack();
        };

        if ($scope.mode === 'edit') {
            $scope.invokeApi(ADFTPServersSrv.updateFtpServer, postData, fetchSuccessOfSaveServerDetails);
        } else {
            $scope.invokeApi(ADFTPServersSrv.saveFtpServer, postData, fetchSuccessOfSaveServerDetails);
        }
    };

    var init = function() {
        $scope.errorMessage = '';
        $scope.mode = 'edit';
        var serverId = $stateParams.id;

        // if serverId is null, means it is for add item form

        if (typeof serverId === 'undefined' || serverId.trim() === '') {
            $scope.mode = 'add';
        }

        if ($scope.mode === 'edit') {
            $scope.invokeApi(ADFTPServersSrv.getServerDetails, {'id': serverId}, fetchSuccessOfServerDetails, fetchFailedOfServerDetails);
        }

    };

    init();

}]);
