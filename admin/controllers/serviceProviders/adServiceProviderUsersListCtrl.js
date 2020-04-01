admin.controller('ADServiceProviderUserListCtrl', ['$scope', '$rootScope', '$q', '$state', '$stateParams', 'ADServiceProviderSrv', 'ngTableParams', '$filter', function($scope, $rootScope, $q, $state, $stateParams, ADServiceProviderSrv, ngTableParams, $filter) {

    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    var init = function() {
        $scope.errorMessage = '';
        $scope.serviceProviderId = $stateParams.id;
        $scope.serviceProviderName = $stateParams.name;
        $scope.includeInactiveUsers = false;
        loadTable();
    };

    /**
    * To fetch the list of users
    */
    $scope.fetchTableData = function($defer, params) {
        var getParams = $scope.calculateGetParams(params);

        getParams.service_provider_id = $scope.serviceProviderId;
        if ($scope.includeInactiveUsers) {
            getParams.include_inactive = $scope.includeInactiveUsers;
        }
        var successCallbackFetch = function(data) {
            if (data.status === 'failure') {
                $scope.errorMessage = data.errors;
            }
            $scope.currentClickedElement = -1;
            $scope.displyCount = 50;
            $scope.totalCount = data.total_count;
            $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
            $scope.data = data.users;
            $scope.currentPage = params.page();
            params.total(data.total_count);
            $defer.resolve($scope.data);
        };

        $scope.callAPI(ADServiceProviderSrv.fetch, {
            params: getParams,
            onSuccess: successCallbackFetch
        });
    };

    /**
    * To table data structuring
    */
    var loadTable = function () {
        $scope.tableParams = new ngTableParams(
            {
                page: 1,  // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            }
        );
    };
	
   /**
    * To Activate/Inactivate user
    * @param {string} userId user id
    * @param {string} currentStatus current status of the user
    * @param {num} index current index
    * @returns {undefined}
    */
    $scope.activateInactivate = function(userId, currentStatus, index) {
        var nextStatus = currentStatus === 'true' ? 'inactivate' : 'activate';
        var data = {
            'activity': nextStatus,
            'id': userId
        };
        var successCallbackActivateInactivate = function() {
            $scope.data[index].is_active = currentStatus === 'true' ? 'false' : 'true';
        };

        $scope.callAPI(ADServiceProviderSrv.activateInactivate, {
            params: data,
            onSuccess: successCallbackActivateInactivate
        });
    };

    $scope.reloadTable = function() {
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
    };
    /**
     * Handle checkbox click event
     * @returns {undefined}
     */
    $scope.clickedShowInactiveUsers = function() {
        $scope.reloadTable();
    };

	/**
    *Initiating
    */

    (function () {
        init();
    })();

	
}]);
