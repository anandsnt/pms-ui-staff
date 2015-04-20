sntRover.service('rvGroupRoomingListSrv', 
	['$q', 'rvBaseWebSrvV2', 'rvUtilSrv', 
	function($q, rvBaseWebSrvV2, util) {

		//some default values
		this.DEFAULT_PER_PAGE 	= 50;
		this.DEFAULT_PAGE 		= 1;

		/**
		 * to add number of reservations agianst a room type & group
		 * @return {Promise} [will get the reservation list]
		 */
		this.addReservations = function(params){
			var deferred = $q.defer(),
				group_id = params.id,
				url = '/api/group_reservations/',
				//url = '/ui/show?format=json&json_input=groups/create_reservations.json',
				params = {
				    "group_id": params.group_id,
				    "reservations_data": 
				    {
				        "room_type_id": params.room_type_id,
				        "from_date"	: params.from_date,
				        "to_date"	: params.to_date,
				        "occupancy"	: params.occupancy,
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
		this.fetchReservations = function(params){
			var deferred = $q.defer(),
				group_id = params.id,
				url = '/api/group_reservations/' + group_id;
				//url = '/ui/show?format=json&json_input=groups/create_reservations.json';
			
			var data = {
				'per_page' 	: params.per_page,
				'page'  	: params.page,
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
	}]);