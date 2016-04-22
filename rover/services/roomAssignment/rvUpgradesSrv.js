angular.module('sntRover').service('RVUpgradesSrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){


	this.getAllUpgrades = function(param){
		var deferred = $q.defer();
		// var url =  '/staff/reservations/room_upsell_options.json';
		var url =  '/staff/reservations/upgrade_room_type_upsell_options.json';

		RVBaseWebSrv.getJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
			return deferred.promise;
	};
	this.selectUpgrade = function(param){
		var deferred = $q.defer();
		var url =  '/staff/reservations/upgrade_room.json';
		RVBaseWebSrv.postJSON(url, param).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
			return deferred.promise;
	};

}]);