admin.service('ADItemSrv',['$q', 'ADBaseWebSrv', function($q, ADBaseWebSrv){
   
   /*
	* service class for item related operations
	*/

   /*
    * getter method to fetch item list
    * @return {object} room list
    */
	this.fetchItemList = function(){
		var deferred = $q.defer();
		var url = '/admin/items/get_items.json';
		
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
		var url =  "/admin/items/" + id + "/delete_item";
		
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
	this.toggleFavourite = function(data){
		var postData = {'id': data.item_id, 'set_active': data.toggle_status};
		var deferred = $q.defer();
		var url =  "/admin/items/toggle_favorite";
		
		ADBaseWebSrv.postJSON(url, postData).then(function(data) {
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
		var url = "/admin/items/" + id + "/edit_item.json";
		var deferred = $q.defer();
		ADBaseWebSrv.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	/*
	* method to get item details
	*/
	this.addItemDetails = function(){
		var url = "/admin/items/new_item.json";
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
		var url = "/admin/items/save_item";
		var deferred = $q.defer();
		ADBaseWebSrv.postJSON(url, itemDetails).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	}
  
}]);