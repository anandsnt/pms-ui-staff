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
		var url = '/admin/service_application_types/update_app_types';

		ADBaseWebSrvV2.postJSON(url, params).then(function(response) {
			deferred.resolve(response);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};


	this.returnTimeArray = function() {
		var timeoptions = [{
			"value": "00:00",
			"description": "12:00 am"
		}, {
			"value": "00:15",
			"description": "12:15 am"
		}, {
			"value": "00:30",
			"description": "12:30 am"
		}, {
			"value": "00:45",
			"description": "12:45 am"
		}, {
			"value": "01:00",
			"description": "1:00 am"
		}, {
			"value": "01:15",
			"description": "1:15 am"
		}, {
			"value": "01:30",
			"description": "1:30 am"
		}, {
			"value": "01:45",
			"description": "1:45 am"
		}, {
			"value": "02:00",
			"description": "2:00 am"
		}, {
			"value": "02:15",
			"description": "2:15 am"
		}, {
			"value": "02:30",
			"description": "2:30 am"
		}, {
			"value": "02:45",
			"description": "2:45 am"
		}, {
			"value": "03:00",
			"description": "3:00 am"
		}, {
			"value": "03:15",
			"description": "3:15 am"
		}, {
			"value": "03:30",
			"description": "3:30 am"
		}, {
			"value": "03:45",
			"description": "3:45 am"
		}, {
			"value": "04:00",
			"description": "4:00 am"
		}, {
			"value": "04:15",
			"description": "4:15 am"
		}, {
			"value": "04:30",
			"description": "4:30 am"
		}, {
			"value": "04:45",
			"description": "4:45 am"
		}, {
			"value": "05:00",
			"description": "5:00 am"
		}, {
			"value": "05:15",
			"description": "5:15 am"
		}, {
			"value": "05:30",
			"description": "5:30 am"
		}, {
			"value": "05:45",
			"description": "5:45 am"
		}, {
			"value": "06:00",
			"description": "6:00 am"
		}, {
			"value": "06:15",
			"description": "6:15 am"
		}, {
			"value": "06:30",
			"description": "6:30 am"
		}, {
			"value": "06:45",
			"description": "6:45 am"
		}, {
			"value": "07:00",
			"description": "7:00 am"
		}, {
			"value": "07:15",
			"description": "7:15 am"
		}, {
			"value": "07:30",
			"description": "7:30 am"
		}, {
			"value": "07:45",
			"description": "7:45 am"
		}, {
			"value": "08:00",
			"description": "8:00 am"
		}, {
			"value": "08:15",
			"description": "8:15 am"
		}, {
			"value": "08:30",
			"description": "8:30 am"
		}, {
			"value": "08:45",
			"description": "8:45 am"
		}, {
			"value": "09:00",
			"description": "9:00 am"
		}, {
			"value": "09:15",
			"description": "9:15 am"
		}, {
			"value": "09:30",
			"description": "9:30 am"
		}, {
			"value": "09:45",
			"description": "9:45 am"
		}, {
			"value": "10:00",
			"description": "10:00 am"
		}, {
			"value": "10:15",
			"description": "10:15 am"
		}, {
			"value": "10:30",
			"description": "10:30 am"
		}, {
			"value": "10:45",
			"description": "10:45 am"
		}, {
			"value": "11:00",
			"description": "11:00 am"
		}, {
			"value": "11:15",
			"description": "11:15 am"
		}, {
			"value": "11:30",
			"description": "11:30 am"
		}, {
			"value": "11:45",
			"description": "11:45 am"
		}, {
			"value": "12:00",
			"description": "12:00 pm"
		}, {
			"value": "12:15",
			"description": "12:15 pm"
		}, {
			"value": "12:30",
			"description": "12:30 pm"
		}, {
			"value": "12:45",
			"description": "12:45 pm"
		}, {
			"value": "13:00",
			"description": "01:00 pm"
		}, {
			"value": "13:15",
			"description": "01:15 pm"
		}, {
			"value": "13:30",
			"description": "1:30 pm"
		}, {
			"value": "13:45",
			"description": "1:45 pm"
		}, {
			"value": "14:00",
			"description": "2:00 pm"
		}, {
			"value": "14:15",
			"description": "2:15 pm"
		}, {
			"value": "14:30",
			"description": "2:30 pm"
		}, {
			"value": "14:45",
			"description": "2:45 pm"
		}, {
			"value": "15:00",
			"description": "3:00 pm"
		}, {
			"value": "15:15",
			"description": "3:15 pm"
		}, {
			"value": "15:30",
			"description": "3:30 pm"
		}, {
			"value": "15:45",
			"description": "3:45 pm"
		}, {
			"value": "16:00",
			"description": "4:00 pm"
		}, {
			"value": "16:15",
			"description": "4:15 pm"
		}, {
			"value": "16:30",
			"description": "4:30 pm"
		}, {
			"value": "16:45",
			"description": "4:45 pm"
		}, {
			"value": "17:00",
			"description": "5:00 pm"
		}, {
			"value": "17:15",
			"description": "5:15 pm"
		}, {
			"value": "17:30",
			"description": "5:30 pm"
		}, {
			"value": "17:45",
			"description": "5:45 pm"
		}, {
			"value": "18:00",
			"description": "6:00 pm"
		}, {
			"value": "18:15",
			"description": "6:15 pm"
		}, {
			"value": "18:30",
			"description": "6:30 pm"
		}, {
			"value": "18:45",
			"description": "6:45 pm"
		}, {
			"value": "19:00",
			"description": "7:00 pm"
		}, {
			"value": "19:15",
			"description": "7:15 pm"
		}, {
			"value": "19:30",
			"description": "7:30 pm"
		}, {
			"value": "19:45",
			"description": "7:45 pm"
		}, {
			"value": "20:00",
			"description": "8:00 pm"
		}, {
			"value": "20:15",
			"description": "8:15 pm"
		}, {
			"value": "20:30",
			"description": "8:30 pm"
		}, {
			"value": "20:45",
			"description": "8:45 pm"
		}, {
			"value": "21:00",
			"description": "9:00 pm"
		}, {
			"value": "21:15",
			"description": "9:15 pm"
		}, {
			"value": "21:30",
			"description": "9:30 pm"
		}, {
			"value": "21:45",
			"description": "9:45 pm"
		}, {
			"value": "22:00",
			"description": "10:00 pm"
		}, {
			"value": "22:15",
			"description": "10:15 pm"
		}, {
			"value": "22:30",
			"description": "10:30 pm"
		}, {
			"value": "22:45",
			"description": "10:45 pm"
		}, {
			"value": "23:00",
			"description": "11:00 pm"
		}, {
			"value": "23:15",
			"description": "11:15 pm"
		}, {
			"value": "23:30",
			"description": "11:30 pm"
		}, {
			"value": "23:45",
			"description": "11:45 pm"
		}];
		return timeoptions;
	};

}]);