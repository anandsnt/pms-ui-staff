sntRover.service('RVWorkstationSrv',['$q','rvBaseWebSrvV2', function($q, RVBaseWebSrvV2) {

	//Service to check whether a workstation with given device id is already set or not
	this.setWorkstation = function(param) {
		var deferred = $q.defer();
		var url =  '/api/workstations/set_workstation';
		RVBaseWebSrvV2.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

	//Service to create new workstation
	this.createWorkstation = function(param) {
		var deferred = $q.defer();
		var url = '/api/workstations';

		RVBaseWebSrvV2.postJSON(url, param).then(function(data) {
		    deferred.resolve(data);
		},function(data) {
		    deferred.reject(data);
		});
		return deferred.promise;

	};

	//Fetches the list of emv terminals
	this.fetchEmvTerminals = function() {
		var deferred = $q.defer();
		var url = '/api/emv_terminals';

		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage) {
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	//Fetches the list of key encoders
	this.fetchEncoders = function (data) {
	    var deferred = $q.defer();

	    var url = "/api/key_encoders";
	    RVBaseWebSrvV2.getJSON(url, data).then(function (data) {
	        deferred.resolve(data);
	    }, function (data) {
	        deferred.reject(data);
	    });
	    return deferred.promise;
    };

	
}]);