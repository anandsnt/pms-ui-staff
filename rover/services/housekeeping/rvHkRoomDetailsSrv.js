sntRover.service('RVHkRoomDetailsSrv', [
	'$http',
	'$q',
	'rvBaseWebSrvV2',
	'$window',
	function($http, $q, rvBaseWebSrvV2, $window) {

		this.fetch = function(id){
			var deferred = $q.defer();
			var url = '/house/room/' + id + '.json';

			$http.get(url).success(function(response, status) {
				if(response.status == "success"){
			    	deferred.resolve(response.data);
			    }else{
			    	deferred.reject(response);
			    }

			}).error(function(response, status) {
				if(status == 401){ // 401- Unauthorized
					// so lets redirect to login page
					$window.location.href = '/house/logout' ;
				}else{
					deferred.reject(response);
				}
			});
			return deferred.promise;
		};

		this.updateHKStatus = function(roomNo, hkStatusId){
			var deferred = $q.defer();
			var url = '/house/change_house_keeping_status.json';
			var postData = {'hkstatus_id' : hkStatusId, 'room_no': roomNo}

			$http({
	            url: url,
	            method: "POST",
	            data: postData,
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
		var roomServiceStatusList = [];
		this.fetchRoomServiceStatusList = function() {
			var deferred = $q.defer(),
				url = 'api/room_services/status_list';

			if ( roomServiceStatusList.length ) {
				deferred.resolve(roomServiceStatusList);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						roomServiceStatusList = data.results;
						deferred.resolve(roomServiceStatusList);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

			return deferred.promise;
		};

		// maintenance reasons (will be cached)
		var maintenanceReasonsList = [];
		this.fetchMaintenanceReasonsList = function() {
			var deferred = $q.defer(),
				url = 'api/maintenance_reasons';

			if ( maintenanceReasonsList.length ) {
				deferred.resolve(maintenanceReasonsList);
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						maintenanceReasonsList = data.maintenance_reasons;
						deferred.resolve(maintenanceReasonsList);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			};

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
	}
]);
