sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'payload',
	'RVreportsSrv',
	'RVreportsSubSrv',
	'RVReportUtilsFac',
	'RVReportParamsConst',
	'RVReportMsgsConst',
	'RVReportNamesConst',
	'$filter',
	'$timeout',
	'rvUtilSrv',
	function($rootScope, $scope, payload, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout, util) {

		BaseCtrl.call(this, $scope);

		$scope.isVisible = false;
        var isNotTimeOut = false;
        var timeOut;

		// set a back button, by default keep hidden
		$rootScope.setPrevState = {
			hide: true,
			title: $filter('translate')('REPORTS'),
			callback: 'goBackReportList',
			scope: $scope,

			// since there is no state change we must declare this explicitly
			// else there can be errors in future animations
			noStateChange: true
		};

		var listTitle = $filter('translate')('STATS_&_REPORTS_TITLE');
		$scope.setTitle(listTitle);
		$scope.heading = listTitle;
		$scope.$emit( "updateRoverLeftMenu", "reports" );

		$scope.reportList  = payload.reportsResponse.results;
		$scope.reportCount = payload.reportsResponse.total_count;

		$scope.codeSettings = payload.codeSettings;
		$scope.addons       = payload.addons;


		$scope.showReportDetails = false;

		// CICO-21232
		// HIDE export option in ipad and other devices
		// RESTRICT to ONLY desktop
		$scope.hideExportOption = !!sntapp.cordovaLoaded || util.checkDevice.any();

		var addonsCount = 0;
		_.each ($scope.addons, function (each) {
			addonsCount += each.list_of_addons.length;
		});

		// ctrls created for a specific reports, e.g: OccRev, may require
		// to show a modal for user to modify the report for print.
		// such ctrls can create 'showModal' and 'afterPrint' methods when initiating,
		// 'DetailsCtrl' will try and call 'showModal' and 'afterPrint',
		// before and after printing the report, allowing that ctrl to do what it
		// wants to do before bring and remove anything after print
		// NOTE: 'resetSelf' will be called by the 'ListCtrl', while opening a new report
		// in which case the old and new report IDs will be different
		$scope.printOptions = {
			resetSelf : function () {
				this.showModal  = undefined;
				this.afterPrint = undefined;
			}
		};
		$scope.printOptions.resetSelf();


		// lets fix the results per page to, user can't edit this for now
		// 25 is the current number set by backend server
		$scope.resultsPerPage = 25;

		$scope.goBackReportList = function() {
			$rootScope.setPrevState.hide = true;
			$scope.showReportDetails     = false;
			$scope.heading               = listTitle;
			$scope.showSidebar           = false;

			$scope.resetFilterItemsToggle();

			// tell report list controller to refresh scroll
			console.info( reportMsgs['REPORT_LIST_SCROLL_REFRESH'] );
			$scope.$broadcast( reportMsgs['REPORT_LIST_SCROLL_REFRESH'] );
		};


		// keep track of any errors
		$scope.errorMessage = [];

		$scope.showSidebar = false;
		$scope.toggleSidebar = function(e) {
			if ( !!e ) {
				if ( $(e.target).is('.ui-resizable-handle') ) {
					$scope.showSidebar = $scope.showSidebar ? false : true;
				};
				e.stopPropagation();
			} else {
				$scope.showSidebar = false;
			}
		};

		$scope.filterItemsToggle = {
			item_01: false,
			item_02: false,
			item_03: false,
			item_04: false,
			item_05: false,
			item_06: false,
			item_07: false,
			item_08: false,
			item_09: false,
			item_10: false,
			item_11: false,
			item_12: false,
			item_13: false,
			item_14: false,
			item_15: false,
			item_16: false,
			item_17: false,
			item_18: false,
			item_19: false,
			item_20: false,
			item_21: false,
			item_22: false,
			item_23: false,
			item_24: false,
			item_25: false,
			item_26: false,
			item_27: false,
			item_28: false
		};
		$scope.toggleFilterItems = function(item) {
			if ( $scope.filterItemsToggle.hasOwnProperty(item) ) {
				$scope.filterItemsToggle[item] = $scope.filterItemsToggle[item] ? false : true;
			};
		};
		$scope.resetFilterItemsToggle = function() {
			_.each($scope.filterItemsToggle, function(value, key) {
				$scope.filterItemsToggle[key] = false;
			});
		};




		// show only valid sort_by Options "Filter"
		$scope.showValidSortBy = function(sortBy) {
			return !!sortBy && !!sortBy.value;
		};

		// replace any char with single space " "
		// e.g -> filter:showValidSortBy:_
		$scope.replaceWithSpace = function(value, tobeReplaced) {
			return (!value) ? '' : value.replace(/_/g, ' ');
		};



		/**
		 * inorder to refresh after list rendering
		 */
		$scope.$on("NG_REPEAT_COMPLETED_RENDERING", function(event) {
			$scope.refreshScroller('report-list-scroll');
		});



		// common date picker options object
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
				$scope.showRemoveDateBtn();
			}
		};

		// common from and untill date picker options
		// with added limits to choose dates
		$scope.fromDateOptions = angular.extend({
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.untilDateOptions.minDate = value;
			}
		}, datePickerCommon);
		$scope.untilDateOptions = angular.extend({
			maxDate: $filter('date')($rootScope.businessDate, $rootScope.dateFormat),
			onSelect: function(value) {
				$scope.fromDateOptions.maxDate = value;
			}
		}, datePickerCommon);

		// common from and untill date picker options
		// with added limits to yesterday (BD - 1)
		$scope.fromDateOptionsTillYesterday = angular.extend({
			maxDate: function() {
				var currentDate = new tzIndependentDate($rootScope.businessDate);				
				currentDate.setDate(currentDate.getDate() - 1);
				return $filter('date')(currentDate, $rootScope.dateFormat);
			}(),
			onSelect: function(value) {
				$scope.untilDateOptions.minDate = value;
			}
		}, datePickerCommon);
		$scope.untilDateOptionsTillYesterday = angular.extend({
			maxDate: function() {
				var currentDate = new tzIndependentDate($rootScope.businessDate);
				currentDate.setDate(currentDate.getDate() - 1);
				return $filter('date')(currentDate, $rootScope.dateFormat);
			}(),
			onSelect: function(value) {
				$scope.fromDateOptions.maxDate = value;
			}
		}, datePickerCommon);

		// from and untill date picker options
		// with added limits to system (today) date
		$scope.fromDateOptionsSysLimit = angular.extend({
			maxDate: new Date(),
			onSelect: function(value) {
				$scope.untilDateOptions.minDate = value;
			}
		}, datePickerCommon);
		$scope.untilDateOptionsSysLimit = angular.extend({
			maxDate: new Date(),
			onSelect: function(value) {
				$scope.fromDateOptions.maxDate = value;
			}
		}, datePickerCommon);

		//for some of the reports we need to restrict max date selection to 1 year (eg:- daily production report)
		$scope.fromDateOptionsOneYearLimit = angular.extend({
			onSelect: function(value, datePickerObj) {
				var selectedDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

				$scope.toDateOptionsOneYearLimit.minDate = selectedDate;
				$scope.toDateOptionsOneYearLimit.maxDate = reportUtils.processDate(selectedDate).aYearAfter;
			}
		}, datePickerCommon);
		var datesUsedForCalendar = reportUtils.processDate();

		$scope.toDateOptionsOneYearLimit = angular.extend({
			minDate: datesUsedForCalendar.monthStart,
			maxDate: reportUtils.processDate(datesUsedForCalendar.monthStart).aYearAfter
		}, datePickerCommon);

		// custom from and untill date picker options
		// with no limits to choose dates
		$scope.fromDateOptionsNoLimit = angular.extend({}, datePickerCommon);
		$scope.untilDateOptionsNoLimit = angular.extend({}, datePickerCommon);

		var dbObj = reportUtils.processDate().businessDate;
		$scope.dateChanged = function (item, dateName) {

			// keep track of the report that has been
			// touched by the user
			$scope.touchedReport = item;
			$scope.touchedDate = dateName;

			if (item.title === reportNames['DAILY_PRODUCTION_DEMO']) {
				if (item.fromDate > item.untilDate) {
					item.untilDate = item.fromDate;
				}
			}

			if (item.title === reportNames['DAILY_PRODUCTION']) {
				if (item.fromDate > item.untilDate) {
					item.untilDate = item.fromDate;
				}
			}

			if ( item.title === reportNames['ARRIVAL'] ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueInArrivals = false;
				}
			};
			if ( item.title === reportNames['DEPARTURE'] ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueOutDepartures = false;
				}
			}
		};

		$scope.setTomorrowDate = function (item) {
			item.fromDate = reportUtils.processDate().tomorrow;
			item.untilDate = reportUtils.processDate().tomorrow;
		};

		// logic to re-show the remove date button
		$scope.showRemoveDateBtn = function() {
			var reportItem = $scope.touchedReport,
				dateName   = $scope.touchedDate,
				dateObj,
				otherDatesNames,
				otherFilledDates;

			if ( 'object' !== typeof reportItem || !reportItem.hasOwnProperty(dateName) ) {
				return;
			} else {
				dateObj = reportItem[dateName];
			}

			// 1 - if date is valid for this 'dateItem' in this 'reportItem'
			// 2.1 - if this is the only date in this 'reportItem', enable 'showRemove'
			// 2.2 - else find out other dates available on this 'reportItem'
			//     - if any of the other dates have valid date value, enable 'showRemove'
			if ( isDateValid(reportItem, dateName) ) {
				if ( reportItem['allDates'].length === 1 ) {
					dateObj['showRemove'] = true;
				} else {
					otherDatesNames = _.without( reportItem['allDates'], dateName );

					otherFilledDates = _.find(otherDatesNames, function(name) {
						return isDateValid( reportItem, name );
					});

					if ( !!otherFilledDates ) {
						dateObj['showRemove'] = true;
						reportItem[otherFilledDates]['showRemove'] = true;

						forceScopeApply();
					};
				};
			};

			function isDateValid (report, name) {
				var from  = true,
					until = true;

				var _dateObj = report[name];

				if ( _dateObj.hasOwnProperty('fromModel') && report[_dateObj['fromModel']] === undefined ) {
					from = false;
				};

				if ( _dateObj.hasOwnProperty('untilModel') && report[_dateObj['untilModel']] === undefined ) {
					until = false;
				};

				return from && until ? true : false;
			};

			function forceScopeApply () {
				var retry = function() {
					if ( $scope && 'function' === typeof $scope.apply ) {
						$scope.apply();
					} else {
						$timeout(retry, 100);
					}
				};

				$timeout(retry, 100);
			};
		};

		$scope.clearDateFromFilter = function(reportItem, dateName) {
			var fromModel  = reportItem[dateName]['fromModel'],
				untilModel = reportItem[dateName]['untilModel'],
				otherDates = _.without( reportItem['allDates'], dateName ),
				otherFilledDates = 0,
				lastDate;

			// empty dates
			if ( reportItem.hasOwnProperty(fromModel) ) {
				reportItem[fromModel]  = undefined;
			};
			if ( reportItem.hasOwnProperty(untilModel) ) {
				reportItem[untilModel] = undefined;
			};

			// hide remove date button
			reportItem[dateName]['showRemove'] = false;

			// hide remove button for the last date
			if ( otherDates.length === 1 ) {
				lastDate = otherDates[0];
				reportItem[lastDate]['showRemove'] = false;
			} else {
				_.each(otherDates, function(each) {
					if ( reportItem[each]['showRemove'] ) {
						lastDate = each;
						otherFilledDates += 1;
					};
				});

				if ( otherFilledDates === 1 ) {
					reportItem[lastDate]['showRemove'] = false;
				};
			};
		};



		// auto correct the CICO value;
		var getProperCICOVal = function(type) {
			var chosenReport = reportsSrv.getChoosenReport();

			// only do this for this report
			// I know this is ugly :(
			if ( chosenReport.title !== reportNames['CHECK_IN_CHECK_OUT'] ) {
				return;
			};

			// if user has not chosen anything
			// both 'checked_in' & 'checked_out' must be true
			if (!chosenReport.chosenCico) {
				chosenReport.chosenCico = 'BOTH';
				return true;
			};

			// for 'checked_in'
			if (type === 'checked_in') {
				return chosenReport.chosenCico === 'IN' || chosenReport.chosenCico === 'BOTH';
			};

			// for 'checked_out'
			if (type === 'checked_out') {
				return chosenReport.chosenCico === 'OUT' || chosenReport.chosenCico === 'BOTH';
			};
		};


		$scope.sortByChanged = function(item) {
            var _sortBy;

            // un-select sort dir of others
            // and get a ref to the chosen item
            _.each(item.sortByOptions, function(each) {
                if (each && each.value !== item.chosenSortBy) {
                    each.sortDir = undefined;
                } else if (each && each.value === item.chosenSortBy) {
                    _sortBy = each;
                }
            });

            // select sort_dir for chosen item
            if (!!_sortBy) {
                _sortBy.sortDir = true;
            };
        };



		$scope.catchFauxSelectClick = function(e, currentFaux) {
			e && e.stopPropagation();

			_.each($scope.reportList, function(element, index) {
				_.each(element, function(value, key) {
					if ( key !== currentFaux && (!!value && value.type === 'FAUX_SELECT') ) {
						value.show = false;
					};
				});
			});
		};

		$scope.toggleFauxSelect = function(e, fauxDS) {
			$timeout(function(){
				$scope.refreshScroller('report-list-scroll');
				$scope.myScroll['report-list-scroll'].refresh();
			}, 100);

			if ( !e || !fauxDS ) {
				return;
			};

			fauxDS.show = !fauxDS.show;
		};

		$scope.fauxSelectChange = function(reportItem, fauxDS, allTapped) {
			var selectedItems = getSelectedItems(reportItem, fauxDS, allTapped);
		};

		var getSelectedItems = function (reportItem, fauxDS, allTapped) {
			var selectedItems;

			if ( allTapped ) {
                if ( fauxDS.selectAll ) {
                    fauxDS.title = 'All Selected';
                } else {
                    fauxDS.title = fauxDS.defaultTitle;
                };

                _.each(fauxDS.data, function(each) {
                    each.selected = fauxDS.selectAll;
                });

                selectedItems = _.where(fauxDS.data, { selected: true });
            } else {
                selectedItems = _.where(fauxDS.data, { selected: true });

                if ( selectedItems.length === 0 ) {
                    fauxDS.title = fauxDS.defaultTitle;
                } else if ( selectedItems.length === 1 ) {
                    fauxDS.title = selectedItems[0].description || selectedItems[0].name || selectedItems[0].status;
                } else if ( selectedItems.length === fauxDS.data.length ) {
                    fauxDS.selectAll = true;
                    fauxDS.title = 'All Selected';
                } else {
                    fauxDS.selectAll = false;
                    fauxDS.title = selectedItems.length + ' Selected';
                };

				// CICO-10202
				$scope.$emit( reportMsgs['REPORT_FILTER_CHANGED'] );
			};

			return selectedItems;
		};

		//Get the charge codes corresponding to selected charge groups
		$scope.chargeGroupfauxSelectChange = function (reportItem, fauxDS, allTapped) {
			var selectedItems = getSelectedItems(reportItem, fauxDS, allTapped);

			_.each (reportItem.hasByChargeCode.originalData, function (each) {
				each.disabled = true;
			});

			_.each (reportItem.hasByChargeCode.originalData, function (each) {
				_.each (each.associcated_charge_groups, function (chargeGroup) {
					_.each (selectedItems, function (eachItem) {
						if (chargeGroup.id === eachItem.id) {
							each.disabled = false;
						}
					});
				});
			});

			$scope.chargeCodeFauxSelectChange(reportItem, reportItem.hasByChargeCode, allTapped);
		};

		//Refill hasByChargeCode.data with the charge codes corresponding to selected charge groups
		$scope.chargeCodeFauxSelectChange = function (reportItem, fauxDS, allTapped) {
			var requiredChardeCodes = [];

			_.each (fauxDS.originalData, function (each) {
				if (!each.disabled) {
					requiredChardeCodes.push(each);
				}
			});

			fauxDS.data = requiredChardeCodes;
			var selectedItems = getSelectedItems(reportItem, fauxDS, allTapped);
		};

		// show the no.of addons selected
		$scope.getNoOfSelectedAddons = function (reportItem, fauxDS) {
			var selectedItems = [],
			    count = 0;

			_.each (fauxDS.data, function (each) {
				var selectedAddons = _.where(each.list_of_addons, { selected: true });
				selectedItems.push(selectedAddons);
				count += selectedAddons.length;
			});

			if ( count === 0 ) {
                fauxDS.title = fauxDS.defaultTitle;
            }
            else if ( count === 1 ) {
            	_.each (selectedItems, function (each) {
            		_.each (each, function (addon) {
            			if (addon.selected == true) {
            				fauxDS.title = addon.addon_name;
            			}
            		});
            	});
            }
            else if ( count == addonsCount ) {
            	fauxDS.title = "All Selected";
            }
            else {
            	fauxDS.title = count + ' Selected';
            }
		};

		$scope.toggleAddons = function () {
            $scope.isVisible = $scope.isVisible ? false : true;
        };

        $scope.getGroupName = function (groupId) {
        	var groupName;
        	angular.forEach ($scope.addonGroups, function (key) {
        		if (key.id == groupId) {
        			groupName = key.name;
        		}
        	});
        	return groupName;
        };

        $scope.getAddons = function (reportItem, fauxDS, allTapped) {
        	var selectedItems = getSelectedItems(reportItem, fauxDS, allTapped);

            if (isNotTimeOut) {
                clearTimeout(timeOut);
            }
            isNotTimeOut = true;
            timeOut = setTimeout(function () {
                isNotTimeOut = false;
                showAddons(reportItem, selectedItems);
            }, 2000);

            // calling the super
            $scope.fauxSelectChange(reportItem, fauxDS);
        };

        // fetch the addons corresponding to selected addon groups
        var showAddons = function (reportItem, selectedItems) {
            var selectedIds = [];

            angular.forEach(selectedItems, function (key) {
                selectedIds.push(key.id);
            });

            var groupIds = {
                "addon_group_ids" : selectedIds
            };

            // this is very crude way of manupulating the data
            // this must some day be moved all to or atleast
            // handled by the service
            var sucssCallback = function (data) {
                var data = data;

                _.each(data, function(item) {
	                _.each(item['list_of_addons'], function(entry) {
	                    entry.selected = true;
	                });
	            });

	            reportItem.hasAddons.data = data;

                $scope.$emit( 'hideLoader' );
            };

            var errorCallback = function (data) {
                $scope.$emit( 'hideLoader' );
            };

            $scope.invokeApi(reportsSubSrv.fetchAddons, groupIds, sucssCallback, errorCallback);
        };

		function genParams (report, page, perPage, changeAppliedFilter) {
			var params = {
				'id'       : report.id,
				'page'     : page,
				'per_page' : perPage
			};

			var key         = '',
				fromKey     = '',
				untilKey    = '',
				checkInKey  = '',
				checkOutKey = '',
				selected    = [];

			var changeAppliedFilter = 'boolean' == typeof changeAppliedFilter ? changeAppliedFilter : true;

			// capturing the filters applied to be
			// shown on the report details footer
			if ( changeAppliedFilter ) {
				$scope.appliedFilter = {
					'options'      : [],
					'display'      : [],
					'markets'      : [],
					'sources'      : [],
					'origins'      : [],
					'guarantees'   : [],
					'chargeGroups' : [],
					'chargeCodes'  : [],
					'holdStatuses' : [],
					'addonGroups'  : [],
					'addons'       : [],
					'reservationStatus' : [],
					'guestOrAccount': []
				};
			};

			// include dates
			if (!!report.hasDateFilter) {
				fromKey  = reportParams['FROM_DATE'];
				untilKey = reportParams['TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['fromDate'] = angular.copy( report.fromDate );
					$scope.appliedFilter['toDate']   = angular.copy( report.untilDate );
				}	
			};

			// include cancel dates
			if (!!report.hasCancelDateFilter) {
				fromKey  = reportParams['CANCEL_FROM_DATE'];
				untilKey = reportParams['CANCEL_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromCancelDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilCancelDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['cancelFromDate'] = angular.copy( report.fromCancelDate );
					$scope.appliedFilter['cancelToDate']   = angular.copy( report.untilCancelDate );
				};
			};

			// include arrival dates -- IFF both the limits of date range have been selected
			if (!!report.hasArrivalDateFilter && !!report.fromArrivalDate && !!report.untilArrivalDate) {
				fromKey  = reportParams['ARRIVAL_FROM_DATE'];
				untilKey = reportParams['ARRIVAL_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromArrivalDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilArrivalDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['arrivalFromDate'] = angular.copy( report.fromArrivalDate );
					$scope.appliedFilter['arrivalToDate']   = angular.copy( report.untilArrivalDate );
				};
			};

			// include group start dates -- IFF both the limits of date range have been selected
			if (!!report.hasGroupStartDateRange && !!report.groupStartDate && !!report.groupEndDate) {
				fromKey  = reportParams['GROUP_START_DATE'];
				untilKey = reportParams['GROUP_END_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.groupStartDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.groupEndDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['groupFromDate'] = angular.copy( report.groupStartDate );
					$scope.appliedFilter['groupToDate']   = angular.copy( report.groupEndDate );
				};
			};

			// include deposit due dates
			if (!!report.hasDepositDateFilter) {
				fromKey  = reportParams['DEPOSIT_FROM_DATE'];
				untilKey = reportParams['DEPOSIT_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromDepositDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilDepositDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['depositFromDate'] = angular.copy( report.fromDepositDate );
					$scope.appliedFilter['depositToDate']   = angular.copy( report.untilDepositDate );
				};
			};

			// include paid dates
			if (!!report.hasPaidDateRange) {
				fromKey  = reportParams['PAID_FROM_DATE'];
				untilKey = reportParams['PAID_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromPaidDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilPaidDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['paidFromDate'] = angular.copy( report.fromPaidDate );
					$scope.appliedFilter['paidToDate']   = angular.copy( report.untilPaidDate );
				};
			};

			// include create dates
			if (!!report.hasCreateDateFilter) {
				fromKey  = reportParams['CREATE_FROM_DATE'];
				untilKey = reportParams['CREATE_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromCreateDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilCreateDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['createFromDate'] = angular.copy( report.fromCreateDate );
					$scope.appliedFilter['createToDate']   = angular.copy( report.untilCreateDate );
				};
			};

			// include single dates
			if (!!report.hasSingleDateFilter) {
				key = reportParams['SINGLE_DATE'];
				/**/
				params[key] = $filter('date')(report.singleValueDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['singleValueDate'] = angular.copy( report.singleValueDate );
				};
			};

			// include rate adjustment dates
			if (!!report.hasAdjustmentDateRange) {
				fromKey  = reportParams['ADJUSTMENT_FROM_DATE'];
				untilKey = reportParams['ADJUSTMENT_TO_DATE'];
				/**/
				params[fromKey]  = $filter('date')(report.fromAdjustmentDate, 'yyyy/MM/dd');
				params[untilKey] = $filter('date')(report.untilAdjustmentDate, 'yyyy/MM/dd');
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['adjustmentFromDate'] = angular.copy( report.fromAdjustmentDate );
					$scope.appliedFilter['adjustmentToDate']   = angular.copy( report.untilAdjustmentDate );
				};
			};

			// include times
			if (report.hasTimeFilter) {
				if ( report.fromTime ) {
					key         = reportParams['FROM_TIME'];
					params[key] = report.fromTime;
					/**/
					if ( changeAppliedFilter ) {
						$scope.appliedFilter['fromTime'] = angular.copy( report.fromTime );
					};
				};

				if ( report.untilTime ) {
					key         = reportParams['TO_TIME'];
					params[key] = report.untilTime;
					/**/
					if ( changeAppliedFilter ) {
						$scope.appliedFilter['toTime'] = angular.copy( report.untilTime );
					};
				};
			};

			// include CICO filter
			if (!!report.hasCicoFilter) {
				checkInKey  = reportParams['CHECKED_IN'];
				checkOutKey = reportParams['CHECKED_OUT'];
				/**/
				params[checkInKey]  = getProperCICOVal('checked_in');
				params[checkOutKey] = getProperCICOVal('checked_out');
				/**/
				if ( changeAppliedFilter ) {
					if ( params[checkInKey] && params[checkOutKey] ) {
						$scope.appliedFilter['cicoTypes'] = 'Check Ins & Check Outs';
					} else if ( params[checkInKey] ) {
						$scope.appliedFilter['cicoTypes'] = 'Only Check Ins';
					} else if ( params[checkOutKey] ) {
						$scope.appliedFilter['cicoTypes'] = 'Only Check Outs';
					};
				};
			};

			// include user ids
			if (report.hasUserFilter && report.chosenUsers && report.chosenUsers.length) {
				key         = reportParams['USER_IDS'];
				params[key] = [];
				/**/
				_.each(report.chosenUsers, function(user) {
					params[key].push( user );
				});
				/**/
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['users'] = [];
					_.each(report.chosenUsers, function (id) {
						var _user = _.find($scope.activeUserList, function (each) {
							return each.id === id;
						});
						if ( !! _user ) {
							$scope.appliedFilter['users'].push( _user.full_name );
						};
					});
				};
			};

			// include sort bys
			if ( report.sortByOptions ) {
				if ( !! report.chosenSortBy ) {
					key         = reportParams['SORT_FIELD'];
					params[key] = report.chosenSortBy;
				};
				/**/
				var _chosenSortBy = _.find(report.sortByOptions, function(item) {
					return item && item.value === report.chosenSortBy;
				});
				if ( !! _chosenSortBy && 'boolean' === typeof _chosenSortBy.sortDir ) {
					key         = reportParams['SORT_DIR'];
					params[key] = _chosenSortBy.sortDir;
				};
				/**/
				if ( changeAppliedFilter ) {
					if ( !! _chosenSortBy ) {
						$scope.appliedFilter['sortBy'] = _chosenSortBy.description;
					};
					if ( !! _chosenSortBy && 'boolean' === typeof _chosenSortBy.sortDir ) {
						$scope.appliedFilter['sortDir'] = _chosenSortBy.sortDir ? 'Ascending' : 'Descending';
					};
				};
			};

			// include group bys
			if ( report.groupByOptions ) {
				key = '';
				/**/
				if ( 'DATE' === report.chosenGroupBy ) {
					key = reportParams['GROUP_BY_DATE'];
				} else if ( 'USER' === report.chosenGroupBy ) {
					key = reportParams['GROUP_BY_USER'];
				} else if ( 'GROUP_NAME' === report.chosenGroupBy ) {
					key = reportParams['GROUP_BY_GROUP_NAME'];
				};

				/**/
				if ( !! key ) {
					params[key] = true;
					/**/
					if ( changeAppliedFilter ) {
						$scope.appliedFilter['groupBy'] = key.replace( 'GROUP_BY_', '' ).replace( '_', ' ' );
					};
				};

				// patch
				if ( 'ADDON' === report.chosenGroupBy || 'DATE' === report.chosenGroupBy ) {
					key = reportParams['ADDON_GROUP_BY'];
					params[key] = report.chosenGroupBy;
					/**/
					if ( changeAppliedFilter ) {
						$scope.appliedFilter['groupBy'] = 'GROUP BY ' + report.chosenGroupBy;
					};
				}
			};

			// reset 'chosenOptions' and generate params for selected options
			if ( report['hasGeneralOptions']['data'].length ) {
				report.chosenOptions = {};
				/**/
				_.each(report['hasGeneralOptions']['data'], function(each) {
					if ( each.selected ) {
						key                             = each.paramKey;
						params[key]                     = true;
						report.chosenOptions[key] = true;
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.options.push( each.description );
						};
					} else if ( ! each.selected && each.mustSend ) {
						key         = each.paramKey;
						params[key] = false;
					};
				});
			};

			// generate params for selected displays
			if ( report['hasDisplay']['data'].length ) {
				_.each(report['hasDisplay']['data'], function(each) {
					if ( each.selected ) {
						key         = each.paramKey;
						params[key] = true;
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.display.push( each.description );
						};
					};
				});
			};

			// generate params for guest or account
			if ( report['hasGuestOrAccountFilter']['data'].length ) {
				_.each(report['hasGuestOrAccountFilter']['data'], function(each) {
					if ( each.selected ) {
						key         = each.paramKey;
						params[key] = true;
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.guestOrAccount.push( each.description );
						};
					};
				});
			};

			// include company/ta/group
			if ( report.hasOwnProperty('hasIncludeComapnyTaGroup') && !!report.chosenIncludeComapnyTaGroup ) {
				key         = report.hasIncludeComapnyTaGroup.value.toLowerCase();
				params[key] = report.chosenIncludeComapnyTaGroup;
				/* Note: Using the ui value here */
				if ( changeAppliedFilter ) {
					$scope.appliedFilter['companyTaGroup'] = report.uiChosenIncludeComapnyTaGroup;
				};		
			};

			// selected markets
			if ( report.hasOwnProperty('hasMarketsList') ) {
				selected = _.where( report['hasMarketsList']['data'], { selected: true } );

				if ( selected.length > 0 ) {
					key         = reportParams['MARKET_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(market) {
						params[key].push( market.value );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.markets.push( market.name );
						};
					});

					// in case if all markets are selected
					if ( changeAppliedFilter && report['hasMarketsList']['data'].length === selected.length ) {
						$scope.appliedFilter.markets = ['All Markets'];
					};
				};
			};

			// selected source
			if ( report.hasOwnProperty('hasSourcesList') ) {
				selected = _.where( report['hasSourcesList']['data'], { selected: true } );

				if ( selected.length > 0 ) {
					key         = reportParams['SOURCE_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(source) {
						params[key].push( source.value );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.sources.push( source.name );
						};
					});

					// in case if all sources are selected
					if ( changeAppliedFilter && report['hasSourcesList']['data'].length === selected.length ) {
						$scope.appliedFilter.sources = ['All Sources'];
					};
				};
			};

			// selected origin
			if ( report.hasOwnProperty('hasOriginsList') ) {
				selected = _.where( report['hasOriginsList']['data'], { selected: true } );

				if ( selected.length > 0 ) {
					key         = reportParams['BOOKING_ORIGIN_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(origin) {
						params[key].push( origin.value );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.origins.push( origin.name );
						};
					});

					// in case if all origins are selected
					if ( changeAppliedFilter && report['hasOriginsList']['data'].length === selected.length ) {
						$scope.appliedFilter.origins = ['All Origins'];
					};
				};
			};

			// include guarantee type
			if ( report.hasOwnProperty('hasGuaranteeType') ) {
				selected = _.where( report['hasGuaranteeType']['data'], { selected: true } );

				if ( selected.length > 0) {
					key         = reportParams['INCLUDE_GUARANTEE_TYPE'];
					params[key] = [];
					/**/
					_.each(selected, function(guarantee) {
						params[key].push( guarantee.name );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.guarantees.push( guarantee.name );
						};
					});

					// in case if all guarantee type is selected
					if ( changeAppliedFilter && report['hasGuaranteeType']['data'].length === selected.length ) {
						$scope.appliedFilter.guarantees = ['All Guarantees'];
					};
				};
			};

			// include charge groups
			if (report.hasOwnProperty('hasByChargeGroup')) {
				selected = _.where( report['hasByChargeGroup']['data'], { selected: true } );

				if ( selected.length > 0 ) {
					key         = reportParams['CHARGE_GROUP_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(cg) {
						params[key].push( cg.id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.chargeGroups.push( cg.description );
						};
					});

					// in case if all charge groups is selected
					if ( changeAppliedFilter && report['hasByChargeGroup']['data'].length === selected.length ) {
						$scope.appliedFilter.chargeGroups = ['All Groups'];
					};
				};
			};

			// include charge code
			if (report.hasOwnProperty('hasByChargeCode')) {
				selected = _.where(report['hasByChargeCode']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key         = reportParams['CHARGE_CODE_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(cc) {
						params[key].push( cc.id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.chargeCodes.push( cc.description );
						};
					});

					// in case if all charge code is selected
					if ( changeAppliedFilter && report['hasByChargeCode']['data'].length === selected.length ) {
						$scope.appliedFilter.chargeCodes = ['All Codes'];
					};
				};
			};

			// include hold status
			if ( report.hasOwnProperty('hasHoldStatus') ) {
				selected = _.where(report['hasHoldStatus']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key         = reportParams['HOLD_STATUS_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(status) {
						params[key].push( status.id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.holdStatuses.push( status.description );
						};		
					});

					// in case if all charge code is selected
					if ( changeAppliedFilter && report['hasHoldStatus']['data'].length === selected.length ) {
						$scope.appliedFilter.holdStatuses = ['All Status'];
					};
				};
			};

			// include addon groups
			if ( report.hasOwnProperty('hasAddonGroups') ) {
				selected = _.where(report['hasAddonGroups']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key         = reportParams['ADDONS_GROUPS_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(group) {
						params[key].push( group.id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.addonGroups.push( group.description );
						};
					});

					// in case if all addon groups are selected
					if ( changeAppliedFilter && report['hasAddonGroups']['data'].length === selected.length ) {
						$scope.appliedFilter.addonGroups = ['All Addon Groups'];
					};
				};
			};

			// include addons
			if ( report.hasOwnProperty('hasAddons') ) {
				var addonsLength = 0;

				selected = [];
				_.each(report['hasAddons']['data'], function(each) {
					var chosen = _.where(each['list_of_addons'], { selected: true });
					selected   = selected.concat(chosen);

					addonsLength += each['list_of_addons'].length;
				});

				if ( selected.length > 0 ) {
					key         = reportParams['ADDONS_IDS'];
					params[key] = [];
					/**/
					_.each(selected, function(each) {
						params[key].push( each.addon_id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.addons.push( each.addon_name );
						};
					});

					// in case if all addon groups are selected
					if ( changeAppliedFilter && addonsLength === selected.length ) {
						$scope.appliedFilter.addons = ['All Addons'];
					};
				};
			};

			// include addons
			if ( report.hasOwnProperty('hasReservationStatus') ) {
				selected = _.where(report['hasReservationStatus']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key         = reportParams['RESERVATION_STATUS'];
					params[key] = [];
					/**/
					_.each(selected, function(each) {
						params[key].push( each.id );
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter.reservationStatus.push( each.status );
						};
					});

					// in case if all reservation status are selected
					if ( changeAppliedFilter && report['hasReservationStatus']['data'].length === selected.length ) {
						$scope.appliedFilter.reservationStatus = ['All Reservation Status'];
					};
				};
			};

			// need to reset the "group by" if any new filter has been applied
			// Added a patch to ignore the following for addon forecast report
			// @TODO: Fix this. May be refactor the whole logic
			if ( !!report.groupByOptions && !!$scope.oldParams && reportNames['ADDON_FORECAST'] != report.title ) {
				for (key in params) {
					if ( !params.hasOwnProperty(key) ) {
					    continue;
					};

					if ( key === 'group_by_date' || key === 'group_by_user' || key === 'group_by_group_name' || key === 'page' || key === 'per_page' ) {
						continue;
					} else if ( params[key] !== $scope.oldParams[key] ) {
						report.chosenGroupBy = 'BLANK';
						/**/
						if ( params.hasOwnProperty('group_by_date') ) {
							params['group_by_date'] = undefined;
						};
						if ( params.hasOwnProperty('group_by_user') ) {
							params['group_by_user'] = undefined;
						};
						/**/
						if ( params.hasOwnProperty('group_by_group_name') ) {
							params['group_by_group_name'] = undefined;
						};
						/**/
						if ( changeAppliedFilter ) {
							$scope.appliedFilter['groupBy'] = undefined;
						}
						break;
					};
				};
			};

			// keep a copy of the current params
			$scope.oldParams = angular.copy( params );

			return params;
		};

		/**
		 * Should we show export button
		 * @return {Boolean}
		 */
		$scope.shouldShowExportButton = function(name) {
			//As per CICO-21232 we should show this for DAILY PRODUCTION REPORT
			return (name === reportNames['DAILY_PRODUCTION']);
		};

		/**
		 * function to get the export url for a report
		 * @return {String}
		 */
		$scope.getExportUrl = function(report) {
			var chosenReport = report || reportsSrv.getChoosenReport();

			var exportUrl 		      = "",
				loadPage 			  = 1,
				resultPerPageOverride = true,
				changeAppliedFilter   = false,
				params;

			if ( _.isEmpty(chosenReport) ) { //I dont know why chosenReport becoming undefined in one loop, need to check with Vijay
				return exportUrl;
			};

			switch ( chosenReport.title ) {
				case reportNames['DAILY_PRODUCTION']:
					params = jQuery.param( genParams(chosenReport, loadPage, resultPerPageOverride, changeAppliedFilter) );
					exportUrl = "/api/reports/" + chosenReport.id + "/submit.csv?" + params;
					break;

				default:
					exportUrl = "/api/reports/"+ chosenReport.id +"/submit.csv?" + jQuery.param( genParams(chosenReport, loadPage, resultPerPageOverride) );
					break;
			};

			return exportUrl;
		};

		// generate reports
		$scope.genReport = function(changeView, loadPage, resultPerPageOverride) {
			var chosenReport = reportsSrv.getChoosenReport(),
				changeView   = 'boolean' === typeof changeView ? changeView : true,
				page         = !!loadPage ? loadPage : 1;

			var params = genParams(chosenReport, page, resultPerPageOverride || $scope.resultsPerPage);

			// fill in data into seperate props
			var updateDS = function (response) {
				$scope.totals          = response.totals || [];
				$scope.headers         = response.headers || [];
				$scope.subHeaders      = response.sub_headers || [];
				$scope.results         = response.results || [];
				$scope.resultsTotalRow = response.results_total_row || [];
				$scope.summaryCounts   = response.summary_counts || [];
				$scope.reportGroupedBy = response.group_by || '';

				// track the total count
				$scope.totalCount = response.total_count || 0;
				$scope.currCount = response.results ? response.results.length : 0;
			};

			var sucssCallback = function(response) {
				var msg = '';

				if ( changeView ) {
					$rootScope.setPrevState.hide = false;
					$scope.showReportDetails = true;
				};

				updateDS( response );

				$scope.errorMessage = [];
				$scope.$emit( 'hideLoader' );

				if ( !changeView && !loadPage ) {
					msg = reportMsgs['REPORT_UPDATED'];
				} else if ( !!loadPage && !resultPerPageOverride ) {
					msg = reportMsgs['REPORT_PAGE_CHANGED'];
				} else if ( !!resultPerPageOverride ) {
					msg = reportMsgs['REPORT_PRINTING'];
				} else {
					msg = reportMsgs['REPORT_SUBMITED'];
				};

				if ( !! msg ) {
					console.info( msg );
					$scope.$broadcast( msg );
				};
			};

			var errorCallback = function (response) {
				if ( changeView ) {
					$rootScope.setPrevState.hide = false;
					$scope.showReportDetails = true;
				};

				updateDS( response );

				$scope.errorMessage = response;
				$scope.$emit( 'hideLoader' );

				console.info( reportMsgs['REPORT_API_FAILED'] );
				$rootScope.$broadcast( reportMsgs['REPORT_API_FAILED'] );
			};

			$scope.clearErrorMessage();
			$scope.invokeApi(reportsSubSrv.fetchReportDetails, params, sucssCallback, errorCallback);
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = [];
		};





		var touchedReport;

		$scope.returnItem = function(item) {
			touchedReport = item;
		};

		var split = function (val) {
			return val.split(/,\s*/);
		};

		var extractLast = function (term) {
			return split(term).pop();
		};

		var activeUserAutoCompleteObj = [];

		var userAutoCompleteCommon = {
			source: function(request, response) {
				var term = extractLast(request.term);

				$scope.$emit( 'showLoader' );
				reportsSubSrv.fetchActiveUsers(term)
					.then(function(data) {
						var entry = {},
							found;

						activeUserAutoCompleteObj = [];
						$.map(data, function(user) {
							entry = {
								label: user.email,
								value: user.id,
							};
							activeUserAutoCompleteObj.push(entry);
						});

						found = $.ui.autocomplete.filter(activeUserAutoCompleteObj, term);
						response(found);

						$scope.$emit( 'hideLoader' );
					});
			},
			select: function(event, ui) {
				var uiValue = split(this.value);
				uiValue.pop();
				uiValue.push(ui.item.label);
				uiValue.push("");

				this.value = uiValue.join(", ");
				setTimeout(function() {
					$scope.$apply(function() {
						touchedReport.uiChosenUsers = uiValue.join(", ");
					});
				}.bind(this), 100);
				return false;
			},
			close: function(event, ui) {
				var uiValues = split(this.value);
				var modelVal = [];

				_.each(activeUserAutoCompleteObj, function(user) {
					var match = _.find(uiValues, function(email) {
						return email === user.label;
					});

					if (!!match) {
						modelVal.push(user.value);
					};
				});

				setTimeout(function() {
					$scope.$apply(function() {
						touchedReport.chosenUsers = modelVal;
					});
				}.bind(this), 10);
			},
			change: function () {
				var uiValues = split(this.value);
				var modelVal = [];

				_.each(activeUserAutoCompleteObj, function(user) {
					var match = _.find(uiValues, function(email) {
						return email === user.label;
					});

					if (!!match) {
						modelVal.push(user.value);
					};
				});

				setTimeout(function() {
					$scope.$apply(function() {
						touchedReport.chosenUsers = modelVal;
					});
				}.bind(this), 10);
			},
			focus: function(event, ui) {
				return false;
			}
		};

		$scope.listUserAutoCompleteOptions = angular.extend({
			position: {
				'my'        : 'left bottom',
				'at'        : 'left top',
				'collision' : 'flip'
			}
		}, userAutoCompleteCommon);

		$scope.detailsUserAutoCompleteOptions = angular.extend({
			position: {
				'my'        : 'left bottom',
				'at'        : 'right+20 bottom',
				'collision' : 'flip'
			}
		}, userAutoCompleteCommon);
		
		var ctgAutoCompleteCommon = {
			source: function(request, response) {
				$scope.$emit( 'showLoader' );
				reportsSubSrv.fetchComTaGrp(request.term)
					.then(function(data) {
						var list = [];
						var entry = {};
						$.map(data, function(each) {
							entry = {
								label: each.name,
								value: each.id,
								type: each.type
							};
							list.push(entry);
						});

						response(list);
						$scope.$emit( 'hideLoader' );
					});
			},
			select: function(event, ui) {
				this.value = ui.item.label;
				setTimeout(function() {
					$scope.$apply(function() {
						touchedReport.uiChosenIncludeComapnyTaGroup = ui.item.label;
						touchedReport.chosenIncludeComapnyTaGroup = ui.item.value;
					});
				}.bind(this), 100);
				return false;
			},
			focus: function(event, ui) {
				return false;
			}
		};

		$scope.listCtgAutoCompleteOptions = angular.extend({
			position: {
				my: 'left top',
				at: 'left bottom',
				collision: 'flip'
			}
		}, ctgAutoCompleteCommon);

		$scope.detailsCtgAutoCompleteOptions = angular.extend({
			position: {
				my: 'left bottom',
				at: 'right+20 bottom',
				collision: 'flip'
			}
		}, ctgAutoCompleteCommon);
	}
]);
