admin.service('ADRatesRangeSrv', ['$q', 'ADBaseWebSrvV2',
function($q, ADBaseWebSrvV2) {


	var dateRangeDataArray = [];
	this.getDateRangeIds = function(){
		return dateRangeIDs;
	};

	this.emptyDateRangeData = function(){
		 dateRangeDataArray = [];
	};

	this.getDateRangeData = function(){
		return dateRangeDataArray;
	};
   /*
    * Service function to save date range
    * @params {object} data
    */

	this.postDateRange = function(dateRangeData) {
	
		var postData = dateRangeData.data;
		var id   = dateRangeData.id;
		var deferred = $q.defer();

		var url = "/api/rates/"+id+"/rate_date_ranges";
		ADBaseWebSrvV2.postJSON(url,postData).then(function(data) {
			var dateData = {};
			dateData.id = data.id;
			dateData.begin_date = dateRangeData.data.begin_date;
			dateData.end_date = dateRangeData.data.end_date;
			dateRangeDataArray.push(dateData);
			deferred.resolve(data);
		}, function(data) {
			deferred.reject(data);
		});
		return deferred.promise;
	};
}]);
