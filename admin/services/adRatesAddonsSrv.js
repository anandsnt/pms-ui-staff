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

		/*
		* Get the list of charge codes
		*
		* @method GET
		* @return {object} defer promise
		*/
		this.fetchChargeCodes = function() {
			var deferred = $q.defer(),
				url      = '/api/charge_codes',
				params   = { per_page: 1000, page: 1 };

			ADBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* Get the list of charge groups
		*
		* @method GET
		* @return {object} defer promise
		*/
		this.fetchChargeGroups = function() {
			var deferred = $q.defer(),
				url      = '/api/charge_groups';

			ADBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* Get a particular list from refrence values api
		*
		* @method GET
		* @param {object} type - 'amount_type' or 'post_type'
		* @return {object} defer promise
		*/
		this.fetchReferenceValue = function(params) {
			var deferred = $q.defer(),
				url      = '/api/reference_values';

			ADBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* Get the current business date
		*
		* @method GET
		* @return {object} defer promise
		*/
		this.fetchBusinessDate = function(params) {
			var deferred = $q.defer(),
				url      = '/api/business_dates/active';

			ADBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* activate/deactivate an adddon
		*
		* @method POST
		* @param {object} id of the addon
		* @return {object} defer promise
		*/
		this.switchActivation = function(dataWith) {
			var deferred = $q.defer(),
				url      = '/api/addons/' + dataWith.id + '/activate',
				data     = _.omit(dataWith, 'id');

			ADBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		/*
		* delete an adddon
		*
		* @method DELETE
		* @param {object} id of the addon
		* @return {object} defer promise
		*/
		this.deleteAddon = function(params) {
			var deferred = $q.defer(),
				url      = '/api/addons/' + params.id;

			ADBaseWebSrvV2.deleteJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}, function(errorMessage) {
					deferred.reject(errorMessage);
				});

			return deferred.promise;
		};

		this.importPackages = function () {
            var deferred = $q.defer();
            var url = "/api/addons/import";
            ADBaseWebSrvV2.postJSON(url).then(function (data) {
                deferred.resolve(data.results);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
	}

]);