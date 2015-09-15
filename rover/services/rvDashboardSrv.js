sntRover.service('RVDashboardSrv',['$q', 'RVBaseWebSrv', 'rvBaseWebSrvV2', function( $q, RVBaseWebSrv, rvBaseWebSrvV2){


    var that = this;
    var userDetails = {}; //varibale to keep header_info.json's output
    this.dashBoardDetails = {};
    this.getUserDetails = function(){
        return userDetails;
    };
 	/*
  	* To fetch user details
  	* @return {object} user details
  	*/
	this.fetchUserInfo = function(){
            var kioskParams = '';
            if (localStorage['kioskUser']){
                kioskParams = localStorage['kioskUser'];
            }
		var deferred = $q.defer();
		var url =  '/api/rover_header_info.json'+kioskParams;
		RVBaseWebSrv.getJSON(url).then(function(data) {
                    
		var fetchUserRolesData = function(){
			var url = '/api/roles.json'+kioskParams;

			rvBaseWebSrvV2.getJSON(url).then(function(data) {
				userDetails.userRoles = data.user_roles;
			    deferred.resolve(userDetails.userRolesData);
                            
                            
			},function(data){
			    deferred.reject(data);
			});
			return deferred.promise;
		};
                
                
                
		userDetails = data;
                fetchUserRolesData();//needed to detect kiosk role until included in userRoleDetails (future sprint)
                
			deferred.resolve(data);
		},function(data){
			deferred.reject(data);
		});
		return deferred.promise;
	};
        
        
        this.getUserRole = function(id, $scope){
            var deferred = $q.defer();
            var url = '/admin/users/'+id+'/edit.json';
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                var roles = [], role, roleId;
                userDetails.hasKioskRole = false;
                if (userDetails.userRoles){
                    if (userDetails.userRoles.length > 0){
                        for (var i in userDetails.userRoles){
                            roleId = userDetails.userRoles[i].value;
                            for (var x in data.user_roles){
                                role = data.user_roles[x];
                                if (roleId == role){
                                    roles.push({'name': userDetails.userRoles[i].name, 'id':userDetails.userRoles[i].value});
                                    if (userDetails.userRoles[i].name === 'Kiosk'){
                                        userDetails.hasKioskRole = true;
                                    }
                                }
                            }
                        }
                    }
                }
                
                userDetails.roles = roles;
                
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;
        };

 	this.fetchDashboardStatisticData = function(){
	    var deferred = $q.defer();

		var url = '/api/dashboards';
		rvBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};
   /*
    * To fetch dashboard details
    * @return {object} dashboard details
    */
   	this.fetchDashboardDetails = function(){
		var deferred = $q.defer();
		that.fetchDashboardStatisticData()
	    .then(function(data){
	        that.dashBoardDetails.dashboardStatistics = data;
	        deferred.resolve(that.dashBoardDetails);
	    }, function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

	this.fetchHotelDetails = function(){
            var kioskParams = '';
            if (localStorage['kioskUser']){
                kioskParams = localStorage['kioskUser'];
            }
		var deferred = $q.defer();
		var url = '/api/hotel_settings.json'+kioskParams;
		RVBaseWebSrvV2.getJSON(url).then(function(data) {
			deferred.resolve(data);
		},function(errorMessage){
			deferred.reject(errorMessage);
		});
		return deferred.promise;
	};

}]);