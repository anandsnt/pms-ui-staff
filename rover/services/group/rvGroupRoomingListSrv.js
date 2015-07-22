sntRover.service('rvGroupRoomingListSrv', ['$q', 'rvBaseWebSrvV2', 'rvUtilSrv',
	function($q, rvBaseWebSrvV2, util) {

		//some default values
		this.DEFAULT_PER_PAGE = 50;
		this.DEFAULT_PAGE = 1;

		/**
		 * to add number of reservations agianst a room type & group
		 * @return {Promise} [will get the reservation list]
		 */
		this.addReservations = function(params) {
			var deferred = $q.defer(),
				group_id = params.id,
				url = '/api/group_reservations/',
				//url = '/ui/show?format=json&json_input=groups/create_reservations.json',
				params = {
					"group_id": params.group_id,
					"reservations_data": {
						"room_type_id": params.room_type_id,
						"from_date": params.from_date,
						"to_date": params.to_date,
						"occupancy": params.occupancy,
						"no_of_reservations": params.no_of_reservations
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

		/**
		 * to get the reservations agianst a group
		 * @return {Promise} [will get the reservation list]
		 */
		this.fetchReservations = function(params) {
			var deferred = $q.defer(),

				group_id = params.group_id,
				url = '/api/group_reservations/' + group_id + "/list";
			//url = '/ui/show?format=json&json_input=groups/create_reservations.json';

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
		 * function to perform mass checkin
		 * @return {Promise}
		 */
		this.performMassCheckin = function(params) {
			var deferred = $q.defer(),
			    group_id = params.id,
			    url = '/api/group_checkins/',
			    params = {
			        "group_id": params.group_id,
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
		 * function to perform auto room assignment
		 * @return {Promise}
		 */
		this.performAutoRoomAssignment = function(params) {
			var deferred = $q.defer(),
			    group_id = params.id,
			    //url = '/api/auto_room_assign/',
			    url = '/ui/show?format=json&json_input=groups/group_auto_room_assignment.json',
			    params = {
			        "group_id": params.group_id,
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
		 * Function to get Room type configured against group
		 * @return {Promise} [will get the details]
		 */
		this.getRoomTypesConfiguredAgainstGroup = function(params) {
			var deferred = $q.defer(),
				group_id = params.id,
				url = 'api/group_rooms/' + group_id;
			//url = '/ui/show?format=json&json_input=groups/group_room_types_and_rates.json';

			rvBaseWebSrvV2.getJSON(url).then(
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
		 * Function to check if default charge routing is present or not
		 * @return {Promise} [will get the details]
		 */
		this.checkDefaultChargeRoutings = function(params) {
			var deferred = $q.defer(),
				group_id = params.id,
				url = '/api/groups/' + group_id + '/check_default_charge_routings';

			rvBaseWebSrvV2.getJSON(url).then(
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
		 * Function to attach BillingInfo to Reservations
		 * @return {Promise} [will get the details]
		 */
		this.attachBillingInfoToReservations = function(params) {
			var deferred = $q.defer(),
				url = '/api/default_account_routings/attach_reservation';

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

		this.emailInvoice = function(data) {
			var deferred = $q.defer(),
				url = '/api/group_reservations/email_rooming_list';
			rvBaseWebSrvV2.postJSON(url, data)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data) {
					deferred.reject(data);
				});
			return deferred.promise;
		}

		this.fetchRegistrationCardPrintData = function(params) {
			var deferred = $q.defer();
			var url = '/api/reservations/' + params.group_id + '/batch_print_registration_cards';
			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				deferred.resolve(data);
			}, function(data) {
				deferred.reject(data);
			});

			return deferred.promise;
		};


	}
]);
