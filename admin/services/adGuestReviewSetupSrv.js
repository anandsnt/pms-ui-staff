admin.service('ADGuestReviewSetupSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){

   /*
	* service class for Guest Review setup
	*/

   /*
    * getter method to get Guest Review setup details
    * @return {object} Guest Review setup details
    */
	this.fetchGuestSetupDetails = function(){
		var deferred = $q.defer();
		var url = '/admin/get_review_settings.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to save the guest review setup details
	* @param {object} with guest review setup details
	*/
	this.saveGuestReviewSetup = function(data){
		var deferred = $q.defer();
		var url = '/admin/update_review_settings';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}

}]);