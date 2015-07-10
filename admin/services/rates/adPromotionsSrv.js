admin.service('ADPromotionsSrv', ['$http', '$q', 'ADBaseWebSrvV2',
	function ($http, $q, ADBaseWebSrvV2) {
		var self = this,
			TZIDate = tzIndependentDate;

		/**
		 *   A getter method to return the promotions list
		 */
		self.fetch = function () {
			var deferred = $q.defer();
			var url = '/api/segments';
			ADBaseWebSrvV2.getJSON(url).then(function (data) {
				deferred.resolve([{
					id: 1,
					name: 'Aadi Sale',
					from_date: null,
					to_date: null,
					is_active: true,
					discount: {
						value: 5,
						type: 'AMOUNT'
					},
					linked_rates: [1572, 1616]
				}, {
					id: 2,
					name: 'Onam Offers',
					from_date: '2017-01-01',
					to_date: '2018-01-01',
					is_active: true,
					discount: {
						value: 50,
						type: 'PERCENTAGE'
					},
					linked_rates: []
				}]);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.getActiveRates = function () {
			var deferred = $q.defer();
			var url = '/api/rates?is_active=true';
			ADBaseWebSrvV2.getJSON(url).then(function (data) {
				deferred.resolve(data);
			}, function (data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.getPromoDataModel = function () {
			return {
				name: '',
				from_date: null,
				to_date: null,
				is_active: true,
				discount: {
					value: 0,
					type: 'AMOUNT'
				},
				linked_rates: []
			};
		};

		self.shouldShowRate = function (rate, promoFrom, promoTo) {
			if (!promoFrom && !promoTo) { //Show all rates in case promotion does not have a date range
				return true;
			}
			var valid = false;
			_.each(rate.date_ranges, function (dateRange) {
				if (!valid) {
					var rateBegin = dateRange.begin_date,
						rateEnd = dateRange.end_date;
					if (!!promoFrom && !!promoTo) { //in case promo has a date range
						valid = new TZIDate(promoFrom) <= new TZIDate(rateEnd) &&
							new TZIDate(promoTo) >= new TZIDate(rateBegin);
					} else if (!!promoFrom) { // case where promo has only from_date
						//promoFrom should be on or before rateEnd
						valid = new TZIDate(promoFrom) <= new TZIDate(rateEnd);
					} else { //case where promo has only to_date
						//promoTo should be on or after the rateBegin
						valid = new TZIDate(promoTo) >= new TZIDate(rateBegin);
					}
				}
			});
			return valid;
		};

	}
]);