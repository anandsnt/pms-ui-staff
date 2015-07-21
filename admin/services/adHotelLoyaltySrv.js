admin.service('ADHotelLoyaltySrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
   /**
    * To fetch the list of hotel loyalty
    * @return {object} hotel loyalty list json
    */
	this.fetch = function(){

		var deferred = $q.defer();
		var url = '/admin/hotel/list_hlps.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To save new hotel loyalty
    * @param {array} data of the new hotel loyalty
    * @return {object} status and new id of new hotel loyalty
    */
	this.saveHotelLoyalty = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel/save_hlp';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To get the details of the selected hotel loyalty
    * @param {array} selected hotel loyalty id
    * @return {object} selected hotel loyalty details
    */
	this.getHotelLoyaltyDetails = function(data){
		var deferred = $q.defer();
		var id = data.id;
		var url = '/admin/hotel/edit_hlp/'+id+'.json';

		ADBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To update hotel loyalty data
    * @param {array} data of the modified hotel loyalty
    * @return {object} status of updated hotel loyalty
    */
	this.updateHotelLoyalty = function(data){

		var deferred = $q.defer();
		var url = '/admin/hotel/update_hlp/';

		ADBaseWebSrv.putJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
   /*
    * To delete the seleceted hotel loyalty
    * @param {int} id of the selected hotel loyalty
    * @return {object} status of delete
    */
	this.activateInactivate = function(data){
		var deferred = $q.defer();
		var url = '/admin/hotel/toggle_hlp_activation/';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});
		return deferred.promise;
	};
	/**
	 *   A post method to update Frequent Flyer Program for a hotel
	 *   @param {Object} data for the Frequent Flyer Program List details.
	 */
	this.switchMainToggle = function(data) {
		var deferred = $q.defer();
		var url = '/admin/hotel/use_hlp/';

		ADBaseWebSrv.postJSON(url, data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);