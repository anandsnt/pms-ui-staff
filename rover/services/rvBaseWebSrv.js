//To fix the issue with csrf token in ajax requests
sntRover.config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  var m = document.getElementsByTagName('meta');
  for (var i in m) {
    if (m[i].name == 'csrf-token') {
	  $httpProvider.defaults.headers.common['X-CSRF-Token'] = m[i].content;
	  break;
	}
  }
});


sntRover.service('RVBaseWebSrv',['$http', '$q', '$window', function($http, $q, $window){

    /**
    *   A http requester method for calling webservice
    *   @param {function} function of the method to call like $http.get, $http.put..
    *   @param {string} webservice url
    *   @param {Object} data for webservice
    *   @return {promise}
    */	

	this.callWebService = function(httpMethod, url, params){
		var deferred = $q.defer();
		if(typeof params == "undefined"){
			params = "";
		}

		var httpDict = {};
 		httpDict.url = url;
 		httpDict.method = httpMethod;
 		if(httpMethod == 'GET' || httpMethod == 'DELETE'){
 			httpDict.params = params;
 		}
 		else if(httpMethod == 'POST' || httpMethod == 'PUT'){
 			httpDict.data = params;
  		};

		//Sample params {params:{fname: "fname", lname: "lname"}}
		$http(httpDict).success(function(response, status) {
			if(response.status == "success"){
		    	deferred.resolve(response.data);
			}else{
				// please note the type of error expecting is array
		    	deferred.reject(response.errors);
			}
		}).error(function(response, status) {
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status == 406){ // 406- Network error
				deferred.reject(response.errors);
			}
			else if(status == 500){ // 500- Internal Server Error

				deferred.reject(['Internal server error occured']);
			}
			else if(status == 404){ // 500- Internal Server Error
				deferred.reject(['Sorry, Requested page not found. [404]']);
			}			
			else if(status == 401){ // 401- Unauthorized
				console.log('lets redirect');
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}else{
				deferred.reject(response.errors);
			}
		    
		});
		return deferred.promise;	    	
	};

   	this.getJSON = function(url, params){	
    	return this.callWebService("GET", url, params);
   	};
    
   	this.putJSON = function(url, params){
   		return this.callWebService("PUT", url, params);
   	};
    
   	this.postJSON = function(url, params){
   		return this.callWebService("POST", url, params);
   	};
    
   	this.deleteJSON = function(url, params){
   		return this.callWebService("DELETE", url, params);
   	};

}]);