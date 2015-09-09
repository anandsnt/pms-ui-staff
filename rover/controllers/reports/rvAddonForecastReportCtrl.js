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

		var addonGroups  = $scope.$parent.$parent.addonGroups,
			addons       = $scope.$parent.$parent.addons,
			allAddonHash = {};

		console.log(addons);

		_.each(addonGroups, function(item) {
			allAddonHash[item.id] = item.description;
		});

		_.each(addons, function(item) {
			_.each(item['list_of_addons'], function(entry) {
				allAddonHash[entry.addon_id] = entry.addon_name;
			});
		});

		console.log(allAddonHash);

		

		var getKey = function(item) {
			return _.keys(item)[0]
		};

		$scope.getKeyValues = function(item) {
			return item[getKey(item)];
		};

		$scope.getKeyName = function(item) {
			return allAddonHash[getKey(item)] || id;
		};
	}
]);