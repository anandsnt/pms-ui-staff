admin.service('ADLanguagesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

   /**
    * To fetch the list of languages
    */
	this.fetch = function(){
		var deferred = $q.defer();
		var url = '/api/languages';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	/**
	 *
	 */
	this.toggleLanguagesUse = function() {

	};

	this.updateLanguage = function() {

	};
}]);