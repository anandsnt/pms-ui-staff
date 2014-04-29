admin.service('ADRatesAddonsSrv', [
	'$q',
	'ADBaseWebSrvV2',
	function($q, ADBaseWebSrvV2) {

		/*
		* To fetch rates addon list
		* 
		* @param {object} contains page and per_page params
		* @return {object} defer promise
		*/	
		this.fetch = function(params) {
			var deferred = $q.defer(),
				url      = '/api/addons',
				params   = params || {};

			ADBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* To fetch details of an individual addon
		* @param {number} addon id
		* @return {object} defer promise
		*/
		this.fetchSingle = function(id) {
			var deferred = $q.defer(),
				url      = '/api/addons/' + id;

			ADBaseWebSrvV2.getJSON(url, {})
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* To add new addon
		* @param {object} new addon details
		* @return {object} defer promise
		*/
		this.addNewAddon = function(data){
			var deferred = $q.defer(),
				url = '/api/addons';

			ADBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				},function(errorMessage){
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};
	}
]);