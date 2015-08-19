admin.service('ADPromotionsSrv', ['$q', 'ADBaseWebSrvV2',
	function($q, ADBaseWebSrvV2) {
		var self = this,
			TZIDate = tzIndependentDate,
			ratePromos = {};

		/**
		 *   A getter method to return the promotions list
		 */
		self.fetch = function() {
			var deferred = $q.defer();
			var url = '/api/promotions';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.getActiveRates = function() {
			var deferred = $q.defer();
			var url = '/api/rates?is_active=true';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.getPromoDataModel = function() {
			return {
				name: '',
				from_date: null,
				to_date: null,
				is_active: true,
				discount: {
					value: 0,
					type: 'percent'
				},
				linked_rates: []
			};
		};

		self.shouldShowRate = function(rate, promoFrom, promoTo) {
			if (!promoFrom && !promoTo) { //Show all rates in case promotion does not have a date range
				return true;
			}
			var valid = false;
			_.each(rate.date_ranges, function(dateRange) {
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

		self.togglePromotions = function(status) {
			var deferred = $q.defer();
			var url = '/api/promotions/use_promotions';
			ADBaseWebSrvV2.postJSON(url, status).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.save = function(promo) {
			var deferred = $q.defer();
			var url = '/api/promotions';
			ADBaseWebSrvV2.postJSON(url, promo).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.update = function(promo) {
			var deferred = $q.defer();
			var url = '/api/promotions/' + promo.id;
			ADBaseWebSrvV2.putJSON(url, promo).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.delete = function(promo) {
			var deferred = $q.defer();
			var url = '/api/promotions/' + promo.id;
			ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.fetchRatePromos = function(id) {
			var deferred = $q.defer();
			var url = '/api/rates/' + id + '/promotions';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				ratePromos = {};
				ratePromos.promotion_rates = data.promotion_rates;
				self.appendPromotions(deferred);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.appendPromotions = function(deferred) {
			var url = '/api/promotions';
			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				ratePromos.promotions = data.promotions;
				deferred.resolve(ratePromos);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		self.updateRatePromos = function(params) {
			var deferred = $q.defer();
			var url = '/api/rates/' + params.id + '/set_promotions';
			ADBaseWebSrvV2.putJSON(url, params.promos).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};
	}
]);