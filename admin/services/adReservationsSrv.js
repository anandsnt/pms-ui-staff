admin.service('ADReservationSettingsSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
	
   /**
    * To fetch the reservations data
    * @return {object} reservations data
    */
	this.fetchReservationsData = function(){
		
		var deferred = $q.defer();
		var url = '/admin/users.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};





}]);