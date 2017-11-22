angular.module('sntRover').controller('RvOverBookingMainCtrl', [
	'$scope',
	'rvOverBookingSrv',
	'$rootScope',
	'ngDialog',
	'$filter',
	'$timeout',
	'completeRoomTypeListData',
	'overBookingGridData',
	function($scope, rvOverBookingSrv, $rootScope, ngDialog, $filter, $timeout, completeRoomTypeListData, overBookingGridData) {

	BaseCtrl.call(this, $scope);

    var LEFT_PANE_SCROLL = 'overBookingLeftSectionScroll',
        RIGHT_PANE_SCROLL = 'overBookingGridScroll',
        DATE_PANE_SCROLL = 'overBookingDateScroll',
        DELAY_1000 = 1000;

	// Set scrollers for left and right pane
	var setScroller = function() {
        $scope.setScroller(LEFT_PANE_SCROLL, {
            'preventDefault': false,
            'probeType': 3
		});

		$scope.setScroller(RIGHT_PANE_SCROLL, {
			'preventDefault': false,
			'probeType': 3,
			'scrollX': true
		});

		$scope.setScroller(DATE_PANE_SCROLL, {
			'preventDefault': false,
			'probeType': 3,
			'scrollX': true,
			'scrollY': false
		});
	};

	// Set up scroll listeners for date, left and right pane
	var setupScrollListner = function() {
		$scope.myScroll[ LEFT_PANE_SCROLL ]
			.on('scroll', function() {
				$scope.myScroll[ RIGHT_PANE_SCROLL ]
					.scrollTo( 0, this.y );
			});

		$scope.myScroll[ RIGHT_PANE_SCROLL ]
			.on('scroll', function() {
				$scope.myScroll[ LEFT_PANE_SCROLL ]
					.scrollTo( 0, this.y );
			});

		$scope.myScroll[ DATE_PANE_SCROLL ]
			.on('scroll', function() {
				$scope.myScroll[ RIGHT_PANE_SCROLL ]
					.scrollTo( this.x, 0 );
			});

		$scope.myScroll[ RIGHT_PANE_SCROLL ]
			.on('scroll', function() {
				$scope.myScroll[ DATE_PANE_SCROLL ]
					.scrollTo( this.x, 0 );
			});
	};

	// Check whether scroll is ready
	var isScrollReady = function isScrollReady () {
		if ( $scope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) && $scope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) && $scope.myScroll.hasOwnProperty(DATE_PANE_SCROLL)) {
			setupScrollListner();
		} else {
			$timeout(isScrollReady, DELAY_1000);
		}
	};

	// Refresh scrollers for the left and right pane
    var refreshScrollers = function() {
        if ( $scope.myScroll.hasOwnProperty(LEFT_PANE_SCROLL) ) {
            $scope.refreshScroller( LEFT_PANE_SCROLL );
        }

        if ( $scope.myScroll.hasOwnProperty(RIGHT_PANE_SCROLL) ) {
            $scope.refreshScroller( RIGHT_PANE_SCROLL );
        }

        if ( $scope.myScroll.hasOwnProperty(DATE_PANE_SCROLL) ) {
            $scope.refreshScroller( DATE_PANE_SCROLL );
        }
    };

	// Initialization..
	var init = function() {

		$scope.heading = $filter('translate')('MENU_OVER_BOOKING');
		$scope.setTitle($filter('translate')('MENU_OVER_BOOKING'));
		$scope.$emit('updateRoverLeftMenu', 'overbooking');

		setScroller();
        isScrollReady();

		$scope.overBookingObj = {
			roomTypeList: completeRoomTypeListData,
			overBookingGridData: overBookingGridData,
			startDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
			endDate: moment(tzIndependentDate($rootScope.businessDate)).add(13, 'd')
					.format($rootScope.momentFormatForAPI),
			isShowRoomsLeftToSell: false,
			isShowRoomTypeFilter: false
		};
	};

	/*
	 *	Generating List of Selected Room Type Ids, used for calling fetchGridData API.
	 *  @return { Array }
	 */
	var getSelectedRoomTypeIdList = function() {
		var selectedRommTypeIdList = [];

			_.map($scope.overBookingObj.roomTypeList, function(value) {
				if (value.isChecked) {
					selectedRommTypeIdList.push(value.id);
				}
		});
		return selectedRommTypeIdList;
	};

	/*
	 *  Common Handler method for Genearting the RoomType - Date grid data.
	 *	Responce from API is modified in Service Layer - Ref : rvOverBookingSrv.js
	 */
	var fetchGridData = function() {

		var onFetchGridDataSuccess = function( data ) {
			$scope.overBookingObj.overBookingGridData = data;
			$timeout(function() {
                refreshScrollers();
            }, DELAY_1000 );
		},
		onFetchGridDataFailure = function( errorMessage ) {
			$scope.$errorMessage = errorMessage;
		},
		dataToSend = {
            'start_date': moment(tzIndependentDate($scope.overBookingObj.startDate)).format($rootScope.momentFormatForAPI),
            'end_date': moment(tzIndependentDate($scope.overBookingObj.endDate)).format($rootScope.momentFormatForAPI),
            'show_rooms_left_to_sell': $scope.overBookingObj.isShowRoomsLeftToSell,
            'room_type_ids': getSelectedRoomTypeIdList()
        };

		$scope.callAPI(rvOverBookingSrv.fetchOverBookingGridData, {
			successCallBack: onFetchGridDataSuccess,
			failureCallBack: onFetchGridDataFailure,
			params: dataToSend
		});
	};

	// Catching the REFRESH_OVERBOOKING_GRID event from child controllers..
	var listenerOverbooking = $scope.$on('REFRESH_OVERBOOKING_GRID', function() {
		fetchGridData();
	});

	// Catching the REFRESH_OVERBOOKING_GRID event from child controllers..
	var listenerRefreshScroll = $scope.$on('REFRESH_SCROLLBARS', function() {
		$timeout(function() {
            refreshScrollers();
        }, DELAY_1000 );
	});

	// Cleaning listener.
    $scope.$on('$destroy', listenerOverbooking);
    $scope.$on('$destroy', listenerRefreshScroll);

	init();

}]);
