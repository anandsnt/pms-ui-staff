admin.service('ADRatesRangeSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {


	var dateRangeIDs = [];
	this.getDateRangeIds = function(){
		return dateRangeIDs;
	};
  
   /*
    * Service function to save date range
    * @params {object} data
    */

	this.postDateRange = function(dateRangeData) {
		
		var data = dateRangeData.data;
		var id   = dateRangeData.id;
		var deferred = $q.defer();

		var url = "/api/rates/"+id+"/rate_date_ranges";
		ADBaseWebSrvV2.postJSON(url,data).then(function(data) {
			dateRangeIDs.push(data.id);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
