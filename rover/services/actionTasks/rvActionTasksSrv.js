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

	this.postNewAction = function(params){
            var deferred = $q.defer();
            var url = "/api/action_tasks.json";
            //ie::   reservation_id=1616903&action_task[description]=test

            BaseWebSrvV2.postJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};

	this.updateNewAction = function(params){
            var deferred = $q.defer();
            var url = "/api/action_tasks/"+params.action_task.id+".json";

            BaseWebSrvV2.putJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};
        
	this.completeAction = function(params){
            var deferred = $q.defer();
            var url = "/api/action_tasks/"+params.action_task.id;//+'&is_complete='+params.is_complete;

            BaseWebSrvV2.putJSON(url, params).then(function (data) {
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
