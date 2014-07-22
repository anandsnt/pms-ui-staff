
admin.service('adiBeaconSettingsSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
/*
* To fetch ibeacon list
* @return {object}
*/	
this.fetchBeaconList = function(){
	var deferred = $q.defer();
	var url = '/api/beacons';		
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
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
	var url = '/ui/show?format=json&json_input=iBeaconSetup/ibeacontypes.json';	
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
	var url = '/ui/show?format=json&json_input=iBeaconSetup/ibeaconTriggers.json';		
	ADBaseWebSrvV2.getJSON(url).then(function(data) {
		deferred.resolve(data);
	},function(data){
		deferred.reject(data);
	});
	return deferred.promise;
};
/*
* To fetch beacon neighbours 
* @return {object}
*/	
this.fetchBeaconNeighbours= function(){
	var deferred = $q.defer();
	var url = '/ui/show?format=json&json_input=iBeaconSetup/iBeaconNeighbours.json';		
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

}]);
