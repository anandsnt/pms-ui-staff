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

			var data = {
				'sort_field': params.sorting_field,
				'sort_dir': params.sort_dir,
				'per_page': params.per_page,
				'page': params.page
			};

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

		/**
		 * to add number of reservations agianst a room type & allotment
		 * @return {Promise} [will get the reservation list]
		 */
		this.addReservations = function(params) {
			var deferred = $q.defer(),
				allotment_id = params.id,
				url = '/api/allotments/'+allotment_id+'/reservations';

			var params = {
				reservations_data: {
					room_type_id: params.room_type_id,
					from_date: params.from_date,
					to_date: params.to_date,
					occupancy: params.occupancy,
					no_of_reservations: params.no_of_reservations
				}
			};


			rvBaseWebSrvV2.postJSON(url, params).then(
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