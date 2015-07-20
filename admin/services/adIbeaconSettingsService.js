
admin.service('adiBeaconSettingsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
/*
* To fetch ibeacon list
* @return {object}
*/
this.fetchBeaconList = function(data){
	var deferred = $q.defer();
	var url = '/api/beacons';
	ADBaseWebSrvV2.getJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To activate/deactivate ibeacon
* @return {object}
*/
this.toggleBeacon = function(data){
	var deferred = $q.defer();
	var url = '/api/beacons/'+data.id+'/activate';
	var toggleData ={"status": data.status};
	ADBaseWebSrvV2.postJSON(url,toggleData).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To delete ibeacon
* @return {object}
*/
this.deleteBeacon = function(data){
	var deferred = $q.defer();
	var url = '/api/beacons/'+data.id;
	ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To fetch beacon type
* @return {object}
*/
this.fetchBeaconTypes = function(){
	var deferred = $q.defer();
	var url = '/api/beacons/types';
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To fetch beacon trigger types
* @return {object}
*/
this.fetchBeaconTriggerTypes= function(){
	var deferred = $q.defer();
	var url = '/api/beacons/ranges';
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};
/*
* To fetch beacon uuids
* @return {object}
*/
this.fetchBeaconDeafultDetails  = function(){
	var deferred = $q.defer();
	var url='/api/beacons/uuid_values';
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To fetch beacon details
* @return {object}
*/
this.fetchBeaconDetails = function(data){
	var deferred = $q.defer();
	var url='/api/beacons/'+data.id;
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};


/*
* To fetch beacon details
* @return {object}
*/
this.fetchBeaconDetails = function(data){
	var deferred = $q.defer();
	var url='/api/beacons/'+data.id;
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To update beacon details
*  @param {object}
*/
this.updateBeaconDetails = function(data){
	var deferred = $q.defer();
	var url = '/api/beacons/'+data.id;
	ADBaseWebSrvV2.putJSON(url,data.data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

/*
* To add beacon details
*  @param {object}
*/
this.addBeaconDetails = function(data){
	var deferred = $q.defer();
	var url = '/api/beacons';
	ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};
/*
* To set the link status for ibeacon
*  @param {object}
*/
this.setLink = function(data){
	var deferred = $q.defer();
	var url = 'api/beacons/link.json';
	ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};

}]);
