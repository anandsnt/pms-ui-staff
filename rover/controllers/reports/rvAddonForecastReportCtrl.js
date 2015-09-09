sntRover.controller('RVAddonForecastReportCtrl', [
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
	function($rootScope, $scope, reportsSrv, reportsSubSrv, reportUtils, reportParams, reportMsgs, reportNames, $filter, $timeout) {
		
		$scope.setScroller('addon-forecast-report-scroll', {
		    preventDefault: false
		});


		var results      = $scope.$parent.$parent.results,
			addonGroups  = $scope.$parent.$parent.addonGroups,
			addons       = $scope.$parent.$parent.addons,
			allAddonHash = {};

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
			return allAddonHash[$scope.getKey(item)] || id;
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


		var calPagination = function(addon) {
			var perPage = 25,
				pageNo,
				netTotalCount,
				uiTotalCount,
				disablePrevBtn,
				disableNextBtn,
				resultFrom,
				resultUpto


			// clear old results and update total counts
			$scope.netTotalCount = $scope.$parent.totalCount;

			if ( typeof $scope.$parent.results === 'array' ) {
				$scope.uiTotalCount = $scope.$parent.results.length;
			} else if ( typeof $scope.$parent.results === 'object' ) {
				$scope.uiTotalCount = 0;
				_.each($scope.$parent.results, function(item) {
					if ( typeof item === 'array' ) {
						$scope.uiTotalCount += item.length;
					};
				});
			};

			if ( $scope.netTotalCount === 0 && $scope.uiTotalCount === 0 ) {
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = true;
			} else if ( $_pageNo === 1 ) {
				$scope.resultFrom = 1;
				$scope.resultUpto = $scope.netTotalCount < $_resultsPerPage ? $scope.netTotalCount : $_resultsPerPage;
				$scope.disablePrevBtn = true;
				$scope.disableNextBtn = $scope.netTotalCount > $_resultsPerPage ? false : true;
			} else {
				$scope.resultFrom = $_resultsPerPage * ($_pageNo - 1) + 1;
				$scope.resultUpto = ($scope.resultFrom + $_resultsPerPage - 1) < $scope.netTotalCount ? ($scope.resultFrom + $_resultsPerPage - 1) : $scope.netTotalCount;
				$scope.disablePrevBtn = false;
				$scope.disableNextBtn = $scope.resultUpto === $scope.netTotalCount ? true : false;
			}
 		};


 		_.each(results, function(eachResult, resultKey) {
 			_.each(eachResult.addon_groups, function(eachAddonGroup) {
 				_.each( $scope.getKeyValues(eachAddonGroup), function(eachAddon) {
 					var addonData = $scope.getKeyValues(eachAddon);

 					_.extend(addonData, {
 						'sortKey': '',
 						"sortDir": ''

 						'date': resultKey,
 						'addonGroupId': $scope.getKeyValues(eachAddonGroup)
 					});

 					console.log(addonData);
 				});
 			});
 		});
	}
]);