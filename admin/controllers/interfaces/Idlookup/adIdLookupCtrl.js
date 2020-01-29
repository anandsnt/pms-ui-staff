angular.module('admin').controller('adIdLookupCtrl', ['$scope', '$rootScope', 'ADIdLookupSrv', 'ngTableParams', '$timeout',
    function($scope, $rootScope, ADIdLookupSrv, ngTableParams, $timeout) {

      $scope.entities = [
        { value: 'CHARGE_CODES', name: 'Charge Codes'},
        { value: 'ADDONS', name: 'Addons'},
        { value: 'RATES', name: 'Rates'},
        { value: 'ROOM_TYPES', name: 'Room Types'},
        { value: 'MARKETS', name: 'Markets'},
        { value: 'SOURCES', name: 'Sources'},
        { value: 'POSTING_ACCOUNTS', name: 'Posting Accounts'},
        { value: 'HOTELS', name: 'Hotels'}
      ];

      $scope.filter = {
        entity: 'CHARGE_CODES',
        query: ''
      };

      $scope.search = function($defer, params) {
          $scope.errorMessage = '';

          $scope.callAPI(ADIdLookupSrv.search, {
              params: _.extend($scope.filter, {
                  page: params.page()
              }),
              successCallBack: function(response) {
                  $scope.errorMessage = '';
                  $timeout(function() {
                      $scope.totalCount = response.total_count;
                      $scope.totalPage = Math.ceil(response.total_count / $scope.displyCount);
                      $scope.data = response.results;
                      $scope.currentPage = params.page();
                      params.total(response.total_count);
                      $defer.resolve($scope.data);
                  }, 500);
              },
              failureCallBack: function(errors) {
                  $scope.errorMessage = errors;
              }
          });
      };

      $scope.export = function() {
          $scope.callAPI(ADIdLookupSrv.export, {
              params: $scope.filter,
              successCallBack: function(response) {
                  $scope.errorMessage = '';
              },
              failureCallBack: function(errors) {
                  $scope.errorMessage = errors;
              }
          });
      };

      (function() {
          BaseCtrl.call(this, $scope);
          ADBaseTableCtrl.call(this, $scope, ngTableParams);

          $scope.tableParams = new ngTableParams(
              {
                  page: 1,
                  count: $scope.displyCount || 25,
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
