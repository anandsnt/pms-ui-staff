sntRover.service('RVReservationCardSrv',['$http', '$q', 'RVBaseWebSrv', function($http, $q, RVBaseWebSrv){
   
	this.reservationData = {};
	var that =this;

   /**
    * To fetch the list of users
    * @return {object} users list json
    */
	this.fetch = function(reservationId){
		
		var deferred = $q.defer();
				
		var fetchCountryList =  function(data){
			var url = 'api/countries.json';
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.reservationData.countries = data;
			   	 deferred.resolve(that.reservationData);
			},function(data){
			    deferred.reject(data);
			});	

		};

		var url = 'api/reservations/'+reservationId+'.json';
		RVBaseWebSrv.getJSON(url).then(function(data) {
			that.reservationData = data;
		   	fetchCountryList();
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
	this.updateResrvationForConfirmationNumber = function(confirmationNumber, reservationData){
		reservationDetails[confirmationNumber] = reservationData;
	};
	this.guestData  = "";
	this.setGuestData = function(data){
		this.guestData = data;
	};
	this.getGuestData = function(){
		return this.guestData;
	};

	this.fetchGuestcardData = function(param){
		var deferred = $q.defer();
		var url = '/staff/guestcard/show.json';
		RVBaseWebSrv.getJSON(url,param).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
	};


   this.tokenize = function(data){
   		var deferred = $q.defer();
		var url = '/staff/payments/tokenize';
		RVBaseWebSrv.postJSON(url,data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
   };

   this.saveReservationNote = function(data){
   		var deferred = $q.defer();
		var url = '/reservation_notes';
		RVBaseWebSrv.postJSON(url,data).then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
   };
   this.deleteReservationNote = function(reservationID){
   		var deferred = $q.defer();
		var url = '/reservation_notes/' + reservationID;
		RVBaseWebSrv.deleteJSON(url,"").then(function(data) {
			    deferred.resolve(data);
			},function(data){
			    deferred.reject(data);
			});	
		return deferred.promise;
   };
   
}]);