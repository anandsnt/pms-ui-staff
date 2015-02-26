/**
* Service used to deal with various permissions in rover app
*/

sntRover.service('rvPermissionSrv',
	['$http', '$q', 'rvBaseWebSrvV2', 
		function($http, $q, rvBaseWebSrvV2) {
	
	//variable for storing the permissions, will be a dictionary (object)
	var roverPermissions = null;

	/**
	* method to fetch permissions
	* will assign the permissions to 'roverPermissions'
	*/
	this.fetchRoverPermissions = function() {
		var deferred = $q.defer(),
			url = '/ui/show?format=json&json_input=permissions/permission.json';
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			roverPermissions = data;		
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});	
	};

	/**
	* method exposed for others to check permissions
	*/
	this.
});