admin.service('ADEmvTerminalsSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
   
   /*
	* service class for item related operations
	*/

   /*
    * getter method to fetch item list
    * @return {object} room list
    */	
	this.fetchItemList = function(){
		var deferred = $q.defer();
		var url = '/api/emv_terminals';	
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};


   /*
    * method to delete item
    * @param {integer} clicked item's id
    */	
	this.deleteItem = function(data){
		var id = data.item_id;
		var deferred = $q.defer();
		var url =  "/api/emv_terminals/" + id ;
		
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to get item details
	* @param {integer} item id
	*/
	this.getItemDetails = function(data){
		var id = data.item_id;
		var url =  "/api/emv_terminals/" + id ;
		var deferred = $q.defer();
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/* method to save the item details
	* @param {object} details of item
	*/
	this.saveItemDetails = function(itemDetails){
		var url = "/api/emv_terminals";
		var deferred = $q.defer();
		ADBaseWebSrv.postJSON(url, itemDetails).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}
  
}]);