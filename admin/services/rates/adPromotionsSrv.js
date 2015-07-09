admin.service('ADPromotionsSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$rootScope',
	function ($http, $q, ADBaseWebSrvV2, $rootScope) {

		/**
		 *   A getter method to return the promotions list
		 */
		this.fetch = function () {
			var deferred = $q.defer();
			var url = '/api/segments';
			ADBaseWebSrvV2.getJSON(url).then(function (data) {
				deferred.resolve([{
					id:1,
					name: 'Aadi Sale',
					from_date: '2015-01-01',
					to_date: '2016-01-01',
					is_active: true,
					discount:{
						value: 5,
						type: 'AMOUNT'
					},
					linked_rates:[1572,1616]
				},{
					id:2,
					name: 'Onam Offers',
					from_date: '2015-01-01',
					to_date: '2016-01-01',
					is_active: true,
					discount:{
						value: 50,
						type: 'PERCENTAGE'
					},
					linked_rates:[]
				}]);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		this.getPromoDataModel = function(){
			return {					
					name: '',
					from_date: $rootScope.businessDate,
					to_date: $rootScope.businessDate,
					is_active: true,
					discount:{
						value: 0,
						type: 'AMOUNT'
					},
					linked_rates:[]
				};
		}

		/**
		 *   A post method to enable/disable origins
		 */
		this.toggleUsedOrigins = function (data) {
			var deferred = $q.defer();
			var url = '/api/booking_origins/use_origins';
			ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
		/*
		 * Service function to save origins
		 * @return {object} status of update
		 */
		this.save = function (data) {

			var deferred = $q.defer();
			var url = '/api/segments';

			ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
		/*
		 * Service function to update origins.
		 * @return {object} status of update
		 */
		this.update = function (data) {

			var deferred = $q.defer();
			var url = '/api/segments/' + data.value;

			ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
		/*
		 * Service function to delete origin item.
		 * @return {object} status of deletion
		 */
		this.delete = function (data) {
			var deferred = $q.defer();
			var url = '/api/segments/' + data.value;

			ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		this.toggleSegmentsUse = function (data) {
			var deferred = $q.defer();
			var url = '/api/segments/use_segments';
			ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

	}
]);