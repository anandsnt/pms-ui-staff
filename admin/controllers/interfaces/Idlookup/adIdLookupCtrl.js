angular.module('admin').controller('adIdLookupCtrl', ['$scope', '$rootScope', 'ADIdLookupSrv', 'ngTableParams',
    function($scope, $rootScope, ADIdLookupSrv, ngTableParams) {

      $scope.entities = ['Charge Codes', 'Addons', 'Rates', 'Room Types', 'Markets', 'Sources', 'Posting Accounts', 'Hotels'];

      (function() {
          BaseCtrl.call(this, $scope);
          ADBaseTableCtrl.call(this, $scope, ngTableParams);

          $scope.tableParams = new ngTableParams(
              {
                  page: 1,
                  count: $scope.displyCount || 10,
                  sorting: {
                      rate: 'asc'
                  }
              }, {
                  total: $scope.data.length,
                  getData: $scope.search
              }
          );
      })();
    }
]);
