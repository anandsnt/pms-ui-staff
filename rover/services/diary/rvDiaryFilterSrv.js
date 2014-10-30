sntRover
.service('rvDiaryFilterSrv', ['$q', 'BaseWebSrvV2',
	function($q, RVBaseWebSrv) {
		this.fetchCompanyCard = function(data){
	        var deferred = $q.defer(),
	        	url =  '/api/accounts';

	        RVBaseWebSrv.getJSON(url, data)
	        .then(function(data) {
	            deferred.resolve(data);
	        },function(data){
	            deferred.reject(data);
	        });

	        return deferred.promise;
	    };

	    this.fetchRoomTypes = function() {
			var url = 'api/room_types?exclude_pseudo=true&exclude_suite=true',
				deferred = $q.defer();

			RVBaseWebSrv.getJSON(url)
			.then(function(data) {
				deferred.resolve(data.results);
			}, function(data) {
				deferred.reject(data);
			});
			
			return deferred.promise;
		};

	   	this.fetchArrivalTimes = function(base_interval) {
	    	var times = [], 
	    		day_min = 24 * 60,
	    		deferred = $q.defer(),
	    		min;
	
			for(var i = 0; i < day_min; i += base_interval) {
				min = i % 60;
				times.push(parseInt(i / 60) + ':' + (min === 0 ? '00' : min));
			}
			
			deferred.resolve(times);

			return deferred.promise;
	   	};
	}
]);