sntRover.service('rvAvailabilitySrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2){
	
	var that = this;

	/**
	* function to fetch availability between from date & to date
	*/
	this.fetchAvailabilityDetails = function(params){
		var firstDate 	= tzIndependentDate(params.from_date);
		var secondDate 	= tzIndependentDate(params.to_date);
		
		var dataForWebservice = {
			from_date	: firstDate,
			to_date		: secondDate
		};

		//Webservice calling section
		var deferred = $q.defer();
		var url = 'api/availability';
		rvBaseWebSrvV2.getJSON(url, dataForWebservice).then(function(data) {

			    deferred.resolve(data);
		},function(data){
			    deferred.reject(data);
		});	
		return deferred.promise;
	};

	this.fetchHouseStatusDetails = function(params){

		//Webservice calling section
		var deferred = $q.defer();
		var url = '/api/availability/house';
		var url = '/ui/show?format=json&json_input=availability/house_status.json';
		rvBaseWebSrvV2.getJSON(url, params).then(function(data) {
			    deferred.resolve(data);
		},function(data){
			    deferred.reject(data);
		});	
		return deferred.promise;

	};

}]);