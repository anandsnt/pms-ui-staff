admin.service('adRoomUpsellService',['$q', 'ADBaseWebSrv', function( $q, ADBaseWebSrv){
   /*
    * To fetch late checkout upsell details
    * @return {object}late checkout upsell details
    */	


   this.fetch = function(){
		var deferred = $q.defer();
		var url = '/admin/room_upsells/room_upsell_options.json';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
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
	 	var url = '/admin/room_upsells/update_upsell_options';	
		
	 	ADBaseWebSrv.postJSON(url,updateData).then(function(data) {
	 		deferred.resolve(data);
	 	},function(data){
	 		deferred.reject(data);
	 	});
	 	return deferred.promise;
	 };


   }]);