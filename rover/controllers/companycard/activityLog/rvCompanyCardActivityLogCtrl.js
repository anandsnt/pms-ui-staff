
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
        $scope.activityLogObj = {
            response: {},
            perPage: 50,
            page: 1,
            sortField: 'DATE',
            sortOrder: 'asc',
            accountId: ''
        };

        $scope.activityLogFilter = {
			user: '',
			date: 'asc',
			action: ''
        };

        // Pagination options for Activity Log
		$scope.activityLogPagination = {
			id: 'ACTIVITY_LOG',
			api: loadAPIData,
			perPage: $scope.activityLogObj.perPage
		};

		
        // Setting up scroller with refresh options.
        $scope.setScroller('rvCompanyCardActivityLogScroll', {});
        refreshScroll();
    };

	// -------/ PAGINATION LOGIC /----------- //

	// Show pagination or not.
    $scope.showPagination = function() {
        var showPagination = false,
            response = $scope.activityLogObj.response;

        if ( typeof response !== 'undefined' && typeof response.results !== 'undefined' ) {
            if ( response.results.length < response.total_count &&  response.results.length > 0 ) {
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

		$scope.activityLogObj.page = pageNo ? pageNo : 1;
		$scope.activityLogObj.accountId = ( typeof $scope.contactInformation === 'undefined' ) ? $stateParams.id : $scope.contactInformation.id;

		var dataToSend = {
			params: {
				'page': $scope.activityLogObj.page,
				'per_page': $scope.activityLogObj.perPage,
				'sort_field': $scope.activityLogObj.sortField,
				'sort_order': $scope.activityLogObj.sortOrder,
				'id': $scope.activityLogObj.accountId
			},
			successCallBack: function( data ) {
				$scope.activityLogObj.response = data;
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

	// Handle sortby action..
	var toggleFilterAction = function( type ) {
		$scope.activityLogObj.sortField = type;
		var filterObj = $scope.activityLogFilter;

		switch ( type ) {

			case 'USERNAME' :
				if ( filterObj.user === '' | filterObj.user === 'asc' ) {
					filterObj.user = 'desc';
				}
				else {
					filterObj.user = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.user;
				break;

			case 'DATE' :
				if ( filterObj.date === '' | filterObj.date === 'asc' ) {
					filterObj.date = 'desc';
				}
				else {
					filterObj.date = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.date;
				break;

			case 'ACTION' :
				if ( filterObj.action === '' | filterObj.action === 'asc' ) {
					filterObj.action = 'desc';
				}
				else {
					filterObj.action = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.action;
				break;
		}

		loadAPIData();
	};

	// Sort by User/Date/Action
	$scope.sortByAction = function( type ) {
		toggleFilterAction( type );
	};

	// Refresh the scroller when the tab is active.
    $scope.$on('activityLogTabActive', function() {
		loadAPIData();
    });

    init();

}]);
