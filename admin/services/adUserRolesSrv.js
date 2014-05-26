admin.service('ADUserRolesSrv',['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){
   /**
    * To fetch the list of user roles
    * @return {object} users list json
    */
	this.fetchUserRoles = function(){
		
		var deferred = $q.defer();
		var url = '/admin/roles.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
 //   /*
 //    * To save new department
 //    * @param {array} data of the new department
 //    * @return {object} status and new id of new department
 //    */
	// this.saveDepartment = function(data){
	// 	var deferred = $q.defer();
	// 	var url = '/admin/departments';	

	// 	ADBaseWebSrv.postJSON(url, data).then(function(data) {
	// 	    deferred.resolve(data);
	// 	},function(data){
	// 	    deferred.reject(data);
	// 	});	
	// 	return deferred.promise;
	// };

}]);