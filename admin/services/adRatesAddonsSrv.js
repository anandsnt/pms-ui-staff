admin.service('ADRatesAddonsSrv', [
	'$q',
	'ADBaseWebSrvV2',
	function($q, ADBaseWebSrvV2) {

		/*
		* To fetch rates addon list
		*
		* @method GET
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
		* To fetch details of an single addon
		*
		* @method GET
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
		*
		* @method POST
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

		/*
		* Update the details of an single addon
		*
		* @method PUT
		* @param {object} new addon details, will omit item 'id' before PUT
		* @return {object} defer promise
		*/
		this.updateSingle = function(dataWith) {
			var deferred = $q.defer(),
				url      = '/api/addons/' + dataWith.id,
				data     = _.omit(dataWith, 'id');

			ADBaseWebSrvV2.putJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};
	}
]);