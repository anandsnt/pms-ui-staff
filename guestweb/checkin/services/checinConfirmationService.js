(function() {
	var checinConfirmationService = function($q,baseWebService,$rootScope) {
		
		var responseData = {};


		//fetch texts to be displayed

		var login = function(data) {
			
			var deferred = $q.defer();

			var url = '/guest_web/search.json';
	
			baseWebService.post(url,data).then(function(response) {

console.log(response)

				this.responseData = response;
				deferred.resolve(this.responseData);
			});
			

			return deferred.promise;
		};


		return {
			responseData: responseData,
			login : login
		}
	};

	var dependencies = [
	'$q','baseWebService','$rootScope',
	checinConfirmationService
	];

	snt.factory('checinConfirmationService', dependencies);
})();