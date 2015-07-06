admin.service('ADUserRolesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   

	this.userRolesData  = {};
	var that = this;

   /**
    * To fetch the list of user roles
    * @return {object} users list json
    */
	this.fetchUserRoles = function(){
		
		var deferred = $q.defer();

		var fetchUserRolesData = function(){
			var url = '/api/roles.json';

			ADBaseWebSrvV2.getJSON(url).then(function(data) {
				that.userRolesData.userRoles = data.user_roles;
			    deferred.resolve(that.userRolesData);
			},function(data){
			    deferred.reject(data);
			});
			return deferred.promise;
		};

		var url = 'api/reference_values.json?type=dashboard';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		   that.userRolesData.dashboards = data;
		   fetchUserRolesData();
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To save new user Role
    * @param {array} new user role details
    *
    */
	this.saveUserRole = function(data){
		var deferred = $q.defer();
		var url = '/admin/roles';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};

  /*
    * To assign dashboard
    * @param {array} dashboard
    *
    */
	this.assignDashboard = function(data){
	
		var deferred = $q.defer();
		var url ='api/roles/'+data.value;
		var updateData = {"dashboard_id":data.dashboard_id}

		ADBaseWebSrvV2.putJSON(url, updateData).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};


}]);