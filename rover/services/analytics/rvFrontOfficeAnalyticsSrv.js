angular.module('sntRover').service('rvFrontOfficeAnalyticsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		this.fetchFrontDeskAnalyticsData = function(params) {
			var url = '/sample_json/dashboard/dashboardAnalytics.json';

			return rvBaseWebSrvV2.getJSON(url, params);
		};
	}
]);