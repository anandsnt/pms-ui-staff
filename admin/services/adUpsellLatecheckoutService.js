admin.service('adUpsellLatecheckoutService',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * To fetch chains list
    * @return {object} chains list
    */	


   this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/hotel/get_late_checkout_setup.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};



   }]);