admin.service('ADUserRolePermissionSrv',['$q', 'ADBaseWebSrvV2',
	function($q, ADBaseWebSrvV2){
   /*
	* service class for Permission related operations
	*/
	var that = this;

   /*
    * getter method to fetch Permission list
    * @return {object} Permission list
    */
	this.fetchUserRolePermission = function(params){
		var deferred = $q.defer();
		var url = '/admin/roles_permissions';
		ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});

		return deferred.promise;
	};
	this.addedUserRolePermission = function(params){
		var deferred = $q.defer();
		var url = '/admin/roles_permissions/add_permission';
		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});

		return deferred.promise;
	};
	this.removeUserRolePermission = function(params){
		var deferred = $q.defer();
		var url = '/admin/roles_permissions/remove_permission';
		ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});

		return deferred.promise;
	};
}]);