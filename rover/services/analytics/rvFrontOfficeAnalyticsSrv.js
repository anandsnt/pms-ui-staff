angular.module('sntRover').service('rvFrontOfficeAnalyticsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	'rvAnalyticsSrv',
	function($q, rvBaseWebSrvV2, rvAnalyticsSrv) {

		this.fetchFrontDeskAnalyticsData = function(params) {
			var url = '/sample_json/dashboard/dashboardAnalytics.json';

			return rvBaseWebSrvV2.getJSON(url, params);
		};

		this.fdArrivalsManagement = function(date) {
            var deferred = $q.defer();

            var options = {
                params: date,
                successCallBack: function() {
                    rvAnalyticsSrv.hkOverview(date).then(function(data) {
                        data.label = 'AN_ARRIVALS_MANAGEMENT';
                        data.dashboard_type = 'arrivals_management_chart';
                        deferred.resolve(data);
                    });
                }
            };

            $scope.callAPI(rvAnalyticsSrv.initRoomAndReservationApis, options);

            return deferred.promise;
        };

		this.fdWorkload = function(date) {
            var deferred = $q.defer();

            var options = {
                params: { date: date },
                successCallBack: function() {
                    constructFdWorkLoad(deferred, date);
                }
            };
            $scope.callAPI(rvAnalyticsSrv.fetchActiveReservation, options);

            return deferred.promise;
        };

		var constructFdWorkLoad = function(deferred, date) {
            var fdWorkLoad = {
                dashboard_type: 'frontdesk_workload',
                label: 'AN_WORKLOAD',
                data: []
            };

            return deferred.resolve(fdWorkLoad);
        };

	}
]);
