sntRover
.service('rvDiaryFilterSrv', ['$q', 'BaseWebSrvV2',
	function($q, RVBaseWebSrv) {
		this.arrival_times = [];

		this.fetchArrivalTimes = function(base_interval) { 
	    	var times = [], 
	    		day_min = 24 * 60,
	    		deferred = $q.defer(),
	    		min, cur_time; 
	
			for(var i = 0; i < day_min; i += base_interval) {
				min = i % 60;
				cur_time = parseInt(i / 60) + ':' + (min === 0 ? '00' : min);

				times.push(cur_time);
			}
			
			this.arrival_times = Array.prototype.slice.call(times);

			deferred.resolve(this.arrival_times);

			return deferred.promise;
	   	};

	   	this.fetchRates = function() {
	   		var q = $q.defer(),
	   			url = '/api/rates';

	   		RVBaseWebSrv.getJSON(url)
	   		.then(function(data) {
	   			q.resolve(data);
	   		}, function(data) {
	   			q.reject(data);
	   		});

	   		return q.promise;
	   	};

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
	}
]);