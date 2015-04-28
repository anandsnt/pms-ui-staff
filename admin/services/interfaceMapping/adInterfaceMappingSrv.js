admin.service('ADInterfaceMappingSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {
    /*
    * Service function to fetch the mapping list
    * @return {object} mapping list
    */ 
        
	this.fetchExternalMappingList = function(data) {
            var hotelId = data.hotel_id;
		var deferred = $q.defer();
		var url = "/admin/external_mappings/" + hotelId + "/interface_types.json";
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.fetchInterfaceMappingsList = function(data) {
            var hotelId = data.hotel_id, 
                    interfaceId = data.interface_type_id;
		var deferred = $q.defer();
		var url = "/admin/external_mappings/"+hotelId+"/"+interfaceId +"/interface_mappings.json";
		
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
		var url = "/admin/external_mappings/"+hotelId+"/"+interfaceId +"/new_mappings.json";
		
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
        var hotelId = data.hotel_id, interfaceId = data.interface_type_id, mappingTypeId = data.mapping_type_id;
		var deferred = $q.defer();
		var url = '/admin/external_mappings/'+hotelId+'/'+interfaceId+'/edit_mapping/'+mappingTypeId+'.json';
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
	this.saveEditMapping = function(data){
        var hotelId = data.hotel_id, interfaceId = data.interface_type_id, mappingTypeId = data.mapping_type_id;
		var deferred = $q.defer();
		var url = '/admin/external_mappings/'+hotelId+'/'+interfaceId+'/update_mapping/'+mappingTypeId+'.json';
		console.log('save edit mapping;;');
                console.log(url);
		ADBaseWebSrv.postJSON(url,data).then(function(data) {
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
            var hotelId = data.hotel_id, interfaceId = data.interface_type_id, mappingTypeId = data.mapping_type_id;
            var deferred = $q.defer();
            var url = '/admin/external_mappings/'+hotelId+'/'+interfaceId+'/new_mapping/';

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
    var hotelId = data.hotel_id, interfaceId = data.interface_type_id, mappingTypeId = data.mapping_type_id;
    console.log('del mapping data');
    console.log(data);
		var deferred = $q.defer();
		var url = "/admin/external_mappings/"+hotelId+"/"+interfaceId +"/delete_mapping/"+mappingTypeId+".json";
		
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
            console.log('switch toggled');
                console.log(data);
		var deferred = $q.defer();
		var url = '/admin/ota/update_active/'+data.interface_id+".json";
		console.log('switch toggled');
                console.log(data);
		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};

}]);
