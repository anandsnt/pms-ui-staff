sntRover.controller('RVReportsMainCtrl', [
	'$rootScope',
	'$scope',
	'reportsResponse',
	'RVreportsSrv',
	'$filter',
	'activeUserList',
	'guaranteeTypes',
	'chargeGroups',
	'chargeCodes',
	'markets',
	'sources',
	'origins',
	'codeSettings',
	'$timeout',
	'RVReportUtilsFac',
	function($rootScope, $scope, reportsResponse, RVreportsSrv, $filter, activeUserList, guaranteeTypes, chargeGroups, chargeCodes, markets, sources, origins, codeSettings, $timeout, reportUtils) {

		BaseCtrl.call(this, $scope);

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
		$scope.$emit("updateRoverLeftMenu", "reports");

		//refer angular.isArray in scope
		$scope.isArray = angular.isArray;


		$scope.reportList = reportsResponse.results;
		$scope.reportCount = reportsResponse.total_count;


		$scope.activeUserList = activeUserList;
		$scope.guaranteeTypes = guaranteeTypes;
		$scope.chargeGroups = chargeGroups;
		$scope.chargeCodes = chargeCodes;

		$scope.markets = markets;
		$scope.sources = sources;
		$scope.origins = origins;

		$scope.codeSettings = codeSettings;




		$scope.showReportDetails = false;

		// lets fix the results per page to, user can't edit this for now
		// 25 is the current number set by backend server
		$scope.resultsPerPage = 25;

		$scope.goBackReportList = function() {
			$rootScope.setPrevState.hide = true;
			$scope.showReportDetails = false;
			$scope.heading = listTitle;
			$scope.showSidebar = false;
			$scope.resetFilterItemsToggle();

			// tell report list controller to refresh scroll
			console.log('report.list.scroll.refresh');
			$scope.$broadcast( 'report.list.scroll.refresh' );
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
			console.log(arguments);

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

			if ( item.title === reportUtils.getName('ARRIVAL') ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueInArrivals = false;
				}
			};
			if ( item.title === reportUtils.getName('DEPARTURE') ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueOutDepartures = false;
				}
			}
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
			var chosenReport = RVreportsSrv.getChoosenReport();

			// only do this for this report
			// I know this is ugly :(
			if (chosenReport.title !== reportUtils.getName('CHECK_IN_CHECK_OUT')) {
				return;
			};

			// if user has not chosen anything
			// both 'checked_in' & 'checked_out' must be true
			if (!chosenReport.chosenCico) {
				chosenReport.chosenCico = 'BOTH'
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
			} else {
				selectedItems = _.where(fauxDS.data, { selected: true });

				if ( selectedItems.length === 0 ) {
					fauxDS.title = fauxDS.defaultTitle;
				} else if ( selectedItems.length === 1 ) {
					fauxDS.title = selectedItems[0].description || selectedItems[0].name;
				} else if ( selectedItems.length === fauxDS.data.length ) {
					fauxDS.selectAll = true;
					fauxDS.title = 'All Selected';
				} else {
					fauxDS.selectAll = false;
					fauxDS.title = selectedItems.length + ' Selected';
				};

				// CICO-10202
				$scope.$emit( 'report.filter.change' );
			};
		};




		// generate reports
		$scope.genReport = function(changeView, loadPage, resultPerPageOverride) {
			var chosenReport = RVreportsSrv.getChoosenReport(),
				changeView = typeof changeView === 'boolean' ? changeView : true,
				page = !!loadPage ? loadPage : 1;

			// create basic param
			var params = {
				id: chosenReport.id,
				page: page,
				per_page: resultPerPageOverride || $scope.resultsPerPage
			};

			var key = '';
			var ary = [];
			var selected = [];

			// capturing the filters applied to be
			// shown on the report details footer
			$scope.appliedFilter = {};
			$scope.appliedFilter.options = [];
			$scope.appliedFilter.display = [];
			$scope.appliedFilter.markets = [];
			$scope.appliedFilter.sources = [];
			$scope.appliedFilter.origins = [];
			$scope.appliedFilter.guarantees = [];
			$scope.appliedFilter.chargeGroups = [];
			$scope.appliedFilter.chargeCode = [];

			// include dates
			if (!!chosenReport.hasDateFilter) {
				params['from_date'] = $filter('date')(chosenReport.fromDate, 'yyyy/MM/dd');
				params['to_date']   = $filter('date')(chosenReport.untilDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['fromDate'] = angular.copy( chosenReport.fromDate );
				$scope.appliedFilter['toDate']   = angular.copy( chosenReport.untilDate );
			};

			// include cancel dates
			if (!!chosenReport.hasCancelDateFilter) {
				params['cancel_from_date'] = $filter('date')(chosenReport.fromCancelDate, 'yyyy/MM/dd');
				params['cancel_to_date']   = $filter('date')(chosenReport.untilCancelDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['cancelFromDate'] = angular.copy( chosenReport.fromCancelDate );
				$scope.appliedFilter['cancelToDate']   = angular.copy( chosenReport.untilCancelDate );
			};

			// include arrival dates -- IFF both the limits of date range have been selected
			if (!!chosenReport.hasArrivalDateFilter && !!chosenReport.fromArrivalDate && !!chosenReport.untilArrivalDate) {
				params['arrival_from_date'] = $filter('date')(chosenReport.fromArrivalDate, 'yyyy/MM/dd');
				params['arrival_to_date'] = $filter('date')(chosenReport.untilArrivalDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['arrivalFromDate'] = angular.copy( chosenReport.fromArrivalDate );
				$scope.appliedFilter['arrivalToDate']   = angular.copy( chosenReport.untilArrivalDate );
			};

			// include deposit due dates
			if (!!chosenReport.hasDepositDateFilter) {
				params['deposit_from_date'] = $filter('date')(chosenReport.fromDepositDate, 'yyyy/MM/dd');
				params['deposit_to_date']   = $filter('date')(chosenReport.untilDepositDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['depositFromDate'] = angular.copy( chosenReport.fromDepositDate );
				$scope.appliedFilter['depositToDate']   = angular.copy( chosenReport.untilDepositDate );
			};

			// include paid dates
			if (!!chosenReport.hasPaidDateRange) {
				params['paid_from_date'] = $filter('date')(chosenReport.fromPaidDate, 'yyyy/MM/dd');
				params['paid_to_date']   = $filter('date')(chosenReport.untilPaidDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['paidFromDate'] = angular.copy( chosenReport.fromPaidDate );
				$scope.appliedFilter['paidToDate']   = angular.copy( chosenReport.untilPaidDate );
			};

			// include create dates
			if (!!chosenReport.hasCreateDateFilter) {
				params['create_from_date'] = $filter('date')(chosenReport.fromCreateDate, 'yyyy/MM/dd');
				params['create_to_date']   = $filter('date')(chosenReport.untilCreateDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['createFromDate'] = angular.copy( chosenReport.fromCreateDate );
				$scope.appliedFilter['createToDate']   = angular.copy( chosenReport.untilCreateDate );
			};

			// include single dates
			if (!!chosenReport.hasSingleDateFilter) {
				params['date'] = $filter('date')(chosenReport.singleValueDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['singleValueDate'] = angular.copy( chosenReport.singleValueDate );
			};
			
			// include rate adjustment dates
			if (!!chosenReport.hasAdjustmentDateRange) {
				params['from_date'] = $filter('date')(chosenReport.fromAdjustmentDate, 'yyyy/MM/dd');
				params['to_date']   = $filter('date')(chosenReport.untilAdjustmentDate, 'yyyy/MM/dd');
				/**/
				$scope.appliedFilter['adjustmentFromDate'] = angular.copy( chosenReport.fromAdjustmentDate );
				$scope.appliedFilter['adjustmentToDate']   = angular.copy( chosenReport.untilAdjustmentDate );
			};

			// include times
			if (chosenReport.hasTimeFilter) {

				if ( chosenReport.fromTime ) {
					params['from_time'] = chosenReport.fromTime;
					/**/
					$scope.appliedFilter['fromTime'] = angular.copy( chosenReport.fromTime );
				};

				if ( chosenReport.untilTime ) {
					params['to_time']   = chosenReport.untilTime;
					/**/
					$scope.appliedFilter['toTime']   = angular.copy( chosenReport.untilTime );
				};
			};

			// include CICO filter
			if (!!chosenReport.hasCicoFilter) {
				params['checked_in'] = getProperCICOVal('checked_in');
				params['checked_out'] = getProperCICOVal('checked_out');
				/**/
				if ( params['checked_in'] && params['checked_out'] ) {
					$scope.appliedFilter['cicoTypes'] = 'Check Ins & Check Outs';
				} else if ( params['checked_in'] ) {
					$scope.appliedFilter['cicoTypes'] = 'Only Check Ins';
				} else if ( params['checked_out'] ) {
					$scope.appliedFilter['cicoTypes'] = 'Only Check Outs';
				}
			};

			// include user ids
			if (chosenReport.hasUserFilter && chosenReport.chosenUsers && chosenReport.chosenUsers.length) {
				key = 'user_ids[]';
				params[key] = [];
				_.each(chosenReport.chosenUsers, function(user) {
					params[key].push( user );
				});
				/**/
				$scope.appliedFilter['users'] = [];
				_.each(chosenReport.chosenUsers, function (id) {
					var user = _.find($scope.activeUserList, function (each) {
						return each.id === id;
					});
					if ( !!user ) {
						$scope.appliedFilter['users'].push( user.full_name );
					};
				});
			};

			// include sort bys
			if (chosenReport.sortByOptions) {
				if (!!chosenReport.chosenSortBy) {
					params['sort_field'] = chosenReport.chosenSortBy;
				};
				var _chosenSortBy = _.find(chosenReport.sortByOptions, function(item) {
					return item && item.value === chosenReport.chosenSortBy;
				});
				if (!!_chosenSortBy && typeof _chosenSortBy.sortDir === 'boolean') {
					params['sort_dir'] = _chosenSortBy.sortDir;
				};
				/**/
				if ( !!_chosenSortBy ) {
					$scope.appliedFilter['sortBy'] = _chosenSortBy.description;
				};
				if ( !!_chosenSortBy && typeof _chosenSortBy.sortDir === 'boolean' ) {
					$scope.appliedFilter['sortDir'] = _chosenSortBy.sortDir ? 'Ascending' : 'Descending';
				};
			};

			// include group bys
			if (chosenReport.groupByOptions) {
				if ( chosenReport.chosenGroupBy === 'DATE' ) {
					params['group_by_date'] = true;
					/**/
					$scope.appliedFilter['groupBy'] = 'Date';
				};

				if ( chosenReport.chosenGroupBy === 'USER' ) {
					params['group_by_user'] = true;
					/**/
					$scope.appliedFilter['groupBy'] = 'User';
				};
			};



			if ( chosenReport.hasOwnProperty('hasGeneralOptions') && chosenReport['hasGeneralOptions']['data'].length ) {

				// keeping direct ref to option from 'chosenReport'
				// reseting all
				chosenReport.chosenOptions = {};

				_.each(chosenReport['hasGeneralOptions']['data'], function(each) {
					if ( each.selected ) {
						key = each.paramKey;
						params[key] = true;

						// keeping direct ref to option from 'chosenReport'
						chosenReport.chosenOptions[key] = true;

						/**/
						$scope.appliedFilter.options.push( each.description );
					} else if ( !each.selected && each.mustSend ) {
						key = each.paramKey;
						params[key] = false;
					};
				});
			};

			if ( chosenReport.hasOwnProperty('hasDisplay') && chosenReport['hasDisplay']['data'].length ) {
				_.each(chosenReport['hasDisplay']['data'], function(each) {
					if ( each.selected ) {
						key = each.paramKey;
						params[key] = true;
						/**/
						$scope.appliedFilter.display.push( each.description );
					};
				});
			};



			// include company/ta/group
			if (chosenReport.hasOwnProperty('hasIncludeComapnyTaGroup') && !!chosenReport.chosenIncludeComapnyTaGroup) {
				key = chosenReport.hasIncludeComapnyTaGroup.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeComapnyTaGroup;
				/* Note using the ui value here */
				$scope.appliedFilter['companyTaGroup'] = chosenReport.uiChosenIncludeComapnyTaGroup;
			};


			// selected markets
			if (chosenReport.hasOwnProperty('hasMarketsList')) {
				selected = _.where(chosenReport['hasMarketsList']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key = 'market_ids[]';
					params[key] = [];
					_.each(selected, function(market) {
						params[key].push( market.value );
						/**/
						$scope.appliedFilter.markets.push( market.name );
					});

					// in case if all markets are selected
					if ( chosenReport['hasMarketsList']['data'].length === selected.length ) {
						$scope.appliedFilter.markets = ['All Markets'];
					};
				};
			};

			// selected source
			if (chosenReport.hasOwnProperty('hasSourcesList')) {
				selected = _.where(chosenReport['hasSourcesList']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key = 'source_ids[]';
					params[key] = [];
					_.each(selected, function(source) {
						params[key].push( source.value );
						/**/
						$scope.appliedFilter.sources.push( source.name );
					});

					// in case if all sources are selected
					if ( chosenReport['hasSourcesList']['data'].length === selected.length ) {
						$scope.appliedFilter.sources = ['All Sources'];
					};
				};
			};

			// selected origin
			if (chosenReport.hasOwnProperty('hasOriginsList')) {
				selected = _.where(chosenReport['hasOriginsList']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key = 'booking_origin_ids[]';
					params[key] = [];
					_.each(selected, function(origin) {
						params[key].push( origin.value );
						/**/
						$scope.appliedFilter.origins.push( origin.name );
					});

					// in case if all origins are selected
					if ( chosenReport['hasOriginsList']['data'].length === selected.length ) {
						$scope.appliedFilter.origins = ['All Origins'];
					};
				};
			};

			// include guarantee type
			if (chosenReport.hasOwnProperty('hasGuaranteeType')) {
				selected = _.where(chosenReport['hasGuaranteeType']['data'], { selected: true });

				if ( selected.length > 0) {
					key = 'include_guarantee_type[]';
					params[key] = [];
					_.each(selected, function(guarantee) {
						params[key].push( guarantee.name );
						/**/
						$scope.appliedFilter.guarantees.push( guarantee.name );
					});

					// in case if all guarantee type is selected
					if ( chosenReport['hasGuaranteeType']['data'].length === selected.length ) {
						$scope.appliedFilter.guarantees = ['All Guarantees'];
					};
				};
			};

			// include charge groups
			if (chosenReport.hasOwnProperty('hasByChargeGroup')) {
				selected = _.where(chosenReport['hasByChargeGroup']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key = 'charge_group_ids[]';
					params[key] = [];
					_.each(selected, function(cg) {
						params[key].push( cg.id );
						/**/
						$scope.appliedFilter.chargeGroups.push( cg.description );
					});

					// in case if all charge groups is selected
					if ( chosenReport['hasByChargeGroup']['data'].length === selected.length ) {
						$scope.appliedFilter.chargeGroups = ['All Groups'];
					};
				};
			};

			// include charge code
			if (chosenReport.hasOwnProperty('hasByChargeCode')) {
				selected = _.where(chosenReport['hasByChargeCode']['data'], { selected: true });

				if ( selected.length > 0 ) {
					key = 'charge_code_ids[]';
					params[key] = [];
					_.each(selected, function(cc) {
						params[key].push( cc.id );
						/**/
						$scope.appliedFilter.chargeCode.push( cc.description );
					});

					// in case if all charge code is selected
					if ( chosenReport['hasByChargeCode']['data'].length === selected.length ) {
						$scope.appliedFilter.chargeCode = ['All Codes'];
					};
				};
			};





			// need to reset the "group by" if any new filter has been applied
			if ( !!chosenReport.groupByOptions && !!$scope.oldParams ) {
				for (key in params) {
					if ( !params.hasOwnProperty(key) ) {
					    continue;
					};

					if ( key === 'group_by_date' || key === 'group_by_user' || key === 'page' || key === 'per_page' ) {
						continue;
					} else if ( params[key] !== $scope.oldParams[key] ) {
						chosenReport.chosenGroupBy = 'BLANK';
						/**/
						if ( params.hasOwnProperty('group_by_date') ) {
							params['group_by_date'] = undefined;
						};
						if ( params.hasOwnProperty('group_by_user') ) {
							params['group_by_user'] = undefined;
						};
						/**/
						$scope.appliedFilter['groupBy'] = undefined;
						break;
					};
				};
			};

			// keep a copy of the current params
			$scope.oldParams = angular.copy( params );



			var updateDS = function (response) {

				// fill in data into seperate props
				$scope.totals          = response.totals || [];
				$scope.headers         = response.headers || [];
				$scope.subHeaders      = response.sub_headers || [];
				$scope.results         = response.results || [];
				$scope.resultsTotalRow = response.results_total_row || 0;
				$scope.summaryCounts   = response.summary_counts || [];
				$scope.reportGroupedBy = response.group_by || '';

				// track the total count
				$scope.totalCount = response.total_count || 0;
				$scope.currCount = response.results ? response.results.length : 0;
			};

			var sucssCallback = function(response) {
				if (changeView) {
					$rootScope.setPrevState.hide = false;
					$scope.showReportDetails = true;
				};

				updateDS(response);

				$scope.errorMessage = [];
				$scope.$emit('hideLoader');

				if (!changeView && !loadPage) {
					console.log('report.updated');
					$scope.$broadcast('report.updated');
				} else if (!!loadPage && !resultPerPageOverride) {
					console.log('report.page.changed');
					$scope.$broadcast('report.page.changed');
				} else if (!!resultPerPageOverride) {
					console.log('report.printing');
					$scope.$broadcast('report.printing');
				} else {
					console.log('report.submit');
					$scope.$broadcast('report.submit');
				};
			};

			var errorCallback = function (response) {
				if (changeView) {
					$rootScope.setPrevState.hide = false;
					$scope.showReportDetails = true;
				};

				updateDS(response);

				$scope.errorMessage = response;
				$scope.$emit('hideLoader');

				console.log('report.API.failure');
				$rootScope.$broadcast('report.API.failure');
			};

			$scope.clearErrorMessage();
			$scope.invokeApi(RVreportsSrv.fetchReportDetails, params, sucssCallback, errorCallback);
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = [];
		};





		var activeUserAutoCompleteObj = [];
		_.each($scope.activeUserList, function(user) {
			activeUserAutoCompleteObj.push({
				label: user.email,
				value: user.id
			});
		});

		function split(val) {
			return val.split(/,\s*/);
		}

		function extractLast(term) {
			return split(term).pop();
		}

		var thisReport;
		$scope.returnItem = function(item) {
			thisReport = item;
		};

		var userAutoCompleteCommon = {
			source: function(request, response) {
				// delegate back to autocomplete, but extract the last term
				response($.ui.autocomplete.filter(activeUserAutoCompleteObj, extractLast(request.term)));
			},
			select: function(event, ui) {
				var uiValue = split(this.value);
				uiValue.pop();
				uiValue.push(ui.item.label);
				uiValue.push("");

				this.value = uiValue.join(", ");
				setTimeout(function() {
					$scope.$apply(function() {
						thisReport.uiChosenUsers = uiValue.join(", ");
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
						thisReport.chosenUsers = modelVal;
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
						thisReport.chosenUsers = modelVal;
					});
				}.bind(this), 10);
			},
			focus: function(event, ui) {
				return false;
			}
		}
		$scope.listUserAutoCompleteOptions = angular.extend({
			position: {
				my: 'left bottom',
				at: 'left top',
				collision: 'flip'
			}
		}, userAutoCompleteCommon);
		$scope.detailsUserAutoCompleteOptions = angular.extend({
			position: {
				my: 'left bottom',
				at: 'right+20 bottom',
				collision: 'flip'
			}
		}, userAutoCompleteCommon);




		$scope.removeCompTaGrpId = function(item) {
			if (!item.uiChosenIncludeComapnyTaGroup) {
				item.chosenIncludeComapnyTaGroup = null;
			};
		};
		var ctgAutoCompleteCommon = {
			source: function(request, response) {
				RVreportsSrv.fetchComTaGrp(request.term)
					.then(function(data) {
						var list = [];
						var entry = {}
						$.map(data, function(each) {
							entry = {
								label: each.name,
								value: each.id,
								type: each.type
							};
							list.push(entry);
						});

						response(list);
					});
			},
			select: function(event, ui) {
				this.value = ui.item.label;
				setTimeout(function() {
					$scope.$apply(function() {
						thisReport.uiChosenIncludeComapnyTaGroup = ui.item.label;
						thisReport.chosenIncludeComapnyTaGroup = ui.item.value;
					});
				}.bind(this), 100);
				return false;
			},
			focus: function(event, ui) {
				return false;
			}
		}
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
