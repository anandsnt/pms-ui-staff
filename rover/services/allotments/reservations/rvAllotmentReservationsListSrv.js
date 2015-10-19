sntRover.service('rvAllotmentReservationsListSrv', ['$q', 'rvBaseWebSrvV2', 'rvUtilSrv',
	function($q, rvBaseWebSrvV2, util) {

		/**
		 * to get the reservations agianst a group
		 * @return {Promise} [will get the reservation list]
		 */
		this.fetchReservations = function(params) {
			var deferred = $q.defer(),
				allotment_id = params.id,
				url = '/api/allotments/' + allotment_id + "/reservations";

			rvBaseWebSrvV2.getJSON(url, params.payLoad).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};

		/**
		 * Function to get Room type configured against allotment
		 * @return {Promise} [will get the details]
		 */
		this.getRoomTypesConfiguredAgainstGroup = function(params) {
			var deferred = $q.defer(),
				allotment_id = params.id,
				data = _.omit(params, 'id'),
				url = '/api/allotments/' + allotment_id + "/room_types";


			rvBaseWebSrvV2.getJSON(url, data).then(
				function(data) {
					deferred.resolve(data);
				},
				function(errorMessage) {
					deferred.reject(errorMessage);
				}
			);

			return deferred.promise;
		};		
	}
]);