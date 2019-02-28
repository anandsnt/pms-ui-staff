admin.controller('ADAdminUserListCtrl', ['$scope', '$rootScope', '$q', '$state', '$stateParams', 'ADAdminUserSrv', 'ngTableParams', function($scope, $rootScope, $q, $state, $stateParams, ADAdminUserSrv, ngTableParams) {
    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);
    /*
    * Failure callback function common to multiple API- invoke functions.
    */
    var failureCallback = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
        // scroll to top of the page where error message is shown
        if (angular.element( document.querySelector('.content')).find('.error_message').length) {
            angular.element( document.querySelector('.content')).scrollTop(0);
        }
    };

    $scope.flagObject = {};
    $scope.flagObject.showIncludeInactiveCheckbox = true;
    /*
    * To fetch the list of users
    * @param {params} ng-table parameters
    */
    $scope.fetchTableData = function($defer, params) {
        var getParams = $scope.calculateGetParams(params),
            /*
            * Success Callback of for Fetching User details API
            */
            successCallbackFetch = function(data) {
                $scope.$emit('hideLoader');
                $scope.totalCount = data.total_count;
                $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                $scope.data = data.users;
                $scope.currentPage = params.page();
                params.total(data.total_count);
                $defer.resolve($scope.data);
            };

        getParams.admin_only = true;
        if ($scope.showInactiveUser) {
            getParams.include_inactive = $scope.showInactiveUser;
        }
        $scope.invokeApi(ADAdminUserSrv.fetch, getParams, successCallbackFetch, failureCallback);

    };

    /*
    * Loads the ng-table in the HTML for list of users
    */
    $scope.loadTable = function() {
        $scope.tableParams = new ngTableParams({
            page: 1,  // show first page
            count: $scope.displyCount, // count per page
            sorting: {
                name: 'asc' // initial sorting
            }
        }, {
            total: 0, // length of data
            getData: $scope.fetchTableData
        });
    };

    /*
     * Show inactive users along with active users
     */
    $scope.clickedShowInactiveUsers = function() {
        $scope.reloadTable();
    };
    /*
     * Changed search text
     */
    $scope.changedSearchText = function() {
        if ($scope.searchTerm !== '') {
            $scope.flagObject.showIncludeInactiveCheckbox = false;
        } else {
            $scope.flagObject.showIncludeInactiveCheckbox = true;
        }
    };

    $scope.reloadTable = function() {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    /*
    * To Activate/Inactivate user
    * @param {string} user id
    * @param {string} current status of the user
    * @param {num} current index
    */
    $scope.activateInactivate = function(userId, currentStatus) {
        var nextStatus = currentStatus === 'true' ? 'inactivate' : 'activate';
        var data = {
            'activity': nextStatus,
            'id': userId
        };
        var successCallbackActivateInactivate = function(data) {
            $scope.reloadTable();
        };

        $scope.invokeApi(ADAdminUserSrv.activateInactivate, data, successCallbackActivateInactivate);
    };
    $scope.loadTable();

}]);
