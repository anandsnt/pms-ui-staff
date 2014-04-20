admin.service('ADRatesAddDetailsSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {

   /*
    * Service function to fetch rate types
    * @return {object} rate types
    */
	this.fetchRateTypes = function() {
		var deferred = $q.defer();
		var url = "/api/rate_types/active";
		ADBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
  /*
    * Service function to rates
    * @return {object} rates
    */
	this.fetchBasedOnTypes = function(data) {
		var deferred = $q.defer();
		var url = "/api/rates";
		ADBaseWebSrvV2.getJSON(url,data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
  /*
	* Service function to create new rate
	* @params {object} rates details
	*/
	this.createNewRate = function(data) {
		var deferred = $q.defer();
		var url = "/api/rates";
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
  /*
	* Service function to update new rate
	* @params {object} rates details
	*/
	this.updateNewRate = function(param) {

		var data = param.updatedData;
		var id = param.rateId;

		var deferred = $q.defer();
		var url = "/api/rates/"+param.rateId;

		ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
