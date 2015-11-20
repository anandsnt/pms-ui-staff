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
	this.getActionsManagerTasksList = function(data){
            var deferred = $q.defer();
            var url = "/api/action_tasks?associated_type=Reservation";

            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
	};
	this.syncActionCount = function(id){
            var deferred = $q.defer();
            var url = "/api/action_tasks/sync_with_external_pms?reservation_id="+id;

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
        
        
        var self = this;
	self.searchPerPage = 50;
	self.page = 1;
	self.to_date = "";

	this.fetchGuestInfo = function(dataToSend){
		var deferred = $q.defer();

                if (dataToSend){
                    dataToSend.fakeDataToAvoidCache = new Date();
                }
		self.toDate = self.toDate === undefined ? "" : self.toDate;
		var url =  'search.json?per_page=' + self.searchPerPage
		+ '&page=' + self.page;

		
			BaseWebSrvV2.getJSON(url, dataToSend).then(function(data) {
                            var results = data.data.results;
                            if (dataToSend.query){
                                var first, last, room;
                                var str = dataToSend.query.toLowerCase();
                                var visible = 0;
                                for (var i in data.data.results){
                                    data.data.results[i].is_row_visible = false;
                                    if (data.data.results[i].firstname){
                                        first = data.data.results[i].firstname.toLowerCase();
                                        if (first.indexOf(str) !== -1){
                                            data.data.results[i].is_row_visible = true;
                                            visible++;
                                        }
                                    }
                                    if (data.data.results[i].lastname){
                                        last = data.data.results[i].lastname.toLowerCase();
                                        if (last.indexOf(str) !== -1){
                                            data.data.results[i].is_row_visible = true;
                                            visible++;
                                        } 
                                    }
                                    if (data.data.results[i].room){
                                        room = data.data.results[i].room.toLowerCase();
                                        if (room.indexOf(str) !== -1){
                                            data.data.results[i].is_row_visible = true;
                                            visible++;
                                        } 
                                    }
                                }
                            }
                               data.queryTime = dataToSend.queryTime;
                               data.visibleRowCount = visible;
                               data.querySent = dataToSend.query;
				//self.searchTypeStatus = dataToSend.status;
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
		

		return deferred.promise;
	};




}]);
