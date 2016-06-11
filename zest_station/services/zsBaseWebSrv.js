//To fix the issue with csrf token in ajax requests
sntZestStation.config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  var m = document.getElementsByTagName('meta');
  for (var i in m) {
    if (m[i].name === 'csrf-token') {
	  $httpProvider.defaults.headers.common['X-CSRF-Token'] = m[i].content;
	  break;
	}
  }
});


sntZestStation.service('zsBaseWebSrv',['$http', '$q', '$window', function($http, $q, $window,$rootScope){

    /**
    *   A http requester method for calling webservice
    *   @param {function} function of the method to call like $http.get, $http.put..
    *   @param {string} webservice url
    *   @param {Object} data for webservice
    *   @return {promise}
    */
	this.callWebService = function(httpMethod, url, params, data){
		var deferred = $q.defer();
		if(typeof params === "undefined"){
			params = "";
		}

		//Sample params {params:{fname: "fname", lname: "lname"}}
		var httpDict = {};
 		httpDict.url = url;
 		httpDict.method = httpMethod;
 		if(httpMethod === 'GET' || httpMethod === 'DELETE'){
 			httpDict.params = params;
 		}
 		else if(httpMethod === 'POST' || httpMethod === 'PUT'){
 			httpDict.data = params;
 			if(typeof $rootScope.workstation_id !== 'undefined') {
				httpDict.data.workstation_id = $rootScope.workstation_id;
			}
  		};

		$http(httpDict).success(function(response, status) {
	    	deferred.resolve(response);
		}).error(function(errors, status) {
			var urlStart = url.split('?')[0];
			// please note the type of error expecting is array
			// so form error as array if you modifying it
			if(status === 406){ // 406- Network error
				deferred.reject(errors);
			} else if(status === 422){ // 422
				deferred.reject(errors);
			}
			else if(status === 500){ // 500- Internal Server Error
				deferred.reject(['Internal server error occured']);
			}else if(status === 501 || status === 502 || status === 503){ // 500- Internal Server Error
				$window.location.href = '/500' ;
			}
			else if(status === 401){ // 401- Unauthorized
				// so lets redirect to login page
				$window.location.href = '/logout' ;
			}

			//set of custom error emssage range http status
			else if(status >= 470 && status <= 490) {
				errors.httpStatus = status;
				errors.errorMessage = errors;
				deferred.reject (errors);
			}

			else{
				deferred.reject(errors);
			}

		});
		return deferred.promise;
	};

   	this.getJSON = function(url, params) {
    	return this.callWebService("GET", url, params);
   	};

   	this.putJSON = function(url, params) {
   		return this.callWebService("PUT", url, params);
   	};

   	this.postJSON = function(url, data) {
   		return this.callWebService("POST", url, data);
   	};

   	this.deleteJSON = function(url, params) {
   		return this.callWebService("DELETE", url, params);
   	};

}]);