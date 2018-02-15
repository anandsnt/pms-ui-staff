admin.service('adAppVersionsSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchAppVersions = function() {
		var deferred = $q.defer();
		var url = '/api/notifications/notification_device_list?application=ROVER';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			data = [{
				"id": 1,
				"version": "1.2.1",
				"updated_on": "12/11/2017",
				"description": "description 1.description 1description 1.description 1description 1description 1description 1description 1description 1description 1description 1description 1description 1description 1"
			}, {
				"id": 2,
				"version": "1.2.2",
				"updated_on": "16/11/2019",
				"description": "description 2"
			}, {
				"id": 3,
				"version": "1.2.3",
				"updated_on": "10/11/2018",
				"description": "description 3"
			}];

			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.saveSetup = function(data) {
		var deferred = $q.defer();
		var url = '/api/notifications/set_loggging_status';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.updateAppUpgradeTimes = function(params) {
		var deferred = $q.defer();
		var url = '/admin/service_application_types';

		ADBaseWebSrvV2.putJSON(url, params).then(function(response) {
			deferred.resolve(response);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.returnTimeArray = function() {
		var timeoptions = ["00:00", "00:15",
			"00:30", "00:45",
			"01:00", "01:15",
			"01:30", "01:45",
			"02:00", "02:15",
			"02:30", "02:45",
			"03:00", "03:15",
			"03:30", "03:45",
			"04:00", "04:15",
			"04:30", "04:45",
			"05:00", "05:15",
			"05:30", "05:45",
			"06:00", "06:15",
			"06:30", "06:45",
			"07:00", "07:15",
			"07:30", "07:45",
			"08:00", "08:15",
			"08:30", "08:45",
			"09:00", "09:15",
			"09:30", "09:45",
			"10:00", "10:15",
			"10:30", "10:45",
			"11:00", "11:15",
			"11:30", "11:45",
			"12:00", "12:15",
			"12:30", "12:45",
			"13:00", "13:15",
			"13:30", "13:45",
			"14:00", "14:15",
			"14:30", "14:45",
			"15:00", "15:15",
			"15:30", "15:45",
			"16:00", "16:15",
			"16:30", "16:45",
			"17:00", "17:15",
			"17:30", "17:45",
			"18:00", "18:15",
			"18:30", "18:45",
			"19:00", "19:15",
			"19:30", "19:45",
			"20:00", "20:15",
			"20:30", "20:45",
			"21:00", "21:15",
			"21:30", "21:45",
			"22:00", "22:15",
			"22:30", "22:45",
			"23:00", "23:15",
			"23:30", "23:45"
		];
		return timeoptions;
	};

}]);