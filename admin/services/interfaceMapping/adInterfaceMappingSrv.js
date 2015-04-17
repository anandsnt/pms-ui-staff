admin.service('ADInterfaceMappingSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {
    /*
    * Service function to fetch the mapping list
    * @return {object} mapping list
    */ 
	this.fetchMappingList = function(data) {
		
		var deferred = $q.defer();
		var url = "/admin/interface_mappings/" + data.id + "/list_mappings.json";
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
        this.fetchSubMenu = function(menu_name){
		var deferred = $q.defer();
		var url = '/admin/settings/menu_items.json';	
		
		var fetchSuccess = function(data){
                    console.log(data);
			deferred.resolve(data);
		};
		var fetchFailed = function(data){
			deferred.reject(data);
		};
		
		ADBaseWebSrv.getJSON(url).then(fetchSuccess, fetchFailed);
		return deferred.promise;
	};
	/*
    * Service function to render add mapping screen
    * @return {object} mapping type,snt values to render its dropdowns
    */
	this.fetchAddMapping = function(data){

		var deferred = $q.defer();
		var url = '/admin/interface_mappings/'+data.hotelId+'/new_mappings.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to render edit mapping screen
    * @return {object} mapping type,snt values to render its dropdowns.
    */
	this.fetchEditMapping = function(data){

		var deferred = $q.defer();
		var url = '/admin/interface_mappings/'+data.editId+'/edit_mapping.json'
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to update mapping
    * @return {object} status of update
    */
	this.saveMapping = function(data){

		var deferred = $q.defer();
		var url = '/admin/interface_mappings/save_mapping';
		
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to delete mapping
    * @return {object} status of deletion
    */
	this.deleteMapping = function(data){

		var deferred = $q.defer();
		var url = '/admin/interface_mappings/'+data.value+'/delete_mapping';
		
		ADBaseWebSrv.deleteJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
