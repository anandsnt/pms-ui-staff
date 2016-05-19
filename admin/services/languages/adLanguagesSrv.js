admin.service('ADLanguagesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

   /**
    * To fetch the list of languages
    * @return {Object} promise function
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/guest_languages';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 * call to change the show on guest card flag.
	 * @param {Object} paramenters
	 */
	this.toggleLanguagesUse = function(params) {
		var deferred = $q.defer();
		var url = '/api/guest_languages';
		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.resolve(data);
		});
		return deferred.promise;
	};

	/**
	 * Update status of a language to disable it in the dropdown in the guestcard.
	 * @param {Object} languade details
	 */
	this.updateLanguage = function(language) {
		var deferred = $q.defer();
		var url = '/api/guest_languages';
		ADBaseWebSrvV2.postJSON(url, language).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.resolve(data);
		});
		return deferred.promise;
	};
}]);