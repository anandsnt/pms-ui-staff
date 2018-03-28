admin.controller('ADStationaryCtrl',
	['$scope',
	'ADStationarySrv',
	'ngTableParams',
	'availableGuestLanguages',
	'availableHoldStatus',
	'$filter',
	function($scope, ADStationarySrv, ngTableParams, availableGuestLanguages, availableHoldStatus, $filter) {

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";
	$scope.location_image_file = $scope.fileName;
	$scope.hotel_logo_file = $scope.fileName;
	$scope.memento = {
		hotel_picture: "",
		location_image: ""
	};

	$scope.is_general_active = false;
	$scope.is_confirmations_active = false;
	$scope.is_registration_active = false;
	$scope.is_invoices_active = false;
	$scope.is_account_receivables_active = false;

	$scope.is_ar_invoice_active = false;
	$scope.is_ar_statment_active = false;

	$scope.is_guest_confirmation_active = false;
	$scope.is_confirmation_email_active = false;
	$scope.is_confirmation_letter_active = false;
	$scope.is_hotel_direction_active = false;
	$scope.is_location_active = false;
	$scope.is_app_active = false;
	$scope.is_social_network_active = false;
	$scope.is_guest_cancellation_active = false;
	$scope.is_group_confirmation_active = false;

	$scope.is_salutations_active = false;
	$scope.is_hotel_picture_active = false;
	$scope.is_terms_and_conditions_active = false;

	$scope.is_guest_invoice_active = false;
	$scope.is_guest_confirmation_active = false;
	$scope.is_company_ta_active = false;
	$scope.is_account_invoice_active = false;
	$scope.is_pro_forma_invoice_active = false;
	$scope.is_guest_confirmation_active = false;
	$scope.is_guest_confirmation_active = false;

	$scope.stationery_data = {};

	var showErrorMessage = $scope.$on('SHOW_ERROR_MSG', function (evt, data) {
		$scope.errorMessage = data.error;
	});
	var fetchTermsAndConditions = function(openMenu) {
		var options = {
			params: {
				'locale': $scope.data.locale
			},
			onSuccess: function(response) {
				$scope.customTnCs = response.terms_and_conditions;
				// option with empty value will not trigger ng-change, so adding dummy option
				$scope.customTnCs.unshift({
					'id': 'none',
					'title': $filter('translate')('NONE')
				});
				$scope.screenList = response.screens;
				angular.forEach($scope.screenList, function(value) {
					value.assigned_t_and_c_id = _.isNull(value.assigned_t_and_c_id) ? 'none' : value.assigned_t_and_c_id;
				});
				$scope.is_terms_and_conditions_active = openMenu ? true : $scope.is_terms_and_conditions_active;
			}
		};

		$scope.callAPI(ADStationarySrv.fetchTermsAndConditions, options);
	};
	/*
	* Fetches the stationary items
	*/
	var fetchStationary = function(params) {
		var successCallbackOfFetch = function(data) {
			$scope.$emit('hideLoader');
			fetchTermsAndConditions();
			data.email_logo_type = data.email_logo_type || '';
			$scope.data = {};

			$scope.memento.hotel_picture = data.hotel_picture;
			$scope.memento.location_image = data.location_image;

			$scope.socialNetworks = [];
			_.each(data.available_social_network_types, function(social) {
				$scope.socialNetworks.push({
					value: social,
					name: social
				});
			});
			
			$scope.data = data;	
			$scope.data.locale = $scope.locale;		
			$scope.data.groupholdstatus = data.group_hold_status_data[0].hold_status_id;
			$scope.showConfirmationHeaderFooterBasedOnHoldStatus();
			$scope.itemList = new ngTableParams({
				page: 1, // show first page
				count: $scope.data.social_network_links.length, // count per page - Need to change when on pagination implemntation
				sorting: {
					name: 'asc' // initial sorting
				}
			});
			$scope.data.default_guest_bill = !$scope.data.default_guest_bill ? "" : $scope.data.default_guest_bill;
			$scope.data.default_account_bill = !$scope.data.default_account_bill ? "" : $scope.data.default_account_bill;

			$scope.hotelTemplateLogoPrefetched = data.location_image;
		};

		$scope.invokeApi(ADStationarySrv.fetch, params, successCallbackOfFetch);
	};

	$scope.init = function() {
		// Rename keys to avoid more changes in multiple places
		// and to make our select box data set consisntent to use
		// value and description
		var locales = [];
        
		angular.forEach(availableGuestLanguages.languages, function(availableLanguage) {
			availableLanguage.value = availableLanguage.code;
			delete availableLanguage.code;
			availableLanguage.description = availableLanguage.language;
			delete availableLanguage.language;
			if (availableLanguage.is_show_on_guest_card) {
				locales.push(availableLanguage);
			}
		});
		availableGuestLanguages.locales = locales;
		delete availableGuestLanguages.languages;

		$scope.languages = availableGuestLanguages;
		$scope.holdStatusList = availableHoldStatus.data.hold_status;
		$scope.locale = $scope.languages.selected_language_code;
		var params = {};

		fetchStationary(params);
	};

	$scope.init();

	$scope.toggleShowHotelAddress = function() {
		$scope.data.show_hotel_address = !$scope.data.show_hotel_address;
	};
	/*
	 * success call back of details web service call
	 */
	var successCallbackOfSaveDetails = function(data) {
		$scope.$emit('hideLoader');
		$scope.errorMessage = '';
		$scope.goBackToPreviousState();
	};
	// Save changes button actions.

	$scope.clickedSave = function() {

		var filterKeys = ["guest_bill_template", "hotel_logo", "groupholdstatus", "group_confirmation_header", "group_confirmation_footer"];

		if ($scope.data.hotel_picture === $scope.memento.hotel_picture) {
			filterKeys.push('hotel_picture');
		}
		if ($scope.data.location_image === $scope.memento.location_image) {
			filterKeys.push('location_image');
		}
		// CICO-26524
		$scope.data.group_hold_status_data = [];
		if (!!$scope.data.groupholdstatus) {
			var groupConfirmationData = {};

			groupConfirmationData.hold_status_id = $scope.data.groupholdstatus;
			groupConfirmationData.confirmation_email_header = $scope.data.group_confirmation_header;
			groupConfirmationData.confirmation_email_footer = $scope.data.group_confirmation_footer;
			$scope.data.group_hold_status_data.push(groupConfirmationData);
		}
		var postingData = dclone($scope.data, filterKeys);
		// calling the save api

		if ($scope.hotelTemplateLogoPrefetched === postingData.location_image) {
			postingData.location_image = "";
		}
		// postingData.locale = $scope.locale;


		$scope.invokeApi(ADStationarySrv.saveStationary, postingData, successCallbackOfSaveDetails);
	};

	// CICO-17706 : While Cancellation Email is Turned OFF , Print Cancellation Email also forced to OFF.
	$scope.$watch('data.send_cancellation_letter', function(newValue, oldValue) {
		if (!newValue) {
	   		$scope.data.print_cancellation_letter = false;
		}
	});

	/**
	 *   To watch location image
	 */
	$scope.$watch(function() {
		return $scope.data.location_image;
	}, function(location_image) {
		if (location_image === 'false') {
			$scope.fileName = "Choose File....";
		}
		$scope.location_image_file = $scope.fileName;
	});

	/**
	 *   To watch hotel logo
	 */
	$scope.$watch(function() {
		return $scope.data.hotel_picture;
	}, function(logo) {
		if (logo === 'false') {
			$scope.fileName = "Choose File....";
		}
		$scope.hotel_logo_file = $scope.fileName;
	});

	/**
	 *   To handle show hide status for the logo delete button
	 */
	$scope.isLogoAvailable = function(logo) {
		if (logo !== '' && logo !== 'false') {
			return true;
		}
		else {
			return false;
		}
	};

	$scope.onEditSocialLink = function(link, index) {
		$scope.editStoreLink = angular.copy(link);
		$scope.currentSocialLink = index;
	};
	$scope.onCancelEditLink = function(index) {
		$scope.data.social_network_links[index] = $scope.editStoreLink;
		$scope.currentSocialLink = false;
	};

	$scope.onCancelAddLink = function() {
		$scope.currentSocialLink = false;
	};

	$scope.onAddNewSocialLink = function() {
		$scope.newSocialLinkData = {
			type: '',
			link: ''
		};
		$scope.currentSocialLink = 'NEW';		
	};

	$scope.onPushNewLink = function() {
		$scope.data.social_network_links.push($scope.newSocialLinkData);
		$scope.currentSocialLink = false;
	};

	$scope.onRemoveLink = function(link) {
		$scope.data.social_network_links = _.without($scope.data.social_network_links, link);
	};

	$scope.onUpdateSocialLink = function() {
		$scope.currentSocialLink = false;
	};

	$scope.isLinkAvailable = function(index) {
		if ( $scope.currentSocialLink == 'NEW') {
			return _.pluck($scope.data.social_network_links, "type").indexOf($scope.socialNetworks[index].name) == -1; 
		} else {
			return _.pluck($scope.data.social_network_links, "type").indexOf($scope.socialNetworks[index].name) == -1 || $scope.data.social_network_links[$scope.currentSocialLink].type == $scope.socialNetworks[index].name;
		}
	};

	/*
	* Get invoked when the locale is changed
	*/
	$scope.onLocaleChange = function() {
		var params = {};

		params.locale = $scope.data.locale;
		$scope.locale = $scope.data.locale;
		fetchStationary(params);
	};

	$scope.showConfirmationHeaderFooterBasedOnHoldStatus = function() {
		// If not set for any status - then empty
		$scope.data.group_confirmation_header = "";
		$scope.data.group_confirmation_footer = "";
		angular.forEach($scope.data.group_hold_status_data, function(value, key) {

	     	if (value.hold_status_id == $scope.data.groupholdstatus) {
	     		$scope.data.group_confirmation_header = value.confirmation_email_header;
		        $scope.data.group_confirmation_footer = value.confirmation_email_footer;
	     	}
	    });
	};

	$scope.fetchTermsAndConditions = function() {
		// if the menu is opened, close the menu
		if ($scope.is_terms_and_conditions_active) {
			$scope.is_terms_and_conditions_active = false;
		} else {
			var openMenu = true;

			fetchTermsAndConditions(openMenu);
		}

	};

	$scope.$on('$destroy', showErrorMessage);

}]);
