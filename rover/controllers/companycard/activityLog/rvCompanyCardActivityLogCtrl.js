
sntRover.controller('RVCompanyCardActivityLogCtrl',
	['$scope',
	'$rootScope',
	'$stateParams',
	'$timeout',
	'RVCompanyCardActivityLogSrv',
	function($scope, $rootScope, $stateParams, $timeout, RVCompanyCardActivityLogSrv ) {
    
    BaseCtrl.call(this, $scope);
    
    // Refresh scroller.
    var refreshScroll = function() {
        $timeout(function() {
            $scope.refreshScroller('rvCompanyCardActivityLogScroll');
        }, 500);
    };
    // Initialization.
    var init = function () {
        // Data set ninitialization
        $scope.activityLogData = {
            response: {},
            perPage: 50,
            page: 1,
            sortField: 'USERNAME',
            sortOrder: 'asc'
        };

        // Pagination options for Activity Log
		$scope.activityLogPagination = {
			id: 'ACTIVITY_LOG',
			api: loadAPIData,
			perPage: $scope.activityLogData.perPage
		};

		loadAPIData();
        // Setting up scroller with refresh options.
        $scope.setScroller('rvCompanyCardActivityLogScroll', {});
        refreshScroll();
    };

	// -------/ PAGINATION LOGIC /----------- //

	// Show pagination or not.
    $scope.showPagination = function() {
        var showPagination = false,
            response = $scope.activityLogData.response;

        if ( typeof response !== 'undefined' && typeof response.results !== 'undefined' ) {
            if ( response.results.length < response.total_result &&  response.results.length > 0 ) {
                showPagination = true;
            }
        }
        return showPagination;
    };
	/*
	 * Fetch transactions APIs
	 * @param pageType { String } , Page No { String } to API
	 */
	var loadAPIData = function ( pageNo ) {

		$scope.activityLogData.page = !!pageNo ? pageNo : 1;

		var dataToSend = {
	        params: {
	            'page': $scope.activityLogData.page,
	            'per_page': $scope.activityLogData.perPage,
	            'sort_field': $scope.activityLogData.sortField,
	            'sort_order': $scope.activityLogData.sortOrder,
	            'id': 1489131
	        },
	        successCallBack: function( data ) {
	            $scope.activityLogData.response = data;
	            $scope.errorMessage = '';
	            refreshScroll();
	            $timeout(function () {
	                $scope.$broadcast('updatePagination', 'ACTIVITY_LOG');
	            }, 1000);
	        },
	        failureCallBack: function( errorMessage ) {
	            $scope.errorMessage = errorMessage;
	        }
	    };

		$scope.callAPI(RVCompanyCardActivityLogSrv.fetchActivityLog, dataToSend);
	};

	// Refresh the scroller when the tab is active.
    $scope.$on("activityLogTabActive", function() {
    	init();
    });

}]);
