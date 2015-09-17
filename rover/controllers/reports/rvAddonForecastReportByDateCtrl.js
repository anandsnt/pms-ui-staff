sntRover.controller('RVAddonForecastReportByDateCtrl', [
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
			addonGrpHash = {},
			addonHash    = {},
			addonGroups,
			addons;


		$scope.getKey = function(item) {
			return _.keys(item)[0];
		};

		$scope.getKeyValues = function(item) {
			return item[$scope.getKey(item)];
		};

		$scope.getAddonGrpName = function(item) {
			return addonGrpHash[$scope.getKey(item)] || item;
		};

		$scope.getAddonName = function(item) {
			return addonHash[$scope.getKey(item)] || item;
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

		$scope.sortRes = function(field, addon) {
 			var params = {};

 			addon.sortField = field;
 			params['sort_field'] = field;

			if ( 'ROOM' == field ) {
				addon.roomSortDir = (addon.roomSortDir == undefined || addon.roomSortDir == false) ? true : false;
				addon.nameSortDir = undefined;
				params['sort_dir'] = addon.roomSortDir;
			} else if ( 'NAME' == field ) {
				addon.nameSortDir = (addon.nameSortDir == undefined || addon.nameSortDir == false) ? true : false;
				addon.roomSortDir = undefined;
				params['sort_dir'] = addon.nameSortDir;
			};

			callResAPI( addon, params );
 		};

 		$scope.loadRes = function(type, addon) {
 			if ( 'next' == type && ! addon.disableNextBtn ) {
 				addon.pageNo++;
 				_.extend( addon, calPagination(addon) );

 				callResAPI( addon );
 			} else if ( 'prev' == type && ! addon.disablePrevBtn ) {
 				addon.pageNo--;
 				_.extend( addon, calPagination(addon) );
 				
 				callResAPI( addon );
 			};
 		};

		function calPagination (addon) {
			var perPage        = 25,
				pageNo         = addon.pageNo || 1,
				netTotalCount  = addon.total_count || 0,
				uiTotalCount   = !!addon.reservations ? addon.reservations.length : 0,
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
			};
 		};

 		function callResAPI (addon, params) {
 			var params = params || {},
 				statuses,
 				key;

 			var success = function (data) {
				$scope.$emit( 'hideLoader' );
				addon.reservations = data;
 			};

 			var error = function (data) {
				$scope.$emit( 'hideLoader' );
 			};

 			_.extend(params, {
 				'id'             : chosenReport.id,
 				'date'           : addon.date,
 				'addon_group_id' : addon.addonGroupId,
 				'addon_id'       : addon.addonId,
 				'page'           : addon.pageNo,
 				'per_page'       : addon.perPage,
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


 		function init () {
			addonGroups  = mainCtrlScope.addonGroups;
			addons       = mainCtrlScope.addons;
			addonGrpHash = {};
			addonHash    = {};

			_.each(addonGroups, function(item) {
				addonGrpHash[item.id] = item.description;
			});

			_.each(addons, function(item) {
				_.each(item['list_of_addons'], function(entry) {
					addonHash[entry.addon_id] = entry.addon_name;
				});
			});

			$scope.modifiedResults = {};
			for (reportKey in results) {
				if ( ! results.hasOwnProperty(reportKey) ) {
					continue;
				};

				var date        = reportKey,
					addonGroups = results[reportKey]['addon_groups'];
				
				var i, j;
				for (i = 0, j = addonGroups.length; i < j; i++) {
					var addonGrpObj = addonGroups[i];

					for (addonGroupKey in addonGrpObj) {
						if ( '$$hashKey' == addonGroupKey || ! addonGrpObj.hasOwnProperty(addonGroupKey) ) {
							continue;
						};

						var addonGroupId = addonGroupKey,
							addons       = addonGrpObj[addonGroupKey]['addons'];

						if ( addonGrpObj[addonGroupKey]['guests'] > 0 ) {
							addonGrpObj[addonGroupKey]['hasData'] = true;
						} else {
							addonGrpObj[addonGroupKey]['hasData'] = false;
						};

						var k, l;
						for (k = 0, l = addons.length; k < l; k++) {
							var addonObj = addons[k];

							for (addonKey in addonObj) {
								if ( '$$hashKey' == addonKey || ! addonObj.hasOwnProperty(addonKey) ) {
									continue;
								};

								var addonId = addonKey,
									addon   = addonObj[addonKey];

								// helping template in rendering by
								// telling which addonGroups are empty
								if ( 0 < addonObj[addonKey]['guests'] ) {
									addonObj[addonKey]['hasData'] = true;

									_.extend(addon, {
										'sortField'   : undefined,
										'roomSortDir' : undefined,
										'nameSortDir' : undefined,
										/**/
										'date'         : date,
										'addonGroupId' : addonGroupId,
										'addonId'      : addonId
									});

									_.extend( addon, calPagination(addon) );
								} else {
									addonObj[addonKey]['hasData'] = false;
								};
							};
						};
					};
				};
			};
			/* LOOP ENDS */
			$scope.modifiedResults = angular.copy( results );
		};

		init();	


		// re-render must be initiated before for taks like printing.
		// thats why timeout time is set to min value 50ms
		var reportSubmited    = $scope.$on( reportMsgs['REPORT_SUBMITED'], init );
		var reportPrinting    = $scope.$on( reportMsgs['REPORT_PRINTING'], init );
		var reportUpdated     = $scope.$on( reportMsgs['REPORT_UPDATED'], init );
		var reportPageChanged = $scope.$on( reportMsgs['REPORT_PAGE_CHANGED'], init );

		$scope.$on( 'destroy', reportSubmited );
		$scope.$on( 'destroy', reportUpdated );
		$scope.$on( 'destroy', reportPrinting );
		$scope.$on( 'destroy', reportPageChanged );

 		








 		mainCtrlScope.printOptions.showModal = function() {			
 			$scope.printLevel = {};
 			$scope.levelValues = {
 				'date'  : 'DATE',
 				'group' : 'GROUP',
 				'addon' : 'ADDON',
 				'all'   : 'ALL'
 			};

			$scope.printLevel.value = 'DATE';

 			// show popup
 			ngDialog.open({
 				template: '/assets/partials/reports/addonForecastReport/rvGrpByDatePrintPopup.html',
 				className: 'ngdialog-theme-default',
 				closeByDocument: true,
 				scope: $scope,
 				data: []
 			});
		};

		mainCtrlScope.printOptions.afterPrint = function() {
			// reset show alls
			$scope.openGroup = false;
			$scope.openAddon = false;
			$scope.openResrv = false;
		};

		// restore the old dates and close
		$scope.closeDialog = function() {
			mainCtrlScope.printOptions.afterPrint();
		    ngDialog.close();
		};

		$scope.continueWithPrint = function () {
			switch( $scope.printLevel.value ) {
				case 'GROUP':
					$scope.openGroup = true;
					break;

				case 'ADDON':
					$scope.openGroup = true;
					$scope.openAddon = true;
					break;

				case 'ALL':
					$scope.openGroup = true;
					$scope.openAddon = true;
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