sntRover.service('RVHkRoomDetailsSrv', [
	'$http',
	'$q',
	'rvBaseWebSrvV2',
	'$window',
	function($http, $q, rvBaseWebSrvV2, $window) {

		this.roomDetails = {};

		this.fetch = function(id, businessDate){
			var deferred = $q.defer();
			var url = '/house/room/' + id + '.json';

			$http.get(url).success(function(response, status) {
				if(response.status == "success"){
					this.roomDetails = response.data.room_details;
			    	deferred.resolve(this.roomDetails);
			    }else{
			    	deferred.reject(response);
			    }

			}.bind(this)).error(function(response, status) {
				if(status == 401){ // 401- Unauthorized
					// so lets redirect to login page
					$window.location.href = '/house/logout' ;
				}else{
					deferred.reject(response);
				}
			});
			return deferred.promise;
		};

		this.updateHKStatus = function(data){
			var deferred = $q.defer();
			var url = '/house/change_house_keeping_status.json';

			$http({
	            url: url,
	            method: "POST",
	            data: data,
	        }).success(function (response, status) {
				if(response.status == "success"){
	        		deferred.resolve(response.data);
	        	}else{
	        		deferred.reject(response);
	        	}
	        }).error(function (response, status) {
			    if(status == 401){ // 401- Unauthorized
	    			// so lets redirect to login page
					$window.location.href = '/house/logout' ;
	    		}else{
	    			deferred.reject(response);
	    		}
	        });
			return deferred.promise;
		};




		/* NOTE: using the new API structure */

		// room service status list (will be cached)
		var allServiceStatus = [];
		this.fetchAllServiceStatus = function() {
			var deferred = $q.defer(),
				url = 'api/room_services/status_list';

			if ( allServiceStatus.length ) {
				deferred.resolve(allServiceStatus);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						allServiceStatus = data.results;
						deferred.resolve(allServiceStatus);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// maintenance reasons (will be cached)
		var maintenanceReasons = [];
		this.fetchMaintenanceReasons = function() {
			var deferred = $q.defer(),
				url = 'api/maintenance_reasons';

			if ( maintenanceReasons.length ) {
				deferred.resolve(maintenanceReasons);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						maintenanceReasons = data.maintenance_reasons;
						deferred.resolve(maintenanceReasons);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// fetch oo/os details from server
		this.getRoomServiceStatus = function(params) {
			var deferred = $q.defer(),
				url = 'api/room_services/' + params.roomId;

			rvBaseWebSrvV2.getJSON(url)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});
			
			return deferred.promise;
		};

		// save oo/os to server
		this.postRoomServiceStatus = function(params) {
			var deferred = $q.defer(),
				url = 'api/room_services';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};

		// save the room back to in sevice
		this.putRoomInService = function(params) {
			var deferred = $q.defer(),
				url = 'api/room_services/' + params.roomId,
				options = {
					"room_service_status_id" : params.inServiceID
				}

			rvBaseWebSrvV2.putJSON(url, options)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};

		// get all all WorkTypes
		var workTypesList = [];
		this.getWorkTypes = function() {
			var deferred = $q.defer(),
				url = 'api/work_types';

			if ( workTypesList.length ) {
				deferred.resolve(workTypesList);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						workTypesList = data.results;
						deferred.resolve(workTypesList);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};


		// room work time fetch record api
		this.postRecordTime = function(params) {
			var deferred = $q.defer(),
				url = '/api/work_assignments/record_time';

			rvBaseWebSrvV2.postJSON(url, params)
				.then(function(data) {
					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);