admin.service('adForceAdjustmentReasonSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

	this.fetchReasons = function() {
		var deferred = $q.defer();
		var url = '/admin/force_adjustment_reasons';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
    };

    this.saveReasons = function(data) {
		var deferred = $q.defer();
		var url = '/admin/force_adjustment_reasons';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};

    this.toggleAction = function(data) {
		var deferred = $q.defer();
		var url = '/admin/force_adjustment_reasons/force_adjustment_reason_setting';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	
    this.removeReasons = function(data) {
		var deferred = $q.defer();
		var url = '/admin/force_adjustment_reasons/' + data.id;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		    deferred.resolve(data);
		}, function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;
    };

}]);