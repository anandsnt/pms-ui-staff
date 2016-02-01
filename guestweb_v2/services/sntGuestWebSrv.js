	sntGuestWeb.service('sntGuestWebSrv', ['$q','$http','$rootScope', '$ocLazyLoad', function($q,$http,$rootScope, $ocLazyLoad) {

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


		/**
		 * [fetchJsAssets description]
		 * @param  {[type]} key               [description]
		 * @param  {[type]} modules_to_inject [description]
		 * @return {[type]}                   [description]
		 */
		this.fetchJsAssets = function(key, modules_to_inject) {
			if (!!jsMappingList) {
			  return $ocLazyLoad.load({ insertBefore: '.main-container', serie: true, files: jsMappingList[key] }).then(function() {
			    if (typeof modules_to_inject !== "undefined") {
			     $ocLazyLoad.inject(modules_to_inject);
			    }
			  });
			} else {
			  console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			  return;
			};
		};

		/**
		 * [fetchTemplateAssets description]
		 * @param  {[type]} key               [description]
		 * @param  {[type]} modules_to_inject [description]
		 * @return {[type]}                   [description]
		 */
		this.fetchTemplateAssets = function(key, modules_to_inject) {
			if (!!templateMappingList) {
			  return $ocLazyLoad.load({ insertBefore: '.main-container', reconfig: true, serie: true, files: templateMappingList[key] }).then(function() {
			    if (typeof modules_to_inject !== "undefined") {
			     $ocLazyLoad.inject(modules_to_inject);
			    }
			  });
			} else {
			  console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			  return;
			};
		};

		/**
		 * [fetchcsssAssets description]
		 * @param  {[type]} key               [description]
		 * @param  {[type]} modules_to_inject [description]
		 * @return {[type]}                   [description]
		 */
		this.fetchCSSAssets = function(key, modules_to_inject) {
			if (!!cssMappingList) {
			  return $ocLazyLoad.load({ insertBefore: '.main-container', serie: true, files: cssMappingList[key] }).then(function() {
			    if (typeof modules_to_inject !== "undefined") {
			     $ocLazyLoad.inject(modules_to_inject);
			    }
			  });
			} else {
			  console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			  return;
			};
		};


	}
	]);