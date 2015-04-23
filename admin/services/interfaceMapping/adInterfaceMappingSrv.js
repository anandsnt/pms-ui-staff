admin.service('ADInterfaceMappingSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {
    /*
    * Service function to fetch the mapping list
    * @return {object} mapping list
    */ 
        
	this.fetchExternalMappingList = function(data) {
            var hotelId = data.hotel_id, interfaceId = data.interface_type_id;
		 hotelId = 41;//debugging
		var deferred = $q.defer();
		var url = "/admin/external_mappings/" + hotelId + "/list_mappings.json";
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.fetchInterfaceMappingsList = function(data) {
            console.log('fetching interface mappings!!!!><><><><><');
            var hotelId = data.hotel_id, 
                    interfaceId = data.interface_type_id;
		 hotelId = 41;//debugging
                 console.log('doing defer...');
		var deferred = $q.defer();
                console.log('done with defer');
		var url = "/admin/external_mappings/"+hotelId+"/interface_mappings.json?hotel_id="+hotelId+"&interface_type_id="+interfaceId;
                console.log('@ url: '+url);
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	/*
    * Service function to render add mapping screen
    * @return {object} mapping type,snt values to render its dropdowns
    */
	this.fetchAddMapping = function(data){
            var hotelId = data.hotel_id, interfaceId = data.interface_type_id;
		var deferred = $q.defer();
		var url = "/admin/external_mappings/"+hotelId+"/interface_mappings.json?hotel_id="+hotelId+"&interface_type_id="+interfaceId;
		
		ADBaseWebSrv.postJSON(url).then(function(data) {
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
		var url = '/admin/interface_mappings/'+data.editId+'/edit_mapping.json';
		
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
            //interface_id will be a property in the data file
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
        /*
         * toggle mapping interface on/off
         */
        
	this.switchToggle = function(data){

		var deferred = $q.defer();
		var url = '/admin/interface_mappings/'+data.value+'/update_active';//placeholder
		
		ADBaseWebSrv.deleteJSON(url,data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
