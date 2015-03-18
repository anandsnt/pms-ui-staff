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
	'$timeout',
	'RVReportUtilsFac',
	function($rootScope, $scope, reportsResponse, RVreportsSrv, $filter, activeUserList, guaranteeTypes, chargeGroups, chargeCodes, $timeout, reportUtils) {

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


		$scope.reportList = reportsResponse.results;
		$scope.reportCount = reportsResponse.total_count;


		$scope.activeUserList = activeUserList;
		$scope.guaranteeTypes = guaranteeTypes;
		$scope.chargeGroups = chargeGroups;
		$scope.chargeCodes = chargeCodes;

		// make all the guarantee type unselected
		_.each($scope.guaranteeTypes, function (item) {
			item.selected = false;
		});

		// make all the charge groups selected by default
		_.each($scope.chargeGroups, function (item) {
			item.selected = true;
		});

		// make all the charge codes selected by default
		_.each($scope.chargeCodes, function (item) {
			item.selected = true;
		});


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
		};




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
			item_18: false
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

		// custom from and untill date picker options
		// with no limits to choose dates
		$scope.fromDateOptionsNoLimit = angular.extend({}, datePickerCommon);
		$scope.untilDateOptionsNoLimit = angular.extend({}, datePickerCommon);

		var dbObj = reportUtils.processDate().businessDate;
		$scope.dateChanged = function (item, dateName) {
			if ( item.title == reportUtils.getName('ARRIVAL') ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueInArrivals = false;
				}
			};
			if ( item.title == reportUtils.getName('DEPARTURE') ) {
				if ( !angular.equals(item.fromDate, dbObj) || !angular.equals(item.untilDate, dbObj) ) {
					item.chosenDueOutDepartures = false;
				}
			}
		};

		// CICO-10202
		$scope.reportsState = {
			markets: []
		};


		// logic to re-show the remove date button
		$scope.showRemoveDateBtn = function() {

			// default handler for when to show the delete button again
			var defaultHandler = function(item, first, second) {
				if ( (!!item[first.from] && !!item[first.until]) && (!!item[second.from] && !!item[second.until]) ) {
					item['showRemove'] = true;
				}

				$scope.$apply();
			};

			// "Booking Source & Market Report"
			// custom handler for when to show the delete button again
			var sourceReportHandler = function(item, first, second) {
				// CICO-10200
				// If source markets report and a date is selected, have to enable the delete button to remove the date in case both days are selected i.e. the date range has both upper and
				// lower limits
				if ( !!item['fromArrivalDate'] && !!item['untilArrivalDate'] ) {
					item['showRemoveArrivalDate'] = true;

				}

				if ( !!item['fromDate'] && !!item['untilDate'] ) {
					item['showRemove'] = true;
				};

				$scope.$apply();
			};

			// array of all in use prop name sets
			// any future addintions must be added here
			var propNames = [{
				from: 'fromDate',
				until: 'untilDate'
			}, {
				from: 'fromArrivalDate',
				until: 'untilArrivalDate'
			}, {
				from: 'fromCancelDate',
				until: 'untilCancelDate'
			}, {
				from: 'fromDepositDate',
				until: 'untilDepositDate'
			}];

			// loop over each report
			_.each($scope.reportList, function(item) {

				// as of now each report can have atmost
				// two pair of date range sets - each having 'from' and 'until'
				var setOne = {};
				var setTwo = {};

				// loop over the propNames and
				// create setOne and setTwo
				_.each(propNames, function(prop) {

					// if found a matching prop name in this report
					// should be atmost two at the moment
					if ( item.hasOwnProperty(prop.from) && item.hasOwnProperty(prop.until) ) {

						// if setOne is empty fill in that
						if ( _.isEmpty(setOne) ) {
							setOne.from = prop.from;
							setOne.until = prop.until;
						}
						// else fill in setTwo
						else {
							setTwo.from = prop.from;
							setTwo.until = prop.until;
						};

					};
				});

				// both sets are filled.
				// TODO: in future we may have a single set rather than a pair
				if ( !_.isEmpty(setOne) && !_.isEmpty(setTwo) ) {
					if ( item.title == reportUtils.getName('BOOKING_SOURCE_MARKET_REPORT') ) {
						sourceReportHandler( item, angular.copy(setOne), angular.copy(setTwo) )
					} else {
						defaultHandler( item, angular.copy(setOne), angular.copy(setTwo) );
					}
				};
			});
		};


		$scope.clearDateFromFilter = function(list, key1, key2, property) {
			if (list.hasOwnProperty(key1) && list.hasOwnProperty(key2)) {
				list[key1] = undefined;
				list[key2] = undefined;
				var flag = property || 'showRemove';
				list[flag] = false;
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
                if (each && each.value != item.chosenSortBy) {
                    each.sortDir = undefined;
                } else if (each && each.value == item.chosenSortBy) {
                    _sortBy = each;
                }
            });

            // select sort_dir for chosen item
            if (!!_sortBy) {
                _sortBy.sortDir = true;
            };
        };


		var chosenList = [
			'chosenIncludeNotes',
			'chosenIncludeCancelled',
			'chosenIncludeVip',
			'chosenIncludeNoShow',
			'chosenShowGuests',
			'chosenIncludeRoverUsers',
			'chosenIncludeZestUsers',
			'chosenIncludeZestWebUsers',
			'chosenVariance',
			'chosenLastYear',
			'chosenIncludeComapnyTaGroup',
			'chosenGuaranteeType',
			'chosenIncludeDepositPaid',
			'chosenIncludeDepositDue',
			'chosenIncludeDepositPastDue',
			'chosenDueInArrivals',
			'chosenDueOutDepartures',
			'chosenIncludeNew',
			'chosenIncludeBoth'
		];

		var hasList = [
			'hasIncludeNotes',
			'hasIncludeCancelled',
			'hasIncludeVip',
			'hasIncludeNoShow',
			'hasShowGuests',
			'hasIncludeRoverUsers',
			'hasIncludeZestUsers',
			'hasIncludeZestWebUsers',
			'hasVariance',
			'hasLastYear',
			'hasIncludeComapnyTaGroup',
			'hasGuaranteeType',
			'hasIncludeDepositPaid',
			'hasIncludeDepositDue',
			'hasIncludeDepositPastDue',
			'hasDueInArrivals',
			'hasDueOutDepartures',
			'hasIncludeNew',
			'hasIncludeBoth'
		];






		var closeAllMultiSelects = function() {
			_.each($scope.reportList, function(item) {
				if ( item.hasOwnProperty('fauxSelectOpen') ) {
					item.fauxSelectOpen = false;
				};
				if ( item.hasOwnProperty('selectDisplayOpen') ) {
					item.selectDisplayOpen = false;
				};
				if ( item.hasOwnProperty('selectMarketsOpen') ) {
					item.selectMarketsOpen = false;
				};
				if ( item.hasOwnProperty('selectGuaranteeOpen') ) {
					item.selectGuaranteeOpen = false;
				};
				if ( item.hasOwnProperty('selectChargeGroupOpen') ) {
					item.selectChargeGroupOpen = false;
				};
				if ( item.hasOwnProperty('selectChargeCodeOpen') ) {
					item.selectChargeCodeOpen = false;
				};
			});
			$timeout(function(){
				$scope.refreshScroller('report-list-scroll');
				$scope.myScroll['report-list-scroll'].refresh();
			},300);
		}

		// common faux select method
		$scope.fauxSelectClicked = function(e, item) {
			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};

			if (!item) {
				return;
			};

			e.stopPropagation();
			item.fauxSelectOpen = item.fauxSelectOpen ? false : true;

			$scope.fauxOptionClicked(e, item);
		};
		$scope.fauxOptionClicked = function(e, item) {
			e && e.stopPropagation();

			var selectCount = 0,
				maxCount = 0,
				eachTitle = '';

			item.fauxTitle = '';
			for (var i = 0, j = chosenList.length; i < j; i++) {
				if (item.hasOwnProperty(chosenList[i])) {
					maxCount++;
					if (item[chosenList[i]] == true) {
						selectCount++;
						eachTitle = item[hasList[i]].description;
					};
				};
			};

			if (selectCount == 0) {
				item.fauxTitle = 'Select';
			} else if (selectCount == 1) {
				item.fauxTitle = eachTitle;
			} else if (selectCount > 1) {
				item.fauxTitle = selectCount + ' Selected';
			};

			if (item.hasSourceMarketFilter) {
				var selectCount = 0;
				if (item.showMarket) {
					selectCount++;
					item.displayTitle = item.hasMarket.description;
				};
				if (item.showSource) {
					selectCount++;
					item.displayTitle = item.hasSource.description;
				};

				if (selectCount > 1) {
					item.displayTitle = selectCount + ' Selected';
				} else if (selectCount == 0) {
					item.displayTitle = 'Select';
				};
			}
			// CICO-10202
			$scope.$emit('report.filter.change');
		};

		// specific for Source and Markets reports
		$scope.selectDisplayClicked = function(e, item) {
			var selectCount = 0;

			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};

			if (!item) {
				return;
			};

			e.stopPropagation();
			item.selectDisplayOpen = item.selectDisplayOpen ? false : true;

			$scope.fauxOptionClicked(e, item);
		};

		//specific for markets
		$scope.selectMarketsClicked = function(e, item) {
			var selectCount = 0;
			$timeout(function(){
				$scope.refreshScroller('report-list-scroll');
				$scope.myScroll['report-list-scroll'].refresh();
			},300);
			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};
			if (!item) {
				return;
			};

			e.stopPropagation();
			item.selectMarketsOpen = item.selectMarketsOpen ? false : true;

			if (!item) {
				return;
			};
			e.stopPropagation();

		};
		$scope.fauxMarketOptionClicked = function(item,allMarkets) {
			if(allMarkets){
				_.each($scope.reportsState.markets, function(market){
					market.selected = !!item.allMarketsSelected;
				});
			} else {
				var selectedData = _.where($scope.reportsState.markets, {
					selected: true
				});

				item.allMarketsSelected = selectedData.length == $scope.reportsState.markets.length;

				if (selectedData.length == 0) {
					item.marketTitle = "Select";
				} else if (selectedData.length == 1) {
					item.marketTitle = selectedData[0].name;
				} else if (selectedData.length > 1) {
					item.marketTitle = selectedData.length + "Selected";
				}
			}
			// CICO-10202
			$scope.$emit('report.filter.change');
		};

		// specific for Source and Markets reports
		$scope.guranteeTypeClicked = function(e, item) {
			var selectCount = 0;

			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};

			if (!item) {
				return;
			};

			e.stopPropagation();
			item.selectGuaranteeOpen = item.selectGuaranteeOpen ? false : true;

			$scope.fauxOptionClicked(e, item);
		};
		$scope.fauxGuaranteeOptionClicked = function(item) {
			var selectedData = _.where(item.guaranteeTypes, {
				selected: true
			});

			if (selectedData.length == 0) {
				item.guaranteeTitle = "Show All";
			} else if (selectedData.length == 1) {
				item.guaranteeTitle = selectedData[0].name;
			} else if (selectedData.length > 1) {
				item.guaranteeTitle = selectedData.length + " Selected";
			}
		};

		// charge group faux select method
		$scope.chargeGroupClicked = function(e, item) {
			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};

			if (!item) {
				return;
			};

			e.stopPropagation();
			item.selectChargeGroupOpen = item.selectChargeGroupOpen ? false : true;

			$scope.fauxOptionClicked(e, item);
		};
		$scope.fauxChargeGroupOptionClicked = function(e, item, allChargeGroup) {
			if (e) {
				e.stopPropagation();
			};

			if( allChargeGroup ){
				_.each(item.chargeGroups, function(group){
					group.selected = !!item.allChargeGroupSelected;
				});
			} else {
				var selectedData = _.where(item.chargeGroups, {
					selected: true
				});

				if (selectedData.length == 0) {
					item.chargeGroupTitle = "Show All";
				} else if (selectedData.length == 1) {
					item.chargeGroupTitle = selectedData[0].description;
				} else if (selectedData.length > 1) {
					item.chargeGroupTitle = selectedData.length + " Selected";
				};
			};
		};

		// charge code faux select method
		$scope.chargeCodeClicked = function(e, item) {
			// if clicked outside, close the open dropdowns
			if (!e) {
				closeAllMultiSelects();
				return;
			};

			if (!item) {
				return;
			};

			e.stopPropagation();
			item.selectChargeCodeOpen = item.selectChargeCodeOpen ? false : true;

			$scope.fauxOptionClicked(e, item);
		};
		$scope.fauxChargeCodeOptionClicked = function(e, item, allChargeCode) {
			if (e) {
				e.stopPropagation();
			};

			if( allChargeCode ){
				_.each(item.chargeCodes, function(code){
					code.selected = !!item.allChargeCodeSelected;
				});
			} else {
				var selectedData = _.where(item.chargeCodes, {
					selected: true
				});

				if (selectedData.length == 0) {
					item.chargeCodeTitle = "Show All";
				} else if (selectedData.length == 1) {
					item.chargeCodeTitle = selectedData[0].description;
				} else if (selectedData.length > 1) {
					item.chargeCodeTitle = selectedData.length + " Selected";
				}
			};
		};

		$scope.showFauxSelect = function(item) {
			if (!item) {
				return false;
			};

			return _.find(hasList, function(has) {
				return item.hasOwnProperty(has)
			}) ? true : false;
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

			// capturing the filters applied to be
			// shown on the report details footer
			$scope.appliedFilter = {};
			$scope.appliedFilter.options = [];
			$scope.appliedFilter.display = [];
			$scope.appliedFilter.markets = [];
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
						return each.id == id;
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
					return item && item.value == chosenReport.chosenSortBy;
				});
				if (!!_chosenSortBy && typeof _chosenSortBy.sortDir == 'boolean') {
					params['sort_dir'] = _chosenSortBy.sortDir;
				};
				/**/
				if ( !!_chosenSortBy ) {
					$scope.appliedFilter['sortBy'] = _chosenSortBy.description;
				};
				if ( !!_chosenSortBy && typeof _chosenSortBy.sortDir == 'boolean' ) {
					$scope.appliedFilter['sortDir'] = _chosenSortBy.sortDir ? 'Ascending' : 'Descending';
				};
			};

			// include group bys
			if (chosenReport.groupByOptions) {
				if ( chosenReport.chosenGroupBy == 'DATE' ) {
					params['group_by_date'] = true;
					/**/
					$scope.appliedFilter['groupBy'] = 'Date';
				};

				if ( chosenReport.chosenGroupBy == 'USER' ) {
					params['group_by_user'] = true;
					/**/
					$scope.appliedFilter['groupBy'] = 'User';
				};
			};

			// include notes
			if (chosenReport.hasOwnProperty('hasIncludeNotes')) {
				key = chosenReport.hasIncludeNotes.value.toLowerCase();
				if ( chosenReport.chosenIncludeNotes ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeNotes.description );
				};
			};

			// include user ids
			if (chosenReport.hasOwnProperty('hasIncludeVip')) {
				key = chosenReport.hasIncludeVip.value.toLowerCase();
				if ( chosenReport.chosenIncludeVip ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeVip.description );
				};
			};

			// include cancelled
			if (chosenReport.hasOwnProperty('hasIncludeCancelled')) {
				key = chosenReport.hasIncludeCancelled.value.toLowerCase();
				if ( chosenReport.chosenIncludeCancelled ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeCancelled.description );
				};
			};

			// include no show
			if (chosenReport.hasOwnProperty('hasIncludeNoShow')) {
				key = chosenReport.hasIncludeNoShow.value.toLowerCase();
				if ( chosenReport.chosenIncludeNoShow ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeNoShow.description );
				};
			};

			// include rover users
			if (chosenReport.hasOwnProperty('hasIncludeRoverUsers')) {
				key = chosenReport.hasIncludeRoverUsers.value.toLowerCase();
				if ( chosenReport.chosenIncludeRoverUsers ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeRoverUsers.description );
				};
			};

			// include zest users
			if (chosenReport.hasOwnProperty('hasIncludeZestUsers')) {
				key = chosenReport.hasIncludeZestUsers.value.toLowerCase();
				if ( chosenReport.chosenIncludeZestUsers ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeZestUsers.description );
				};
			};

			// include zest web users
			if (chosenReport.hasOwnProperty('hasIncludeZestWebUsers')) {
				key = chosenReport.hasIncludeZestWebUsers.value.toLowerCase();
				if ( chosenReport.chosenIncludeZestWebUsers ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeZestWebUsers.description );
				};
			};

			// include show guests
			if (chosenReport.hasOwnProperty('hasShowGuests')) {
				key = chosenReport.hasShowGuests.value.toLowerCase();
				if ( chosenReport.chosenShowGuests ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasShowGuests.description );
				};
			};

			// include include deposit paid
			if (chosenReport.hasOwnProperty('hasIncludeDepositPaid')) {
				key = chosenReport.hasIncludeDepositPaid.value.toLowerCase();
				if ( chosenReport.chosenIncludeDepositPaid ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeDepositPaid.description );
				};
			};

			// include include deposit due
			if (chosenReport.hasOwnProperty('hasIncludeDepositDue')) {
				key = chosenReport.hasIncludeDepositDue.value.toLowerCase();
				if ( chosenReport.chosenIncludeDepositDue ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeDepositDue.description );
				};
			};

			// include include deposit past due
			if (chosenReport.hasOwnProperty('hasIncludeDepositPastDue')) {
				key = chosenReport.hasIncludeDepositPastDue.value.toLowerCase();
				if ( chosenReport.chosenIncludeDepositPastDue ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeDepositPastDue.description );
				};
			};

			// include due in arrivals option
			if (chosenReport.hasOwnProperty('hasDueInArrivals')) {
				key = chosenReport.hasDueInArrivals.value.toLowerCase();
				if ( chosenReport.chosenDueInArrivals ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasDueInArrivals.description );
				};
			};

			// include due out departure option
			if (chosenReport.hasOwnProperty('hasDueOutDepartures')) {
				key = chosenReport.hasDueOutDepartures.value.toLowerCase();
				if ( chosenReport.chosenDueOutDepartures ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasDueOutDepartures.description );
				};
			};

            // include new option
			if (chosenReport.hasOwnProperty('hasIncludeNew')) {
				key = chosenReport.hasIncludeNew.value.toLowerCase();
				if ( chosenReport.chosenIncludeNew ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeNew.description );
				};
			};

            // include both option
			if (chosenReport.hasOwnProperty('hasIncludeBoth')) {
				key = chosenReport.hasIncludeBoth.value.toLowerCase();
				if ( chosenReport.chosenIncludeBoth ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasIncludeBoth.description );
				};
			};

			// include market
			if (chosenReport.hasOwnProperty('hasMarket')) {
				key = chosenReport.hasMarket.value.toLowerCase();
				if ( chosenReport.showMarket ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.display.push( chosenReport.hasMarket.description );
				};
			};

			// include source
			if (chosenReport.hasOwnProperty('hasSource')) {
				key = chosenReport.hasSource.value.toLowerCase();
				if ( chosenReport.showSource ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.display.push( chosenReport.hasSource.description );
				};
			};

			// include variance
			if (chosenReport.hasOwnProperty('hasVariance')) {
				key = chosenReport.hasVariance.value.toLowerCase();
				if ( chosenReport.chosenVariance ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasVariance.description );
				};
			};

			// include last year
			if (chosenReport.hasOwnProperty('hasLastYear')) {
				key = chosenReport.hasLastYear.value.toLowerCase();
				if ( chosenReport.chosenLastYear ) {
					params[key] = true;
					/**/
					$scope.appliedFilter.options.push( chosenReport.hasLastYear.description );
				};
			};


			// include company/ta/group
			if (chosenReport.hasOwnProperty('hasIncludeComapnyTaGroup') && !!chosenReport.chosenIncludeComapnyTaGroup) {
				key = chosenReport.hasIncludeComapnyTaGroup.value.toLowerCase();
				params[key] = chosenReport.chosenIncludeComapnyTaGroup;
				/* Note using the ui value here */
				$scope.appliedFilter['companyTaGroup'] = chosenReport.uiChosenIncludeComapnyTaGroup;

			};


			//selected markets for CICO-10202
			if (chosenReport.hasOwnProperty('hasMarketsList')) {
				var selectedMarkets = _.where($scope.reportsState.markets, {
					selected: true
				});
				if (selectedMarkets.length > 0) {
					key = 'market_ids[]';
					params[key] = [];
					_.each(selectedMarkets, function(market) {
						params[key].push( market.value );
						/**/
						$scope.appliedFilter.markets.push( market.name );
					});
				};
			};

			// include guarantee type
			if (chosenReport.hasOwnProperty('hasGuaranteeType')) {
				var selectedGuarantees = _.where(chosenReport.guaranteeTypes, {
					selected: true
				});
				if (selectedGuarantees.length > 0) {
					key = 'include_guarantee_type[]';
					params[key] = [];
					_.each(selectedGuarantees, function(guarantee) {
						params[key].push( guarantee.name );
						/**/
						$scope.appliedFilter.guarantees.push( guarantee.name );
					});
				};
			};

			// include charge groups
			if (chosenReport.hasOwnProperty('hasByChargeGroup')) {
				var selectedChargeGroups = _.where(chosenReport.chargeGroups, {
					selected: true
				});
				if (selectedChargeGroups.length > 0) {
					key = 'charge_group_ids[]';
					params[key] = [];
					_.each(selectedChargeGroups, function(cg) {
						params[key].push( cg.id );
						/**/
						$scope.appliedFilter.chargeGroups.push( cg.description );
					});

					// in case if all charge groups is selected
					if ( chosenReport.chargeGroups.length == selectedChargeGroups.length ) {
						$scope.appliedFilter.chargeGroups = [];
						$scope.appliedFilter.chargeGroups.push( 'All Groups' );
					};
				};
			};

			// include charge code
			if (chosenReport.hasOwnProperty('hasByChargeCode')) {
				var selectedChargeCodes = _.where(chosenReport.chargeCodes, {
					selected: true
				});
				if (selectedChargeCodes.length > 0) {
					key = 'charge_code_ids[]';
					params[key] = [];
					_.each(selectedChargeCodes, function(cc) {
						params[key].push( cc.id );
						/**/
						$scope.appliedFilter.chargeCode.push( cc.description );
					});

					// in case if all charge code is selected
					if ( chosenReport.chargeCodes.length == selectedChargeCodes.length ) {
						$scope.appliedFilter.chargeCode = [];
						$scope.appliedFilter.chargeCode.push( 'All Codes' );
					};
				};
			};





			// need to reset the "group by" if any new filter has been applied
			if ( !!chosenReport.groupByOptions && !!$scope.oldParams ) {
				for (key in params) {
					if ( !params.hasOwnProperty(key) ) {
					    continue;
					};

					if ( key == 'group_by_date' || key == 'group_by_user' ) {
						continue;
					} else if ( params[key] != $scope.oldParams[key] ) {
						chosenReport.chosenGroupBy = 'BLANK';
						params['group_by_date'] = false;
						params['group_by_user'] = false;
						/**/
						$scope.appliedFilter['groupBy'] = undefined;
						break;
					};
				};
			};

			// keep a copy of the current params
			$scope.oldParams = angular.copy( params );





			var callback = function(response) {
				if (changeView) {
					$rootScope.setPrevState.hide = false;
					$scope.showReportDetails = true;
				};

				// fill in data into seperate props
				$scope.totals          = response.totals;
				$scope.headers         = response.headers;
				$scope.subHeaders      = response.sub_headers;
				$scope.results         = response.results;
				$scope.resultsTotalRow = response.results_total_row;
				$scope.summaryCounts   = response.summary_counts;
				$scope.reportGroupedBy = response.group_by;

				// track the total count
				$scope.totalCount = response.total_count;
				$scope.currCount = response.results.length;

				$scope.$emit('hideLoader');

				if (!changeView && !loadPage) {
					$rootScope.$emit('report.updated');
				} else if (!!loadPage && !resultPerPageOverride) {
					$rootScope.$emit('report.page.changed');
				} else if (!!resultPerPageOverride) {
					$rootScope.$emit('report.printing');
				} else {
					$rootScope.$emit('report.submit');
				}
			};

			$scope.invokeApi(RVreportsSrv.fetchReportDetails, params, callback);
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
						return email == user.label;
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
						return email == user.label;
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
