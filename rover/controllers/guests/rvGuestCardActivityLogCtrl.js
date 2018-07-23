
sntRover.controller('RVGuestCardActivityLogController',
	['$scope',
	'$rootScope',
	'$stateParams',
	'$timeout',
	'RVCompanyCardActivityLogSrv',
	function($scope, $rootScope, $stateParams, $timeout, RVCompanyCardActivityLogSrv ) {
    
    BaseCtrl.call(this, $scope);
    var that = this;
    
    // Refresh scroller.
    var refreshScroll = function() {
        $timeout(function() {
            $scope.refreshScroller('rvGuestCardActivityLogScroll');
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
			id: 'GUEST_ACTIVITY_LOG',
			api: that.loadAPIData,
			perPage: $scope.activityLogObj.perPage
		};
		
        // Setting up scroller with refresh options.
        $scope.setScroller('rvGuestCardActivityLogScroll', {});
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
	 * @param  { String } [Page No to API]
	 */
	that.loadAPIData = function ( pageNo ) {

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
					$scope.$broadcast('updatePagination', 'GUEST_ACTIVITY_LOG');
				}, 1000);
			},
			failureCallBack: function( errorMessage ) {
				$scope.errorMessage = errorMessage;
			}
		};

		$scope.callAPI(RVCompanyCardActivityLogSrv.fetchActivityLog, dataToSend);
	};

	/*
	*	Handle sortby action..
	*	@param  - {String} - [Filter type value]
	*/
	var toggleFilterAction = function( type ) {
		$scope.activityLogObj.sortField = type;
		var filterObj = $scope.activityLogFilter;

		switch ( type ) {

			case 'USERNAME' :
				if ( filterObj.user === '' || filterObj.user === 'asc' ) {
					filterObj.user = 'desc';
				}
				else {
					filterObj.user = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.user;
				break;

			case 'DATE' :
				if ( filterObj.date === '' || filterObj.date === 'asc' ) {
					filterObj.date = 'desc';
				}
				else {
					filterObj.date = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.date;
				break;

			case 'ACTION' :
				if ( filterObj.action === '' || filterObj.action === 'asc' ) {
					filterObj.action = 'desc';
				}
				else {
					filterObj.action = 'asc';
				}
				$scope.activityLogObj.sortOrder = filterObj.action;
				break;
		}

		that.loadAPIData();
	};

	/*
	* Sort by User/Date/Action
	*	@param  - {String} - [Filter type value]
	*/
	$scope.sortByAction = function( type ) {
		toggleFilterAction( type );
	};

	// Refresh the scroller when the tab is active.
    var listener =  $scope.$on('GUEST_ACTIVITY_LOADED', function() {
		that.loadAPIData();
    });

	/**
	*	checking Whether oldvalue of detail have any value
	*	@param  - {Any type} - [input value]
	*	@return - {Boolean}
	*/
    $scope.isOldValue = function(value) {
        if (value === "" || typeof value === "undefined" || value === null) {
            return false;
        }
        else {
            return true;
        }
    };

    init();

    $scope.$on('$destroy', listener);

}]);
