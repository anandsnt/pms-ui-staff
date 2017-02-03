admin.controller('ADFTPServersCtrl', [
    '$scope', 
    'ngTableParams', 
    'ADFTPServersSrv',
    function($scope, ngTableParams, ADFTPServersSrv) {
   /*
    * Controller class for FTP Server List
    */

    // inheriting from base controller
    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    var fetchData = function() {
        var onFetchSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.ftpServersData = data;
        };

        $scope.invokeApi(ADFTPServersSrv.fetchFtpServers, {}, onFetchSuccess);
    };

    $scope.deleteItem = function(value) {
    var deleteSuccessCallback = function() {

            $scope.$emit('hideLoader');
            angular.forEach($scope.ftpServersData, function(item, index) {
                if (item.id === value) {
                    $scope.ftpServersData.splice(index, 1);
                }
            });
            $scope.serverList.reload();
        };

        var data = {
            'id': value
        };

        $scope.invokeApi(ADFTPServersSrv.deleteFTPServer, data, deleteSuccessCallback);
    };

    var init = function() {
        $scope.errorMessage = '';
        $scope.ftpServersData = {};

        $scope.serverList = new ngTableParams(
            {
                page: 1, // show first page
                count: $scope.ftpServersData.length,
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: fetchData
            }
        );
    };

    init();

}]);
