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
	}
]);