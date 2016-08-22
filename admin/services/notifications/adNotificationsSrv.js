admin.service('ADNotificationsListSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

	/**
    *   A getter method to return the hotel list
    */
	
	this.fetch = function(){
		var deferred = $q.defer();
		var url =  "/api/staff_notifications"
		//var url = 'ui/show?json_input=serviceprovider/userslist.json&format=json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.fetchNotification = function(notificationId){
		var deferred = $q.defer();
		var url =  "/api/staff_notifications/" + notificationId;
		//var url = 'ui/show?json_input=serviceprovider/userslist.json&format=json';
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

	this.deleteNotification = function(data){
		var deferred = $q.defer();
		var url = '/api/staff_notifications/'+data.id;
		ADBaseWebSrvV2.deleteJSON(url, data).then(function(data) {			
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;

	};
	this.createNotification = function(data){
		var deferred = $q.defer();
		var url = '/api/staff_notifications';
		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	this.updateNotification = function(data){
		var deferred = $q.defer();
		var url = '/api/staff_notifications/'+ data.id;
		ADBaseWebSrvV2.putJSON(url, data.params).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
}]);