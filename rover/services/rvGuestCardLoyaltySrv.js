sntRover.service('RVGuestCardLoyaltySrv',['$q', 'RVBaseWebSrv', function($q, RVBaseWebSrv){

	this.loyalties = {};
	var that =this;
	var hlps = {};
    var ffps = {};

	this.fetchLoyalties = function(param){
		var deferred = $q.defer();
 		var user_id = param.userID;
 		
		this.fetchUserMemberships = function(){
			var url =  	'/staff/user_memberships.json?user_id='+ user_id;
			RVBaseWebSrv.getJSON(url).then(function(data) {
				that.loyalties.userMemberships =  data;
				deferred.resolve(that.loyalties);
			},function(data){
				deferred.reject(data);
			});

		}


		this.fetchHotelLoyalties = function(param){
			var url =  '/staff/user_memberships/get_available_hlps.json';
			RVBaseWebSrv.getJSON(url).then(function(data) {
				hlps                            =  data;
				that.loyalties.hotelLoyaltyData =  data;
				this.fetchUserMemberships();
			},function(data){
				deferred.reject(data);
			});
			return deferred.promise;
	    };

	    if(isEmpty(hlps) || isEmpty(ffps)){
	    	var url =  '/staff/user_memberships/get_available_ffps.json';
			RVBaseWebSrv.getJSON(url).then(function(data) {
				ffps                                =  data;
				that.loyalties.freaquentLoyaltyData =  data;
				this.fetchHotelLoyalties();
			},function(data){
				deferred.reject(data);
			});
	    }else{
	    	that.loyalties.freaquentLoyaltyData = ffps;
	    	that.loyalties.hotelLoyaltyData     = hlps;
	    	this.fetchUserMemberships();
	    };			
		return deferred.promise;

	};

	this.createLoyalties = function(params){
		var deferred = $q.defer();
		var url =  '/staff/user_memberships';
		RVBaseWebSrv.postJSON(url, params).then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;

	};
	this.deleteLoyalty = function(id){
		var deferred = $q.defer();
		var url =  '/staff/user_memberships/'+ id + '.json';
		RVBaseWebSrv.deleteJSON(url, "").then(function(data) {
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};



}]);