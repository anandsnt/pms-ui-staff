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

      /*
       *  Search/filter action.
       *  @param {Object}
       *  @param {Object} Search params.
       *  @return {undefined}
       */
      $scope.search = function($defer, params) {
          $scope.errorMessage = '';

          $scope.callAPI(ADIdLookupSrv.search, {
              params: _.extend($scope.filter, {
                  page: params.page(),
                  per_page: $scope.displyCount
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
                  }, 100);
              },
              failureCallBack: function(errors) {
                  $scope.errorMessage = errors;
              }
          });
      };

      /*
       *  Export the data as CSV.
       */
      $scope.exportCSV = function() {
          $scope.callAPI(ADIdLookupSrv.exportCSV, {
              params: $scope.filter,
              successCallBack: function() {
                  $scope.errorMessage = '';
              },
              failureCallBack: function(errors) {
                  $scope.errorMessage = errors;
              }
          });
      };
      // Change Entity
      $scope.changedEntity = function() {
          $scope.filter.query = '';
          $scope.reloadTable();
      };

      (function() {
          BaseCtrl.call(this, $scope);
          ADBaseTableCtrl.call(this, $scope, ngTableParams);
          $scope.displyCount = 50;

          $scope.tableParams = new ngTableParams(
              {
                  page: 1,
                  count: $scope.displyCount,
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
