angular.module('sntRover').service('RVCCAuthorizationSrv', ['$http', '$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', '$rootScope',
	function($http, $q, RVBaseWebSrv, rvBaseWebSrvV2, $rootScope) {

        var service = this;

		/**
		* functio to get list bill specific credit card info for Authorization
		* @param {Object} - contain reservation id
		* @return {Promise} - After resolving it will return the list cards.
		*/
		this.fetchCreditCardAuthInfo = function(param) {
			var deferred = $q.defer();
			var url = '/staff/reservation/' + param.reservation_id + '/credit_card_auth_info';

			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

		/**
		* functio to perform creditcard Authorization
		* @param {Object} - contain payment_method_id, auth_amount.
		* @return {Promise} - After resolving it will return promis.
		*/
		this.manualAuthorization = function(param) {
			var deferred = $q.defer();
			var url = '/api/cc/authorize';

			rvBaseWebSrvV2.postJSON(url, param).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};


		/**
		* Performs the release of already authorized ones
		* @param {Object} - contain payment_method_id.
		* @return {Promise} - After resolving it will return promise.
		*/
		this.releaseAuthorization = function(param) {
			var deferred = $q.defer();
			var url = '/api/cc/reverse';

			rvBaseWebSrvV2.postJSON(url, param).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});
			return deferred.promise;
		};

        /**
         * expects sample response
         * {
         *  "authorize_cc_at_checkin":true,
         *  "is_cc_authorize_at_checkin_enabled":true,
         *  "is_cc_authorize_for_incidentals_active":true,
         *  "is_routing_present":true,
         *  "pre_auth_amount_at_checkin":156.94,
         *  "pre_auth_amount_for_incidentals":100.0,
         *  "pre_auth_amount_for_zest_station":100.0,
         *  }
         * @param {string|number} reservationId reservation id
         * @return {*|promise|{then, catch, finally}|e} promise of response
         */
    service.fetchPendingAuthorizations = function (reservationId) {
        var deferred = $q.defer();
        var url = '/api/reservations/' + reservationId + '/pre_auth';

        rvBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);
