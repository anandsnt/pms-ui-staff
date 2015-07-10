sntRover.service('RVPostChargeSrvV2',['$http', '$q', 'BaseWebSrvV2','RVBaseWebSrv', function( $http, $q, BaseWebSrvV2, RVBaseWebSrv ){
   	
	var that = this;

    this.fetchChargeGroups = function () {

        var deferred = $q.defer();
        var url = "/api/charge_groups.json";

        BaseWebSrvV2.getJSON(url).then(function( data ) {
        	console.log(data);
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.postCharges = function( params ) {

		var deferred = $q.defer();
		var url = '/staff/items/post_items_to_bill';

		RVBaseWebSrv.postJSON( url, params )
			.then(function( data ) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});

		return deferred.promise;
	};


	this.getReservationBillDetails = function( reservationId ){

		var deferred = $q.defer();
		var url = '/api/reservations/'+reservationId+'/bills';

		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};

    
   
}]);