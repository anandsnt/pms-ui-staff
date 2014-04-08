	admin.service('adCheckoutSrv',['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv){
	   /*
	    * To fetch checkout
	    * @return {object} checkin details
	    */	
		this.fetch = function(){
			var deferred = $q.defer();
			var url = '/admin/get_checkout_settings.json';	
			
			ADBaseWebSrv.getJSON(url).then(function(data) {
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		};

		 /*
	    * To save checkout
	    * 
	    */	
		this.save = function(data){
			var deferred = $q.defer();
			var url = '/admin/save_checkout_settings';	
			
			ADBaseWebSrv.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		};

			 /*
	    * To retrive checkout email list 
	    * 
	    */	
		this.fetchEmailList = function(data){
			var deferred = $q.defer();
			var url = '/admin/get_due_out_guests.json';
				
			
			ADBaseWebSrv.getJSON(url,data).then(function(data) {
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		};


		/*
		 * To retrive checkout email list 
	    * 
	    */	
		this.sendMail = function(data){
			var deferred = $q.defer();
			var url = '/admin/send_checkout_alert';
				
			
			ADBaseWebSrv.postJSON(url,data).then(function(data) {
				deferred.resolve(data);
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
		};
		

	}]);