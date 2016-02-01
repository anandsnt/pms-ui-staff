	sntGuestWeb.service('gwWebSrv', ['$q','$http','$rootScope', 
		function($q,$http,$rootScope) {


		this.screenList = [];
		this.cMSdata    = [];
		var that = this;

		this.fetchHotelDetailsFromUrl = function(url) {
			var deferred = $q.defer();
			$http.get(url).success(function(response) {
				if(response.status === "success"){
					deferred.resolve(response.data);
				}
				else{
					// when some thing is broken , need to redirect to error page with default theme
					response.data.hotel_theme = "guestweb";
					response.data.error_occured  = true;
					deferred.resolve(response.data);
				}
				
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
		};

		/*
		* To fetch screenMappings
		* @return {object} mapping details
		*/
		this.fetchScreenMappings = function(){
			var deferred = $q.defer();
			var url = '/assets/guestweb_v2/mappings/screen_mappings.json';
			$http.get(url).success(function(response) {
				deferred.resolve(response);	
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
			
		};

		/*
		* To fetch CMS data
		* @return {object} CMS details
		*/
		this.fetchScreenFromCMSSetup = function(){
			var deferred = $q.defer();
			var url = '/sample_json/zestweb_v2/screen_list.json';
			$http.get(url).success(function(response) {
				deferred.resolve(response);	
			}.bind(this))
			.error(function() {
				deferred.reject();
			});
			return deferred.promise;
			
		};


		this.setScreenList = function(list){
			that.screenList = list;
		};

		this.setCMSdata   = function(data){
			that.cMSdata = data;
		};

	}
	]);