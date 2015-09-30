sntRover.controller('RVDailyProdReportCtrl', [
	'$rootScope',
	'$scope',
	'RVreportsSrv',
	'RVreportsSubSrv',
	'RVReportUtilsFac',
	'RVReportParamsConst',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'$filter',
	'$timeout',
	'ngDialog',
	function($rootScope, $scope, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, ngDialog) {
		BaseCtrl.call(this, $scope);


		var LEFT_PANE_SCROLL  = 'left-pane-scroll',
			RIGHT_PANE_SCROLL = 'right-pane-scroll';

		$scope.setScroller(LEFT_PANE_SCROLL, {
			'preventDefault' : false,
			'probeType'      : 3
		});

		$scope.setScroller(RIGHT_PANE_SCROLL, {
			'preventDefault' : false,
			'probeType'      : 3,
			'scrollX'        : true
		});

		$timeout(function() {
			$scope.$parent
				.myScroll[ LEFT_PANE_SCROLL ]
				.on('scroll', function() {
					$scope.$parent
						.myScroll[ RIGHT_PANE_SCROLL ]
						.scrollTo( 0, this.y );
				});

			$scope.$parent
				.myScroll[ RIGHT_PANE_SCROLL ]
				.on('scroll', function() {
					$scope.$parent
						.myScroll[ LEFT_PANE_SCROLL ]
						.scrollTo( 0, this.y );
				});

		}, 1000);


		$scope.colSpan = 5;

		$scope.uiFilter = {
			'showAvailability' : true,
			'showRevenue'      : true
		};

		// cant disable both, when one disabled the other should be enabled
		$scope.$watch('uiFilter.showAvailability', function(newValue) {
			if ( false == newValue && ! $scope.uiFilter.showRevenue ) {
				$scope.uiFilter.showRevenue = true;
			}

			reInit();
		});

		// cant disable both, when one disabled the other should be enabled
		$scope.$watch('uiFilter.showRevenue', function(newValue) {
			if ( false == newValue && ! $scope.uiFilter.showAvailability ) {
				$scope.uiFilter.showAvailability = true;
			};

			reInit();
		});



		var dataValidator = function() {

		};


		var calThings = function() {
			var SUB_HEADER_NAMES = [
				'Rooms #',
				'Avl. Rooms',
				/**/
				'Rate Rev.',
				'ADR',
				'Actual Rev.'
			];

			var startIndex, endIndex, triggerIndex;

			if ( $scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue ) {
				$scope.colSpan = 5;
			} else if ( ! $scope.uiFilter.showAvailability && $scope.uiFilter.showRevenue ) {
				$scope.colSpan = 3;
			} else if ( $scope.uiFilter.showAvailability && ! $scope.uiFilter.showRevenue ) {
				$scope.colSpan = 2;
			};

			$scope.headerTop  = [];
			$scope.headerBot  = [];

			// TODO: fix this;
			for( date in $scope.results['Bunk'] ) {
				if ( ! $scope.results['Bunk'].hasOwnProperty(date) ) {
					continue;
				};

				$scope.headerTop.push( $filter('date')(date, $rootScope.shortMonthAndDate) );

				if ( 5 == $scope.colSpan ) {
					startIndex   = 0;
					endIndex     = SUB_HEADER_NAMES.length;
					triggerIndex = SUB_HEADER_NAMES.length - 1;
				} else if ( 3 == $scope.colSpan ) {
					startIndex   = 2;
					endIndex     = SUB_HEADER_NAMES.length;
					triggerIndex = SUB_HEADER_NAMES.length - 1;
				} else if ( 2 == $scope.colSpan ) {
					startIndex   = 0;
					endIndex     = 1 + 1;
					triggerIndex = 1;
				};
				for (; startIndex < endIndex; startIndex++) {
					$scope.headerBot.push({
						'name' : SUB_HEADER_NAMES[startIndex],
						'cls'  : startIndex == triggerIndex ? 'day-end' : ''
					});
				};
			};


			
			var allDatesValInRoom = [],
				eachDateVal       = [];

			$scope.reportData = [];	// this will be an array of arrays

			var roomObj, dateObj;

			var loopCount = 0;

			for( roomKey in $scope.results ) {
				if ( ! $scope.results.hasOwnProperty(roomKey) ) {
					continue;
				};

				roomObj = $scope.results[roomKey];
				allDatesValInRoom = [];

				for( dateKey in roomObj ) {
					if ( ! roomObj.hasOwnProperty(dateKey) ) {
						continue;
					};

					dateObj = roomObj[dateKey];

					eachDateVal = [];

					if ( 2 == $scope.colSpan ) {
						eachDateVal.push({
							value   : dateObj['available_rooms_count'],
							isAvail : true
						});
						eachDateVal.push({
							value   : dateObj['total_rooms_count'],
							isAvail : true,
							cls     : 'last-day'
						});
					} else if ( 3 == $scope.colSpan ) {
						eachDateVal.push({
							value : $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
							isRev : true
						});
						eachDateVal.push({
							value : $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
							isRev : true
						});
						eachDateVal.push({
							value : $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
							isRev : true,
							cls   : 'last-day'
						});
					} else if ( 5 == $scope.colSpan ) {
						eachDateVal.push({
							value   : dateObj['available_rooms_count'],
							isAvail : true
						});
						eachDateVal.push({
							value   : dateObj['total_rooms_count'],
							isAvail : true
						});
						eachDateVal.push({
							value : $filter('currency')(dateObj['rate_revenue'], $rootScope.currencySymbol, 2),
							isRev : true
						});
						eachDateVal.push({
							value : $filter('currency')(dateObj['adr'], $rootScope.currencySymbol, 2),
							isRev : true
						});
						eachDateVal.push({
							value : $filter('currency')(dateObj['actual_revenue'], $rootScope.currencySymbol, 2),
							isRev : true,
							cls   : 'last-day'
						});
					};

					allDatesValInRoom = allDatesValInRoom.concat( eachDateVal );
				};

				$scope.reportData.push( allDatesValInRoom );
			};
		};



		function init (argument) {
			calThings();
		};

		function reInit (argument) {
			// body...

			calThings();
		};

		init();
	}
]);