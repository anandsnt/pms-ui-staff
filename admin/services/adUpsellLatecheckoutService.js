admin.service('adUpsellLatecheckoutService',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /*
    * To fetch late checkout upsell details
    * @return {object}late checkout upsell details
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


	 /*
    * To update the upsell details
    * @param {object} new upsell details
    */
	this.update = function(data){
		var updateData = data;
		var deferred = $q.defer();
		var url = '/admin/hotel/update_late_checkout_setup';	
		
		ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};


   }]);