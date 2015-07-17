sntRover.service('rvGroupSrv',
	['$q', 'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {

		//some default values
		this.DEFAULT_PER_PAGE 	= 50;
		this.DEFAULT_PAGE 		= 1;

		/**
		* functio to get list of groups against a query, from date, to date
		* @param {Object} with search query, from_date, to_date
		* @return {Promise} - After resolving it will return the list of groups
		*/
		this.getGroupList = function(params){
			var deferred = $q.defer(),
				//url = '/ui/show?format=json&json_input=groups/groups.json';
				url = '/api/groups/search';

			var data = {
				'q'			: params.query,
				'from_date'	: params.from_date,
				'to_date'	: params.to_date,
				'per_page' 	: params.per_page,
				'page'  	: params.page
			};

			rvBaseWebSrvV2.getJSON(url, data).then(
				function(data){
					deferred.resolve(data);
				},
				function(errorMessage){
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		* function to get business date
		* @return {Promise} - After resolving it will return the business date
		*/
		this.fetchHotelBusinessDate = function(){
			var deferred = $q.defer(),
				url = '/api/business_dates/active';

			rvBaseWebSrvV2.getJSON(url).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage){
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

	}]);