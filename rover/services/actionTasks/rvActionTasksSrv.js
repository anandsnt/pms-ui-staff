sntRover.service('rvActionTasksSrv',['$q', 'BaseWebSrvV2', function( $q, BaseWebSrvV2){


	this.getTasksCount = function(data){
            var deferred = $q.defer();
            var url = "/api/reservations/"+data.id+'.json';

            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};
	this.getActionsTasksList = function(data){
            var deferred = $q.defer();
            var url = "/api/action_tasks?associated_id="+data.id+'&associated_type=Reservation';

            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};

	this.savePriceAndRestrictions = function(data){
            var deferred = $q.defer();
            var url = "/api/daily_rates";

            BaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};
        
	this.fetchDepartments = function(){
		var deferred = $q.defer();
		var url = 'admin/departments.json';

		BaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};


}]);
