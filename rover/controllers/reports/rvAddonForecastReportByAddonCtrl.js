sntRover.controller('RVAddonForecastReportByAddonCtrl', [
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

		$scope.setScroller('addon-forecast-report-scroll', {
		    preventDefault: false
		});


		var detailsCtrlScope = $scope.$parent,
			mainCtrlScope    = detailsCtrlScope.$parent,
			chosenReport     = detailsCtrlScope.chosenReport,
			results          = mainCtrlScope.results,
			addonGroups      = mainCtrlScope.addonGroups,
			addons           = mainCtrlScope.addons,
			allAddonHash     = {};

		_.each(addonGroups, function(item) {
			allAddonHash[item.id] = item.description;
		});

		_.each(addons, function(item) {
			_.each(item['list_of_addons'], function(entry) {
				allAddonHash[entry.addon_id] = entry.addon_name;
			});
		});		

		$scope.getKey = function(item) {
			return _.keys(item)[0];
		};

		$scope.getKeyValues = function(item) {
			return item[$scope.getKey(item)];
		};

		$scope.getKeyName = function(item) {
			return allAddonHash[$scope.getKey(item)] || item;
		};

		$scope.getOnlyName = function(id) {
			return allAddonHash[id] || id;
		};

		$scope.toggleSub = function(item) {
			if ( ! item.hasOwnProperty('hidden') ) {
				item.hidden = true;
			} else {
				item.hidden = !item.hidden;
			};

			$scope.refreshScroller( 'addon-forecast-report-scroll' );
		};

		var resClassNames = {
			'RESERVED' : 'arrival',
			'CHECKEDIN' : 'check-in',
			'CHECKEDOUT': 'check-out',
			'CANCELED': 'cancel',
			'NOSHOW': 'no-show'
		}
		$scope.getStatusClass = function(status) {
			return resClassNames[status] || '';
		};


		var calPagination = function(eachDate) {
			var perPage = 25,
				pageNo = eachDate.pageNo || 1,
				netTotalCount = eachDate.total_count || 0,
				uiTotalCount = eachDate.reservations.length,
				disablePrevBtn = false,
				disableNextBtn = false,
				resultFrom,
				resultUpto;

			if ( netTotalCount === 0 && uiTotalCount === 0 ) {
				disablePrevBtn = true;
				disableNextBtn = true;
			} else if ( pageNo === 1 ) {
				resultFrom = 1;
				resultUpto = netTotalCount < perPage ? netTotalCount : perPage;
				disablePrevBtn = true;
				disableNextBtn = netTotalCount > perPage ? false : true;
			} else {
				resultFrom = perPage * (pageNo - 1) + 1;
				resultUpto = (resultFrom + perPage - 1) < netTotalCount ? (resultFrom + perPage - 1) : netTotalCount;
				disablePrevBtn = false;
				disableNextBtn = resultUpto === netTotalCount ? true : false;
			};

			return {
				'perPage': perPage,
				'pageNo': pageNo,
				'netTotalCount': netTotalCount,
				'uiTotalCount': uiTotalCount,
				'disablePrevBtn': disablePrevBtn,
				'disableNextBtn': disableNextBtn,
				'resultFrom': resultFrom,
				'resultUpto': resultUpto
			}
 		};


 		_.each(results, function(eachAddonGroup, addonGroupKey) { 			
 			_.each(eachAddonGroup.addons, function(eachAddon) {
 				// console.log($scope.getKeyValues(eachAddon));

 				_.each($scope.getKeyValues(eachAddon).dates, function(dateObj) {
 					var addonKey = $scope.getKey(eachAddon),
 						dateKey  = $scope.getKey(dateObj),
 						eachDate = $scope.getKeyValues(dateObj);

 					_.extend(eachDate, {
 						'sortField': undefined,
 						'roomSortDir': undefined,
 						'nameSortDir': undefined,

 						'date': dateKey,
 						'addonGroupId': addonGroupKey,
 						'addonId': addonKey,
 					});

 					_.extend( eachDate, calPagination(eachDate) );
 				});
 			});
 		});




 		var callResAPI = function(eachDate, params) {
 			var params = params || {},
 				statuses,
 				key;;

 			var success = function (data) {
				$scope.$emit( 'hideLoader' );
				eachDate.reservations = data;
 			};

 			var error = function (data) {
				$scope.$emit( 'hideLoader' );
 			};

 			_.extend(params, {
 				'id'             : chosenReport.id,
 				'date'           : eachDate.date,
 				'addon_group_id' : eachDate.addonGroupId,
 				'addon_id'       : eachDate.addonId,
 				'page'           : eachDate.pageNo,
 				'per_page'       : eachDate.perPage,
 			});

 			statuses = _.where(chosenReport['hasReservationStatus']['data'], { selected: true });
 			if ( statuses.length > 0 ) {
 				key         = reportParams['RESERVATION_STATUS'];
 				params[key] = [];
 				/**/
 				_.each(statuses, function(each) {
 					params[key].push( each.id );
 				});
 			};

 			$scope.invokeApi(reportsSubSrv.fetchAddonReservations, params, success, error);
 		};

 		$scope.sortRes = function(field, eachDate) {
 			var params = {};

 			eachDate.sortField = field;
 			params['sort_field'] = field;

			if ( 'ROOM' == field ) {
				eachDate.roomSortDir = (eachDate.roomSortDir == undefined || eachDate.roomSortDir == false) ? true : false;
				eachDate.nameSortDir = undefined;
				params['sort_dir'] = eachDate.roomSortDir;
			} else if ( 'NAME' == field ) {
				eachDate.nameSortDir = (eachDate.nameSortDir == undefined || eachDate.nameSortDir == false) ? true : false;
				eachDate.roomSortDir = undefined;
				params['sort_dir'] = eachDate.nameSortDir;
			};

			console.log(eachDate);
			console.log(params);

			callResAPI( eachDate, params );
 		};

 		$scope.loadRes = function(type, eachDate) {
 			if ( 'next' == type && ! eachDate.disableNextBtn ) {
 				eachDate.pageNo++;
 				_.extend( eachDate, calPagination(eachDate) );

 				callResAPI( eachDate );
 			} else if ( 'prev' == type && ! eachDate.disablePrevBtn ) {
 				eachDate.pageNo--;
 				_.extend( eachDate, calPagination(eachDate) );
 				
 				callResAPI( eachDate );
 			};
 		};



 		mainCtrlScope.printOptions.showModal = function() {
 			$scope.printLevel = {};
 			$scope.levelValues = {
 				'date'  : 'DATE',
 				'group' : 'GROUP',
 				'addon' : 'ADDON',
 				'all'   : 'ALL'
 			};

			$scope.printLevel.value = 'GROUP';

 			// show popup
 			ngDialog.open({
 				template: '/assets/partials/reports/addonForecastReport/rvGrpByGroupPrintPopup.html',
 				className: 'ngdialog-theme-default',
 				closeByDocument: true,
 				scope: $scope,
 				data: []
 			});
		};

		mainCtrlScope.printOptions.afterPrint = function() {
			// reset show alls
			$scope.openAddon = false;
			$scope.openDate = false;
			$scope.openResrv = false;
		};

		// restore the old dates and close
		$scope.closeDialog = function() {
			mainCtrlScope.printOptions.afterPrint();
		    ngDialog.close();
		};

		$scope.continueWithPrint = function () {
			switch( $scope.printLevel.value ) {
				case 'ADDON':
					$scope.openAddon = true;
					break;

				case 'DATE':
					$scope.openAddon = true;
					$scope.openDate = true;
					break;

				case 'ALL':
					$scope.openAddon = true;
					$scope.openDate = true;
					$scope.openResrv = true;
					break;

				default:
					// no-op
			};

			ngDialog.close();
			$scope.$emit( reportMsgs['REPORT_PRE_PRINT_DONE'] );
		};
	}
]);