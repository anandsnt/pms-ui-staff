admin.service('ADEmvTerminalsSrv',['$q', 'ADBaseWebSrv','ADBaseWebSrvV2', function($q, ADBaseWebSrv, ADBaseWebSrvV2){

   /*
	* service class for emv terminal related operations
	*/

   /*
    * getter method to fetch emv terminal list
    * @return {object} room list
    */
	this.fetchItemList = function(){
		var deferred = $q.defer();
		var url = '/api/emv_terminals';

		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   /*
    * method to delete emv terminal
    * @param {integer} clicked emv terminal's id
    */
	this.deleteItem = function(data){
		var id = data.item_id;
		var deferred = $q.defer();
		var url =  "/api/emv_terminals/" + id ;

		ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to get emv terminal details
	* @param {integer} emv terminal id
	*/
	this.getItemDetails = function(data){
		var id = data.item_id;
		var url =  "/api/emv_terminals/" + id ;
		var deferred = $q.defer();
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/* method to save the emv terminal details
	* @param {object} details of emv terminal
	*/
	this.saveItemDetails = function(itemDetails){
		var url = "/api/emv_terminals";
		var deferred = $q.defer();
		ADBaseWebSrvV2.postJSON(url, itemDetails).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}

	/* method to update the emv terminal details
	* @param {object} details of emv terminal
	*/
	this.updateItemDetails = function(data){
		var url = "/api/emv_terminals/"+data.id;
		var deferred = $q.defer();
		ADBaseWebSrvV2.putJSON(url, data).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}

}]);