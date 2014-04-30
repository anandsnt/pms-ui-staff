sntRover.service('RVReservationCardSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   /**
    * To fetch the list of users
    * @return {object} users list json
    */
	this.fetch = function(){
		
		var deferred = $q.defer();
		// var url = '/staff/staycards/staycard.json?confirmation=4844947&id=5470';
		var url = 'api/reservations/56.json';

		RVBaseWebSrv.getJSON(url).then(function(data) {
		    deferred.resolve(data);
		},function(data){
		    deferred.reject(data);
		});	
		return deferred.promise;
	};
	
	var reservationDetails = {};
	this.confirmationNumbersArray = [];
	var that= this;
	this.emptyConfirmationNumbers = function(){
		that.confirmationNumbersArray = [];
		reservationDetails = {};
	};
	this.storeConfirmationNumbers  = function (confirmationNumber) {
		that.confirmationNumbersArray.push(confirmationNumber);
	  
	};
	this.fetchReservationDetails = function(confirmationNumber){
	
	var isConfirmationNumberAlreadyCalled = false;
	angular.forEach(that.confirmationNumbersArray, function(value, key){

		if(value === confirmationNumber )
		  isConfirmationNumberAlreadyCalled = true;
     });
	
	
		
		var deferred = $q.defer();

		if(!isConfirmationNumberAlreadyCalled){
			that.storeConfirmationNumbers(confirmationNumber);
			// var url = '/staff/staycards/staycard.json?confirmation=4844947&id=5470';
			var url = '/staff/staycards/reservation_details.json?reservation='+confirmationNumber;
	
			RVBaseWebSrv.getJSON(url).then(function(data) {
				reservationDetails[confirmationNumber] = data;
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		} else {
			deferred.resolve(reservationDetails[confirmationNumber]);
		}
		
		return deferred.promise;
	};

   
}]);