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
	'ngDialog',
	function($rootScope, $scope, reportsSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, util, ngDialog) {
		BaseCtrl.call(this, $scope);

		// helper function 
		var findOccurance = function(item) {
			var occurance = 'Runs ',
				frequency = _.find($scope.scheduleFrequency, { id: item.frequency_id }).description;

			if ( ! item.repeats_every ) {
				occurance += frequency.toLowerCase();
			} else {
				occurance += 'after every ' + item.repeats_every + ' ';

				if ( 1 === item.frequency_id ) {
					occurance += (item.repeats_every === 1) ? 'day' : 'days';
				}
				if ( 2 === item.frequency_id ) {
					occurance += (item.repeats_every === 1) ? 'hour' : 'hours';
				}
				if ( 3 === item.frequency_id ) {
					occurance += (item.repeats_every === 1) ? 'week' : 'weeks';
				}
				if ( 4 === item.frequency_id ) {
					occurance += (item.repeats_every === 1) ? 'month' : 'months';
				}
			}

			return occurance;
		}

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

		$scope.pickSchedule = function(item, index) {
			var success = function(data) {
				$scope.selectedEntityDetails = data;
				$scope.isGuestBalanceReport = false;

				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.selectedSchedule = $scope.$parent.$parent.schedulesList[index];
				$scope.selectedSchedule.active = true;
				/**/
				$scope.selectedReport.active = false;

				$scope.addingStage = STAGES.SHOW_DISTRIBUTION;
				$scope.setViewCol( $scope.viewCols[3] );

				processScheduleDetails(item);
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

		$scope.check = function (argument) {
			ngDialog.open({
				template: '/assets/partials/reports/scheduleReport/rvConfirmDiscard.html',
				scope: $scope
			});
		}

		$scope.pickReport = function(item, index) {
			$scope.selectedEntityDetails = $scope.$parent.$parent.schedulableReports[index];
			$scope.isGuestBalanceReport = false;

			if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
				$scope.selectedReport.active = false;
			}
			$scope.selectedReport = $scope.$parent.$parent.schedulableReports[index];
			$scope.selectedReport.active = true;
			/**/
			$scope.selectedSchedule.active = false;

			$scope.addingStage = STAGES.SHOW_PARAMETERS;
			$scope.setViewCol( $scope.viewCols[1] );

			processScheduleDetails(item);
			setupFilters();
			applySavedFilters();

			$scope.refreshSecondColumnScroll(true);
			$scope.refreshThirdColumnScroll(true);
			$scope.refreshSecondColumnScroll(true);
			$scope.refreshFourthColumnScroll(true);
		}

		$scope.getRepeatPer = function() {
			var found = _.find($scope.scheduleFreqType, { id: $scope.scheduleParams.frequency_id });
			return !! found ? found.value : 'Per';
		};

		$scope.saveSchedule = function() {
			var params = {
				id: $scope.selectedEntityDetails.id,
				report_id: $scope.selectedEntityDetails.report.id,
				hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
				/**/
				format_id: 1,
				delivery_method_id: $scope.selectedEntityDetails.delivery_method.id
			};

			var filter_values = {
				page: 1,
				per_page: 99999
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
				$scope.errorMessage = "";
				$scope.$emit( 'hideLoader' );
				if ( !! $scope.selectedSchedule && $scope.selectedSchedule.active ) {
					$scope.selectedSchedule.active = false;
				}
				$scope.setViewCol( $scope.viewCols[0] );


				var updatedIndex = _.findIndex($scope.$parent.$parent.schedulesList, { id: params.id });
				if ( updatedIndex > -1 ) {
					$scope.$parent.$parent.schedulesList[updatedIndex].occurance = findOccurance($scope.$parent.$parent.schedulesList[updatedIndex]);
				}
			};

			var failed = function(errors) {
				$scope.errorMessage = errors;
				$scope.$emit( 'hideLoader' );
			};

			$scope.invokeApi( reportsSrv.updateSchedule, params, success, failed );
		};

		$scope.checkCanCreate = function() {
			$scope.createErrors = [];

			var hasTimePeriod = function() {
				if ( $scope.isGuestBalanceReport ) {
					return true;
				} else {
					return !! $scope.scheduleParams.time_period_id;
				}
			}

			var hasFrequency = function() {
				return !! $scope.scheduleParams.frequency_id;
			}

			var hasEmailList = function() {
				return $scope.emailList.length;
			}

			var canCreateSchedule = function() {
				return hasTimePeriod() && hasFrequency() && hasEmailList();
			}

			var fillErrors = function() {
				if ( ! $scope.isGuestBalanceReport && ! $scope.scheduleParams.time_period_id ) {
					$scope.createErrors.push('Time period in parameters');
				}
				if ( ! $scope.scheduleParams.frequency_id ) {
					$scope.createErrors.push('Repeat frequency in details');
				}
				if ( ! $scope.emailList.length ) {
					$scope.createErrors.push('Emails in distribution list');
				}
			}

			if ( canCreateSchedule() ) {
				$scope.createSchedule();
			} else {
				fillErrors();
				ngDialog.open({
					template: '/assets/partials/reports/scheduleReport/rvCantCreateSchedule.html',
					scope: $scope,
				});
			}
		}

		$scope.createSchedule = function() {
			var params = {
				report_id: $scope.selectedEntityDetails.report.id,
				hotel_id: $rootScope.hotelDetails.userHotelsData.current_hotel_id,
				/**/
				format_id: 1
			};

			var filter_values = {
				page: 1,
				per_page: 99999
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
				$scope.errorMessage = "";
				$scope.$emit( 'hideLoader' );
				if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
					$scope.selectedReport.active = false;
				}
				$scope.setViewCol( $scope.viewCols[0] );
				$scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

				fetch_reportSchedules_frequency_timePeriod_scheduableReports();
			};

			var failed = function(errors) {
				$scope.errorMessage = errors;
				$scope.$emit( 'hideLoader' );
			};

			$scope.invokeApi( reportsSrv.createSchedule, params, success, failed );
		};

		$scope.confirmDelete = function() {
			ngDialog.open({
				template: '/assets/partials/reports/scheduleReport/rvConfirmDeleteSchedule.html',
				scope: $scope
			});
		}

		$scope.deleteSchedule = function() {
			var success = function() {
				$scope.errorMessage = "";
				$scope.$emit( 'hideLoader' );
				if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
					$scope.selectedReport.active = false;
				}
				$scope.setViewCol( $scope.viewCols[0] );
				$scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

				fetch_reportSchedules_frequency_timePeriod_scheduableReports();
			};

			var failed = function(errors) {
				$scope.errorMessage = errors;
				$scope.$emit( 'hideLoader' );
			};

			$scope.closeDialog();
			$scope.invokeApi( reportsSrv.deleteSchedule, { id: $scope.selectedEntityDetails.id }, success, failed );
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
			INCLUDE_ACTIONS: 'INCLUDE_ACTIONS',
			SHOW_GUESTS: 'SHOW_GUESTS',
			VIP_ONLY: 'VIP_ONLY',
			// this filter for few reports could also be listed
			// under SHOW and not OPTIONS
			INCLUDE_DUE_OUT: 'INCLUDE_DUE_OUT'
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

			_.each($scope.selectedEntityDetails.filters, function(filter) {
				var selected = false,
					mustSend = false;

				if(filter.value == 'ACCOUNT' || filter.value == 'GUEST') {
					selected = true;
					$scope.filters.hasGeneralOptions.data.push({
						paramKey    : filter.value.toLowerCase(),
						description : filter.description,
						selected    : selected,
						mustSend    : mustSend
					});
				}

				selected = false;
				if ( matchGeneralOptions[filter.value] ) {
					
					if ( $scope.selectedEntityDetails.report.description === 'Arriving Guests' && filter.value === 'DUE_IN_ARRIVALS' ) {
						selected = true;
					}

					if ( $scope.selectedEntityDetails.report.description === 'Departing Guests' && filter.value === 'DUE_OUT_DEPARTURES' ) {
						selected = true;
					}

					if ( $scope.selectedEntityDetails.report.description === 'All In-House Guests' && filter.value === 'INCLUDE_DUE_OUT' ) {
					    selected = true;
					}

					$scope.filters.hasGeneralOptions.data.push({
						paramKey    : filter.value.toLowerCase(),
						description : filter.description,
						selected    : selected,
						mustSend    : mustSend
					});

					if ( $scope.selectedEntityDetails.report.description === 'Arriving Guests' || $scope.selectedEntityDetails.report.description === 'Departing Guests' ) {
						$scope.filters.hasGeneralOptions.options.noSelectAll = true;
					}
				}
			});

			runDigestCycle();
		};

		var applySavedFilters = function() {
			_.each($scope.selectedEntityDetails.filter_values, function(value, key) {
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

		var processScheduleDetails = function(report) {
			$scope.scheduleParams = {};

			var hasAccOrGuest, todayTimePeriod;
			
			hasAccOrGuest = _.find(report.filters, function(filter) {
				return filter.value == 'ACCOUNT' || filter.value == 'GUEST'
			});

			if ( !! hasAccOrGuest ) {
				todayTimePeriod = _.find($scope.scheduleTimePeriods, function(each) {
					return each.value === 'TODAY';
				});

				$scope.scheduleParams.time_period_id = todayTimePeriod.id
				$scope.isGuestBalanceReport = true;
			} else if ( !! $scope.selectedEntityDetails.time_period_id ) {
				$scope.scheduleParams.time_period_id = $scope.selectedEntityDetails.time_period_id;
			} else {
				$scope.scheduleParams.time_period_id = undefined;
			}

			
			if ( !! $scope.selectedEntityDetails.time ) {
				$scope.scheduleParams.time = $scope.selectedEntityDetails.time;
			} else {
				$scope.scheduleParams.time = undefined;
			}

			if ( !! $scope.selectedEntityDetails.frequency_id ) {
				$scope.scheduleParams.frequency_id = $scope.selectedEntityDetails.frequency_id;
			} else {
				$scope.scheduleParams.frequency_id = undefined;
			}

			if ( !! $scope.selectedEntityDetails.repeats_every ) {
				$scope.scheduleParams.repeats_every = $scope.selectedEntityDetails.repeats_every;
			} else {
				$scope.scheduleParams.repeats_every = undefined;
			}

			if ( !! $scope.selectedEntityDetails.ends_on_date && ! $scope.selectedEntityDetails.ends_on_after ) {
				$scope.scheduleParams.scheduleEndsOn = 'DATE';
			} else if ( ! $scope.selectedEntityDetails.ends_on_date && !! $scope.selectedEntityDetails.ends_on_after ) {
				$scope.scheduleParams.ends_on_after = $scope.selectedEntityDetails.ends_on_after;
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
			/**/
			var startsOn = $scope.selectedEntityDetails.starts_on || $rootScope.businessDate;
			var endsOnDate = $scope.selectedEntityDetails.ends_on_date || $rootScope.businessDate;
			/**/
			$scope.startsOnOptions = angular.extend({
				onSelect: function(value) {
					$scope.endsOnOptions.minDate = value;
				}
			}, datePickerCommon);
			$scope.scheduleParams.starts_on = reportUtils.processDate(startsOn).today;
			/**/
			$scope.endsOnOptions = angular.extend({
				onSelect: function(value) {
					$scope.startsOnOptions.maxDate = value;
				}
			}, datePickerCommon);
			$scope.scheduleParams.ends_on_date = reportUtils.processDate(endsOnDate).today;

			// save emails
			if ( !! $scope.selectedEntityDetails.emails ) {
				$scope.emailList = $scope.selectedEntityDetails.emails.split(', ');
			} else {
				$scope.emailList = [];	
			}

			$scope.timeSlots = reportUtils.createTimeSlots(30);
		};

		var fetch_reportSchedules_frequency_timePeriod_scheduableReports = function() {
			var success = function(payload) {
				$scope.scheduleFrequency = payload.scheduleFrequency;
				$scope.scheduleTimePeriods = payload.scheduleTimePeriods;
				$scope.$parent.$parent.schedulesList = [];
				$scope.$parent.$parent.schedulableReports = [];



				// sort schedule list by report name
				$scope.$parent.$parent.schedulesList = _.sortBy(
						payload.schedulesList,
						function(item){
							return item.report.title
						}
					);

				// add filtered out and occurance
				_.each($scope.$parent.$parent.schedulesList, function(item) {
					item.filteredOut = false;
					item.occurance = findOccurance(item);
				});

				// structure the schedulable reports exactly like the
				// schedules list, then we can re-use the support functions
				var found;
				_.each(payload.schedulableReports, function(id) {
					found = _.find($scope.$parent.$parent.reportList, { 'id': id });

					if ( !! found ) {
						$scope.$parent.$parent.schedulableReports.push({
							id: found.id,
							filters: found.filters,
							sort_fields: found.sort_fields,
							report: {
								id: found.id,
								description: found.description,
								title: found.title,
							},
							reportIconCls: found.reportIconCls,
							active: false,
							filteredOut: false
						});
					}
				});

				// sort schedulable reports by report name
				$scope.$parent.$parent.schedulableReports = _.sortBy(
						$scope.$parent.$parent.schedulableReports,
						function(item){
							return item.report.title
						}
					);
				

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

			$scope.invokeApi( reportsSrv.reportSchedulesPayload, {}, success, failed );
		};

		var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };


        $scope.scheduleReport = function() {
        	$scope.isAddingNew = true;
        	$scope.addingStage = STAGES.SHOW_PARAMETERS;

        	$scope.selectedSchedule.active = false;

        	$scope.switchReportView($scope.reportViews[2]);
        	$scope.setViewCol( $scope.viewCols[0] );
        }

        $scope.checkCanCancel = function() {
			var msg = '';

			if ( !! $scope.selectedReport && $scope.selectedReport.active ) {
				ngDialog.open({
					template: '/assets/partials/reports/scheduleReport/rvConfirmDiscard.html',
					scope: $scope
				});
			} else {
				$scope.cancelScheduleReport();
			}
		}

        $scope.cancelScheduleReport = function() {
        	$scope.isAddingNew = false;
        	$scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

        	$scope.selectedReport.active = false;

        	$scope.switchReportView( $scope.reportViews[2] );
        	$scope.setViewCol( $scope.viewCols[0] );

        	$scope.closeDialog();
        }

        $scope.goToNext = function() {
        	var noReset = true;

        	if ( $scope.addingStage === STAGES.SHOW_PARAMETERS ) {
        		$scope.addingStage = STAGES.SHOW_DETAILS;
        		$scope.setViewCol( $scope.viewCols[2], noReset );
        	} else if ( $scope.addingStage === STAGES.SHOW_DETAILS ) {
        		$scope.addingStage = STAGES.SHOW_DISTRIBUTION;
        		$scope.setViewCol( $scope.viewCols[3], noReset );
        	}

        	$scope.scrollToLast();
        }




        var STAGES = {
        	SHOW_SCHEDULE_LIST  : 'SHOW_SCHEDULE_LIST',
        	SHOW_PARAMETERS   : 'SHOW_PARAMETERS',
        	SHOW_DETAILS      : 'SHOW_DETAILS',
        	SHOW_DISTRIBUTION : 'SHOW_DISTRIBUTION'
        }

        $scope.shouldHideParametersCol = function() {
        	if ( $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST ) {
        		return true;
        	} else {
        		return false;
        	}
        }

        $scope.shouldHideDetailsCol = function() {
        	if ( $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST || $scope.addingStage === STAGES.SHOW_PARAMETERS ) {
        		return true;
        	} else {
        		return false;
        	}
        }

        $scope.shouldHideDistributionCol = function() {
        	if ( $scope.addingStage === STAGES.SHOW_SCHEDULE_LIST || $scope.addingStage === STAGES.SHOW_PARAMETERS || $scope.addingStage === STAGES.SHOW_DETAILS ) {
        		return true;
        	} else {
        		return false;
        	}
        }




		var init = function() {
			$scope.isAddingNew = false;
			$scope.addingStage = STAGES.SHOW_SCHEDULE_LIST;

			$scope.selectedSchedule = {};
			$scope.selectedReport = {};
			$scope.selectedEntityDetails = {};

			$scope.$parent.$parent.schedulesList = [];
			$scope.$parent.$parent.scheduleReport = [];
			$scope.scheduleTimePeriods =[];
			$scope.scheduleFrequency = [];
			$scope.scheduleFreqType = [];
			$scope.emailList = [];

			$scope.scheduleParams = {};

			setupScrolls();

			fetch_reportSchedules_frequency_timePeriod_scheduableReports();
		};

		init();
	}
]);