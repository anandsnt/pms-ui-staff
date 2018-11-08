sntGuestWeb.service('sntGuestWebSrv', ['$q', '$http', '$rootScope', '$ocLazyLoad', function($q, $http, $rootScope, $ocLazyLoad) {

	var jsMappingList = {},
		cssMappingList = {},
		templateMappingList = {},
		cms_screen_details = [],
		that = this;
		
	this.addon_screen_text_details = [];
		

	var extarctAddonScreenTextDetails = function  (response) {
		that.addon_screen_text_details = _.find(response.screen_list, function(cms_item) {
			return cms_item.screen_name === "ADDONS";
		});
		that.addon_screen_text_details = _.isUndefined(that.addon_screen_text_details) ? [] : that.addon_screen_text_details;
	};

	this.extractAddonScreenDetails = function(screen_identifier) {
		return extractScreenDetails(screen_identifier, that.addon_screen_text_details);
	};

	this.fetchScreenWiseData = function(hotel_identifier) {
		var deferred = $q.defer();
		var url = '/api/hotels/custom_cms_messages.json?application=ZEST_WEB&hotel_identifier=' + hotel_identifier;

		$http.get(url).success(function(response) {
				extarctAddonScreenTextDetails(response);
				that.cms_screen_details = _.find(response.screen_list, function(cms_item) {
					return cms_item.screen_name === "ECI SCREENS";
				});
				that.cms_screen_details = typeof that.cms_screen_details !== 'undefined' ? that.cms_screen_details : [];
				deferred.resolve(response);
			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	// call CMS details only for checkin URLs now
	var absUrl = window.location.href;

	if (absUrl.indexOf("checkin") !== -1) {
		// to strip away state URLS
		absUrl = (absUrl.indexOf("#") !== -1) ? absUrl.substring(0, absUrl.indexOf("#")) : absUrl;
		var urlComponents = absUrl.split('/');


		var hotel_identifier = urlComponents[urlComponents.length - 2];

		that.fetchScreenWiseData(hotel_identifier);
	}

	this.extractScreenDetails = function(screen_identifier) {
		return extractScreenDetails(screen_identifier, that.cms_screen_details);
	};

	this.fetchHotelDetailsFromUrl = function(url) {
		var deferred = $q.defer();

		$http.get(url).success(function(response) {
				if (response.status === "success") {
					deferred.resolve(response.data);
				} else {
					// when some thing is broken , need to redirect to error page with default theme
					response.data.hotel_theme = "guestweb";
					response.data.error_occured = true;
					deferred.resolve(response.data);
				}

			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	this.fetchHotelDetailsOnExtCheckoutUrl = function() {
		var deferred = $q.defer();
		var url = "/ui/show?json_input=opt_dashboard/checkout_row_nyc.json&format=json";

		$http.get(url).success(function(response) {
				deferred.resolve(response);
			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	this.fetchHotelDetailsOnExtCheckinUrl = function() {
		var deferred = $q.defer();
		var url = "ui/show?json_input=opt_dashboard/checkout_row_nyc.json&format=json";

		$http.get(url).success(function(response) {
				deferred.resolve(response);
			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	this.fetchJsHotelThemeList = function() {
		var deferred = $q.defer();
		var url = "/assets/asset_list/____generatedThemeMappings/____generatedGuestweb/js/____generatedGuestWebJsThemeMappings.json";

		$http.get(url).success(function(response) {
				jsMappingList = response;
				deferred.resolve(response);
			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	this.fetchCSSHotelThemeList = function() {
		var deferred = $q.defer();
		var url = "/assets/asset_list/____generatedThemeMappings/____generatedGuestweb/css/____generatedGuestWebCSSThemeMappings.json";

		$http.get(url).success(function(response) {
				cssMappingList = response;
				deferred.resolve(response);
			})
			.error(function() {
				deferred.reject();
			});
		return deferred.promise;
	};

	this.fetchTemplateHotelThemeList = function() {
		var deferred = $q.defer();
		var url = "/assets/asset_list/____generatedThemeMappings/____generatedGuestweb/template/____generatedGuestWebTemplateThemeMappings.json";

		$http.get(url).success(function(response) {
				templateMappingList = response;
				deferred.resolve(response);
			})
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
			var jsFile = jsMappingList[key] || jsMappingList['guestweb_common_js_files'];
            
			return $ocLazyLoad.load({
				insertBefore: '.main-container',
				serie: true,
				files: jsFile
			}).then(function() {
				if (typeof modules_to_inject !== "undefined") {
					$ocLazyLoad.inject(modules_to_inject);
				}
			});
		} else {
			console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			return;
		}
	};

	/**
	 * [fetchTemplateAssets description]
	 * @param  {[type]} key               [description]
	 * @param  {[type]} modules_to_inject [description]
	 * @return {[type]}                   [description]
	 */
	this.fetchTemplateAssets = function(key, modules_to_inject) {
		if (!!templateMappingList) {
			var themeFile = templateMappingList[key] || templateMappingList['guestweb_common_templates'];
			
			return $ocLazyLoad.load({
				insertBefore: '.main-container',
				reconfig: true,
				serie: true,
				files: themeFile
			}).then(function() {
				if (typeof modules_to_inject !== "undefined") {
					$ocLazyLoad.inject(modules_to_inject);
				}
			});
		} else {
			console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			return;
		}
	};

	/**
	 * [fetchcsssAssets description]
	 * @param  {[type]} key               [description]
	 * @param  {[type]} modules_to_inject [description]
	 * @return {[type]}                   [description]
	 */
	this.fetchCSSAssets = function(key, modules_to_inject) {
		if (!!cssMappingList) {
			return $ocLazyLoad.load({
				insertBefore: '.main-container',
				serie: true,
				files: cssMappingList[key] || cssMappingList['guestweb_snt']
			}).then(function() {
				if (typeof modules_to_inject !== "undefined") {
					$ocLazyLoad.inject(modules_to_inject);
				}
			});
		} else {
			console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
			return;
		}
	};


}]);
