sntRover.service('rvAllotmentReservationsListSrv', ['$q', 'rvBaseWebSrvV2', 'rvUtilSrv',
	function($q, rvBaseWebSrvV2, util) {
		
		//some default values
		this.DEFAULT_PER_PAGE = 50;
		this.DEFAULT_PAGE = 1;
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
		 * function to perform auto room assignment
		 * @return {Promise}
		 */
		this.performAutoRoomAssignment = function(params) {
			var deferred = $q.defer(),
				allotment_id = params.id,
				url = '/api/allotments/' + allotment_id + 'auto_room_assignment',
				params = {
					"reservation_ids": params.reservation_ids
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

		this.removeReservation = function(data) {
			var deferred = $q.defer(),
				url = 'api/group_reservations/' + data.id + '/cancel';
			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		};

		/**
		 * to send reservation list to some email
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		this.emailInvoice = function(data) {
			var deferred = $q.defer(),
				url = '/api/allotments/email_rooming_list';
			
			rvBaseWebSrvV2.postJSON(url, data).then(
				function(data) {
					deferred.resolve(data);
				}.bind(this), 
				function(data) {
					deferred.reject(data);
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
					no_of_reservations: params.no_of_reservations,
					is_from_allotment: true
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