admin.service('ADICareServicesSrv', ['$http', '$q', 'ADBaseWebSrvV2',
function($http, $q, ADBaseWebSrvV2) {
	/**
    * To fetch the details of icare services
    * @return {object} icare service details
    */
	this.getIcareServices = function(){
		
		var deferred = $q.defer();
		var url = '/api/hotel_settings/icare.json';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			
			//console.log(data.charge_codes);
			
			var cargeCodes = [];
			
			// Initial loading data to SNT VALUES dropdown.
			angular.forEach(data.charge_codes,function(item, index) {
	       		var obj = {"value": item.id, "name": item.description };
	       		cargeCodes.push(obj);
       		});
			data.charge_codes = [];
			data.charge_codes = cargeCodes;
			//console.log(data);
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
   /*
    * To save icare services details
    * @return {object} details of icare services
    */
	this.saveIcareServices = function(data){
		var deferred = $q.defer();
		var url = '/api/hotel_settings/change_settings';

		ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
}]);