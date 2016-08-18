admin.service('ADNotificationsListSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/**
    *   A getter method to return the hotel list
    */
	
	this.fetch = function(){
		var deferred = $q.defer();
		var url = 'ui/show?json_input=serviceprovider/userslist.json&format=json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteNotification = function(data){
		var deferred = $q.defer();
		var url = '/admin/users/'+data.id;
		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {			
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;

	};
}]);