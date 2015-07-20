sntRover.service('RVSmartBandSrv',['$q', 'BaseWebSrvV2', function($q, BaseWebSrvV2){

	this.createSmartBand = function(data){
		var deferred = $q.defer();
		var url = '/api/reservations/' + data.reservationId + '/smartbands';
		BaseWebSrvV2.postJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.listSmartBands = function(data){
		var deferred = $q.defer();
		var url = '/api/reservations/' + data.reservationId + '/smartbands.json';
		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.getSmartBandDetails = function(id){
		var deferred = $q.defer();
		var url = '/api/smartbands/' + id;
		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.updateSmartBandDetails = function(data){
		var deferred = $q.defer();
		var url = '/api/smartbands/' + data.bandId ;
		BaseWebSrvV2.putJSON(url, data.postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.getBalanceSmartBands = function(data){
		var deferred = $q.defer();
		var url = 'api/reservations/'+data.reservationId+'/smartbands/with_balance.json' ;
		BaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

	this.cashOutSmartBalance = function(id){
		var deferred = $q.defer();
		var url = '/api/reservations/'+id+'/smartbands/cash_out' ;
		var postData = {};
		BaseWebSrvV2.postJSON(url, postData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};



}]);