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
		};
		$scope.userAutoCompleteSimple = {
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
				return false;
			},
			focus: function(event, ui) {
				return false;
			}
		};

		$scope.selectSchedule = function(item, index) {
			var success = function(data) {
				$scope.selectedScheduleDetails = data;

				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.selectedSchedule = $scope.schedulesList[index];
				$scope.selectedSchedule.active = true;

				$scope.setViewCol( $scope.viewCols[3] );

				setupFilters();
				applySavedFilters();
				processScheduleDetails();

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

			// fill 'frequency_id', 'starts_on', 'repeats_every' and 'ends_on_date'
			params.frequency_id = $scope.scheduleParams.frequency_id;
			if ( !! $scope.scheduleParams.starts_on ) {
				params.starts_on = $filter('date')($scope.scheduleParams.starts_on, 'yyyy/MM/dd');
			} else {
				params.starts_on = null;
			}
			if ( $scope.scheduleParams.scheduleEndsOn === 'NUMBER' ) {
				params.repeats_every = $scope.scheduleParams.repeats_every;
				params.ends_on_date = null;
			} else if ( $scope.scheduleParams.scheduleEndsOn === 'DATE' ) {
				params.ends_on_date = $filter('date')($scope.scheduleParams.ends_on_date, 'yyyy/MM/dd');
				params.repeats_every = null;
			} else {
				params.repeats_every = null;
				params.ends_on_date = null;
			}

			// fill emails
			if ( $scope.emailList.length ) {
				params.emails = $scope.emailList.join(', ');
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
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			$scope.invokeApi( reportsSrv.updateSchedule, params, success, failed );
		};

		var REPORT_SCHEDULES_SCROLL = 'REPORT_SCHEDULES_SCROLL';
		var setupScrolls = function() {
			var scrollerOptions = {
			    tap: true,
			    preventDefault: false
			};

			$scope.setScroller(REPORT_SCHEDULES_SCROLL, scrollerOptions);
		};
		var refreshScrolls = function() {
			$scope.refreshScroller(REPORT_SCHEDULES_SCROLL);
			if ( $scope.myScroll.hasOwnProperty(REPORT_SCHEDULES_SCROLL) ) {
			    $scope.myScroll[REPORT_SCHEDULES_SCROLL].scrollTo(0, 0, 100);
			}
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
				var optionFilter;

				if ( matchGeneralOptions[key] && !! value ) {
					optionFilter = _.find($scope.filters.hasGeneralOptions.data, { paramKey: key.toLowerCase() });
					if ( !! optionFilter ) {
						optionFilter.selected = true;
					}
				}

				if ( matchSortFields[key] ) {
					$scope.chosen_sort_field = value;
				}
			});

			runDigestCycle();
		};

		var processScheduleDetails = function() {
			$scope.scheduleParams = {};

			if ( $scope.selectedScheduleDetails.hasOwnProperty('frequency') ) {
				$scope.scheduleParams.frequency_id = $scope.selectedScheduleDetails.frequency.id;
			} else {
				$scope.scheduleParams.frequency_id = undefined;
			}

			if ( $scope.selectedScheduleDetails.hasOwnProperty('repeates_every') ) {
				$scope.scheduleParams.repeats_every = $scope.selectedScheduleDetails.repeates_every;
			} else {
				$scope.scheduleParams.repeats_every = undefined;
			}

			if ( !! $scope.selectedScheduleDetails.ends_on_date && ! $scope.selectedScheduleDetails.ends_on_after ) {
				$scope.scheduleParams.scheduleEndsOn = 'DATE';
			} else if ( ! $scope.selectedScheduleDetails.ends_on_date && !! $scope.selectedScheduleDetails.ends_on_after ) {
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
		};

		var fetchReportSchedulesFrequency = function() {
			var success = function(payload) {
				$scope.schedulesList = payload.schedulesList;
				$scope.scheduleFrequency = payload.scheduleFrequency;

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

				refreshScrolls();
				$scope.$emit( 'hideLoader' );
			};

			var failed = function(errors) {
				$scope.errors = errors;
				$scope.$emit( 'hideLoader' );
			};

			if ( ! $scope.schedulesList.length ) {
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

			$scope.schedulesList = [];
			$scope.scheduleFrequency = [];
			$scope.scheduleFreqType = [];
			$scope.emailList = [];

			$scope.scheduleParams = {};

			setupScrolls();

			fetchReportSchedulesFrequency();
		};

		init();
	}
]);