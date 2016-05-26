angular.module('sntRover').controller('RVScheduleReportsCtrl', [
	'$rootScope',
	'$scope',
	'RVreportsSrv',
	'RVReportUtilsFac',
	'RVReportParamsConst',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'$filter',
	'$timeout',
	'rvUtilSrv',
	function($rootScope, $scope, reportsSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, util) {
		BaseCtrl.call(this, $scope);

		$scope.removeEmail = function(index) {
			$scope.emailList = [].concat(
				$scope.emailList.slice(0, index),
				$scope.emailList.slice(index + 1)
			);

			$scope.refreshFourthColumnScroll(true);
		};
		$scope.userAutoCompleteSimple = {
			minLength: 3,
			source: function(request, response) {
				var mapedUsers, found;

				mapedUsers = _.map($scope.activeUserList, function(user) {
					return {
						label: user.full_name || user.email,
						value: user.email
					};
				});
				found = $.ui.autocomplete.filter(mapedUsers, request.term);
				response(found);
			},
			select: function(event, ui) {
				var alreadyPresent = _.find($scope.emailList, function(email) {
					return email === ui.item.value;
				});
				if ( ! alreadyPresent ) {
					$scope.emailList.push( ui.item.value ); 
				}
				this.value = '';

				runDigestCycle();
				$scope.refreshFourthColumnScroll(true);

				return false;
			},
			focus: function(event, ui) {
				return false;
			}
		};
		$scope.userEmailTyped = function() {

		}

		$scope.selectSchedule = function(item, index) {
			var success = function(data) {
				$scope.selectedScheduleDetails = data;

				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.selectedSchedule = $scope.$parent.$parent.schedulesList[index];
				$scope.selectedSchedule.active = true;

				$scope.setViewCol( $scope.viewCols[3] );

				processScheduleDetails();
				setupFilters();
				applySavedFilters();

				$scope.refreshSecondColumnScroll(true);
				$scope.refreshThirdColumnScroll(true);
				$scope.refreshSecondColumnScroll(true);
				$scope.refreshFourthColumnScroll(true);

				$scope.$emit( 'hideLoader' );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			var params = {
				id: item.id
			};

			$scope.invokeApi( reportsSrv.fetchOneSchedule, params, success, failed );
		};

		$scope.getRepeatPer = function() {
			var found = _.find($scope.scheduleFreqType, { id: $scope.scheduleParams.frequency_id });
			return !! found ? found.value : 'Per';
		};

		$scope.saveSchedule = function() {
			var params = {
				id: $scope.selectedScheduleDetails.id,
				report_id: $scope.selectedScheduleDetails.report.id,
				hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
				/**/
				format_id: 1,
				delivery_method_id: 2
			};

			var filter_values = {
				page: 1,
				per_page: 25
			};

			// fill 'time' and 'time_period_id'
			if ( !! $scope.scheduleParams.time ) {
				params.time = $scope.scheduleParams.time;
			}
			if ( !! $scope.scheduleParams.time_period_id ) {
				params.time_period_id = $scope.scheduleParams.time_period_id;
			} 

			// fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
			params.frequency_id = $scope.scheduleParams.frequency_id;
			/**/
			if ( !! $scope.scheduleParams.starts_on ) {
				params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
			}
			if ( !! $scope.scheduleParams.repeats_every ) {
				params.repeats_every = $scope.scheduleParams.repeats_every;
			} else {
				params.repeats_every = 0;
			}
			if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
				params.ends_on_after = $scope.scheduleParams.ends_on_after;
			} else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
				params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
			} else {
				params.ends_on_after = null;
				params.ends_on_date = null;
			}

			// fill emails
			if ( $scope.emailList.length ) {
				params.emails = $scope.emailList.join(', ');
			} else {
				params.emails = '';
			}

			// fill sort_field and filters
			if ( !! $scope.scheduleParams.sort_field ) {
				filter_values.sort_field = $scope.scheduleParams.sort_field;
			}
			_.each($scope.filters, function(filter) {
				_.each(filter.data, function(each) {
					if ( each.selected ) {
						filter_values[each.paramKey] = true;
					}
				});
			});
			params.filter_values = filter_values;

			var success = function() {
				$scope.$emit( 'hideLoader' );
				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.setViewCol( $scope.viewCols[0] );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			$scope.invokeApi( reportsSrv.updateSchedule, params, success, failed );
		};



		var REPORT_SCHEDULES_SCROLL = 'REPORT_SCHEDULES_SCROLL';
		var SECOND_COLUMN_SCROLL = 'SECOND_COLUMN_SCROLL';
		var THIRD_COLUMN_SCROLL = 'THIRD_COLUMN_SCROLL';
		var FOURTH_COLUMN_SCROLL = 'FOURTH_COLUMN_SCROLL';
		var setupScrolls = function() {
			var scrollerOptions = {
			    tap: true,
			    preventDefault: false
			};

			$scope.setScroller(REPORT_SCHEDULES_SCROLL, scrollerOptions);
			$scope.setScroller(SECOND_COLUMN_SCROLL, scrollerOptions);
			$scope.setScroller(THIRD_COLUMN_SCROLL, scrollerOptions);
			$scope.setScroller(FOURTH_COLUMN_SCROLL, scrollerOptions);
		};
		var refreshScroll = function(name, reset) {
			$scope.refreshScroller(name);
			/**/
			if ( !! reset && $scope.myScroll.hasOwnProperty(name) ) {
			    $scope.myScroll[name].scrollTo(0, 0, 100);
			}
		};
		$scope.refreshReportSchedulesScroll = function(reset) {
			refreshScroll(REPORT_SCHEDULES_SCROLL, reset);
		};
		$scope.refreshSecondColumnScroll = function(reset) {
			refreshScroll(SECOND_COLUMN_SCROLL, reset);
		};
		$scope.refreshThirdColumnScroll = function(reset) {
			refreshScroll(THIRD_COLUMN_SCROLL, reset);
		};
		$scope.refreshFourthColumnScroll = function(reset) {
			refreshScroll(FOURTH_COLUMN_SCROLL, reset);
		};



		var matchGeneralOptions = {
			DUE_IN_ARRIVALS: 'DUE_IN_ARRIVALS',
			DUE_OUT_DEPARTURES: 'DUE_OUT_DEPARTURES',
			INCLUDE_CANCELED: 'INCLUDE_CANCELED',
			INCLUDE_NO_SHOW: 'INCLUDE_NO_SHOW',
			INCLUDE_NOTES: 'INCLUDE_NOTES',
			SHOW_GUESTS: 'SHOW_GUESTS',
			VIP_ONLY: 'VIP_ONLY'
		};

		var matchSortFields = {
			DATE: 'DATE',
			NAME: 'NAME',
			ROOM: 'ROOM',
			BALANCE: 'BALANCE',
			ROOM_NO: 'ROOM_NO'
		};

		var reportIconCls = {
			'Arriving Guests': 'guest-status check-in',
			'Departing Guests': 'guest-status check-out',
			'All In-House Guests': 'guest-status inhouse',
			'Balance for all Outstanding Accounts': 'icon-report icon-balance'
		};

		// this is a temporary setup
		// may have to share logic with 
		// rvReportUtilsFac.js in future
		var setupFilters = function() {
			$scope.filters = {};

			$scope.filters.hasGeneralOptions = {
				data: [],
				options: {
					selectAll: false,
					hasSearch: false,
					key: 'description'
				}
			};

			_.each($scope.selectedScheduleDetails.filters, function(filter) {
				var selected = false,
					mustSend = false;

				if ( matchGeneralOptions[filter.value] ) {
					if ( $scope.selectedScheduleDetails.report.description === 'Arriving Guests' && filter.value === 'DUE_IN_ARRIVALS' ) {
						selected = true;
					}

					if ( $scope.selectedScheduleDetails.report.description === 'Departing Guests' && filter.value === 'DUE_OUT_DEPARTURES' ) {
						selected = true;
					}

					$scope.filters.hasGeneralOptions.data.push({
						paramKey    : filter.value.toLowerCase(),
						description : filter.description,
						selected    : selected,
						mustSend    : mustSend
					});
				}
			});

			runDigestCycle();
		};

		var applySavedFilters = function() {
			_.each($scope.selectedScheduleDetails.filter_values, function(value, key) {
				var optionFilter, upperCaseKey;

				upperCaseKey = key.toUpperCase();
				if ( matchGeneralOptions[upperCaseKey] && !! value ) {
					optionFilter = _.find($scope.filters.hasGeneralOptions.data, { paramKey: key });
					if ( !! optionFilter ) {
						optionFilter.selected = true;
					}
				}

				if ( matchSortFields[value] ) {
					$scope.scheduleParams.sort_field = value;
				}
			});

			runDigestCycle();
		};

		var processScheduleDetails = function() {
			$scope.scheduleParams = {};

			if ( !! $scope.selectedScheduleDetails.time_period_id ) {
				$scope.scheduleParams.time_period_id = $scope.selectedScheduleDetails.time_period_id;
			} else {
				$scope.scheduleParams.time_period_id = undefined;
			}
			if ( !! $scope.selectedScheduleDetails.time ) {
				$scope.scheduleParams.time = $scope.selectedScheduleDetails.time;
			} else {
				$scope.scheduleParams.time = undefined;
			}

			if ( !! $scope.selectedScheduleDetails.frequency_id ) {
				$scope.scheduleParams.frequency_id = $scope.selectedScheduleDetails.frequency_id;
			} else {
				$scope.scheduleParams.frequency_id = undefined;
			}

			if ( !! $scope.selectedScheduleDetails.repeats_every ) {
				$scope.scheduleParams.repeats_every = $scope.selectedScheduleDetails.repeats_every;
			} else {
				$scope.scheduleParams.repeats_every = undefined;
			}

			if ( !! $scope.selectedScheduleDetails.ends_on_date && ! $scope.selectedScheduleDetails.ends_on_after ) {
				$scope.scheduleParams.scheduleEndsOn = 'DATE';
			} else if ( ! $scope.selectedScheduleDetails.ends_on_date && !! $scope.selectedScheduleDetails.ends_on_after ) {
				$scope.scheduleParams.ends_on_after = $scope.selectedScheduleDetails.ends_on_after;
				$scope.scheduleParams.scheduleEndsOn = 'NUMBER';
			} else {
				$scope.scheduleParams.scheduleEndsOn = 'NEVER';
			}

			var datePickerCommon = {
				dateFormat: $rootScope.jqDateFormat,
				numberOfMonths: 1,
				changeYear: true,
				changeMonth: true,
				beforeShow: function(input, inst) {
					$('#ui-datepicker-div');
					$('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
				},
				onClose: function(value) {
					$('#ui-datepicker-div');
					$('#ui-datepicker-overlay').remove();
				}
			};
			$scope.scheduleParams.starts_on = undefined;
			if ( !! $scope.selectedScheduleDetails.starts_on ) {
				$scope.startsOnOptions = angular.extend({
					onSelect: function(value) {
						$scope.endsOnOptions.minDate = value;
					}
				}, datePickerCommon);
				$scope.scheduleParams.starts_on = reportUtils.processDate($scope.selectedScheduleDetails.starts_on).today;
			}
			$scope.scheduleParams.ends_on_date = undefined;
			if ( !! $scope.selectedScheduleDetails.ends_on_date ) {
				$scope.endsOnOptions = angular.extend({
					onSelect: function(value) {
						$scope.startsOnOptions.maxDate = value;
					}
				}, datePickerCommon);
				$scope.scheduleParams.ends_on_date = reportUtils.processDate($scope.selectedScheduleDetails.ends_on_date).today;
			}

			// save emails
			if ( !! $scope.selectedScheduleDetails.emails ) {
				$scope.emailList = $scope.selectedScheduleDetails.emails.split(', ');
			} else {
				$scope.emailList = [];
			}

			$scope.timeSlots = reportUtils.createTimeSlots();
		};

		var fetchReportSchedulesFrequencyTimePeriod = function() {
			var success = function(payload) {
				$scope.$parent.$parent.schedulesList = payload.schedulesList;
				$scope.scheduleFrequency = payload.scheduleFrequency;
				$scope.scheduleTimePeriods = payload.scheduleTimePeriods;

				var getValue = function(value) {
					switch(value) {
						case 'DAILY':
							return 'Day';
						case 'HOURLY':
							return 'Hour';
						case 'WEEKLY':
							return 'Week';
						case 'MONTHLY':
							return 'Month';
						default:
							return 'Per';
					}
				};
				$scope.scheduleFreqType = _.map($scope.scheduleFrequency, function(freq) {
					return {
						id: freq.id,
						value: getValue(freq.value)
					};
				});

				_.each($scope.$parent.$parent.schedulesList, function(item) {
					if ( !! reportIconCls[item.report.description] ) {
						item.reportIconCls = reportIconCls[item.report.description];
					}
				});

				$scope.refreshReportSchedulesScroll(true);
				$scope.$emit( 'hideLoader' );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				refreshScrolls();
				$scope.$emit( 'hideLoader' );
			};

			if ( ! $scope.$parent.$parent.schedulesList.length ) {
				$scope.invokeApi( reportsSrv.reportSchedulesPayload, {}, success, failed );
			}
		};

		var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

		var init = function() {
			$scope.selectedSchedule = undefined;
			$scope.selectedScheduleDetails = undefined;

			$scope.$parent.$parent.schedulesList = [];
			$scope.scheduleTimePeriods =[];
			$scope.scheduleFrequency = [];
			$scope.scheduleFreqType = [];
			$scope.emailList = [];

			$scope.scheduleParams = {};

			setupScrolls();

			fetchReportSchedulesFrequencyTimePeriod();
		};

		init();
	}
]);