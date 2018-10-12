admin.controller('ADHotelDetailsCtrl', [
							'$rootScope',
							'$scope',
							'ADHotelDetailsSrv',
							'$stateParams',
							'$state',
							'ngDialog',
							function($rootScope, $scope, ADHotelDetailsSrv, $stateParams, $state, ngDialog) {

	$scope.isAdminSnt = false;
	$scope.isEdit = false;
	$scope.id = $stateParams.id;
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.readOnly = "no";
	$scope.fileName = "Choose File....";
	$scope.hotel_logo_file = $scope.fileName;
	$scope.hotel_template_logo_file = $scope.fileName;
	$scope.mli_pem_certificate_file_name = "Choose File....";
	$scope.mli = {
		certificate: ''
	};
	$scope.isHotelChainReadonly =  false;
	$scope.isFieldsReadOnly = (($rootScope.isSntAdmin && $rootScope.isServiceProvider) || $rootScope.adminRole === "hotel-admin") ? "yes" : "no";
	$scope.isFieldsReadOnlyForServiceProvider = ($rootScope.isSntAdmin && $rootScope.isServiceProvider) ? "yes" : "no";
	$scope.isSequenceModChangeDisabled = false;
	$scope.swedenCountryId = '';
	// CICO-41322 - Flag needed to show MP De-selection confirm popup.
	var isMPFlagResetConfirmPopupNeeded = false;

	/*
	 * Method to get country id 
	 */
	var getCountryId = function(countryName) {
		return ( _.find( $scope.data.countries, function(obj) { return obj.name === countryName; } ) ).id;
	};

	// pms start date setting calendar options
	$scope.pmsStartDateOptions = {
	    changeYear: true,
	    changeMonth: true,
	    yearRange: "0:+10",
	    onSelect: function()	 {
	    	ngDialog.close();
	    }
  	};
	if ($rootScope.adminRole === "snt-admin") {
		$scope.isAdminSnt = true;
		if ($stateParams.action === "addfromSetup") {
			$scope.previousStateIsDashBoard = true;
		}
		// SNT Admin -To add new hotel view
		if ($stateParams.action === "add" || $stateParams.action === "addfromSetup") {
			$scope.title = "Add New Hotel";
			// CICO-41322 - No need to show MP De-selection confirm popup.
			isMPFlagResetConfirmPopupNeeded = false;
			var fetchSuccess = function(data) {
				$scope.data = data.data;
				$scope.swedenCountryId = getCountryId($rootScope.infrasecSpecificCountry);
				if ($scope.data.selected_mod_type_id) {
					$scope.isSequenceModChangeDisabled = true;
				}				

				$scope.data.brands = [];
				$scope.data.is_external_references_import_on = false;
				$scope.data.external_references_import_freq = undefined;
				$scope.data.is_hold_room_import_on = false;
				$scope.data.hold_room_import_freq = undefined;
				$scope.languages = data.languages;
				$scope.$emit('hideLoader');
					$scope.data.check_in_primetime = "AM";
					$scope.data.check_out_primetime = "AM";
				$scope.data.hotel_pms_type = "";
				$scope.selectedTheme = data.data.selected_theme;
			};

			$scope.invokeApi(ADHotelDetailsSrv.fetchAddData, {}, fetchSuccess);
		}
		// SNT Admin -To edit existing hotel view
		else if ($stateParams.action === "edit") {
			$scope.isEdit = true;
			$scope.title = "Edit Hotel";
			var fetchSuccess = function(data) {
				$scope.data = data.data;
				$scope.swedenCountryId = getCountryId($rootScope.infrasecSpecificCountry);
				if ($scope.data.selected_mod_type_id) {
					$scope.isSequenceModChangeDisabled = true;
				} 

				$scope.languages = data.languages;
				$scope.$emit('hideLoader');
				if ($scope.data.mli_pem_certificate_loaded) {
					$scope.mli_pem_certificate_file_name = "Certificate Attached";
				}
				if ($scope.data.check_in_time.primetime === "" || typeof $scope.data.check_in_time.primetime === 'undefined') {
					$scope.data.check_in_time.primetime = "AM";
					$scope.data.check_in_primetime = "AM";
				}
				if ($scope.data.check_out_time.primetime === "" || typeof $scope.data.check_out_time.primetime === 'undefined') {
					$scope.data.check_out_time.primetime = "AM";
					$scope.data.check_out_primetime = "AM";
				}
				// CICO-24330 -Make the chain non-editable once its saved
				if (!!$scope.data.hotel_chain) {
					$scope.isHotelChainReadonly = true;
				}

				setDropdownDefaults();
				$scope.selectedTheme = data.data.selected_theme;
				// CICO-41322 - Show MP De-selection confirm popup if it is already a multi-property.
				isMPFlagResetConfirmPopupNeeded = data.data.is_multi_property;
			};

			$scope.invokeApi(ADHotelDetailsSrv.fetchEditData, {'id': $stateParams.id}, fetchSuccess);
		}

	}
	else if ($rootScope.adminRole === "hotel-admin") {
		// Hotel Admin -To Edit current hotel view
		$scope.isEdit = true;
		$scope.title = "Edit Hotel";
		$scope.readOnly = "yes";
		var fetchSuccess = function(data) {
			$scope.data = data;

			if ($scope.data.selected_mod_type_id) {
				$scope.isSequenceModChangeDisabled = true;
			} 
			else { 
				$scope.data.selected_mod_type_id = (_.find($scope.data.mod_types, function (item) { 
																						return item.value === 'MOD10'; 
																					}).id);
			}
			$scope.$emit('hideLoader');
			$scope.hotelLogoPrefetched = data.hotel_logo;
			$scope.hotelTemplateLogoPrefetched = data.hotel_template_logo;
			if ($scope.data.check_in_time.primetime === "" || typeof $scope.data.check_in_time.primetime === 'undefined') {
				$scope.data.check_in_time.primetime = "AM";
				$scope.data.check_in_primetime = "AM";
			}
			if ($scope.data.check_out_time.primetime === "" || typeof $scope.data.check_out_time.primetime === 'undefined') {
				$scope.data.check_out_time.primetime = "AM";
				$scope.data.check_out_primetime = "AM";
			}

			// CICO-24330 -Make the chain non-editable once its saved
			if (!!$scope.data.hotel_chain) {
				$scope.isHotelChainReadonly = true;
			}

			setDropdownDefaults();
			$scope.selectedTheme = data.selected_theme;
		};

		$scope.invokeApi(ADHotelDetailsSrv.hotelAdminfetchEditData, {}, fetchSuccess);
	}

	$scope.$watch(
		function() {
		return $scope.data.hotel_template_logo;
	}, function(logo) {
				if (logo === 'false') {
					$scope.fileName = "Choose File....";
				}
				$scope.hotel_template_logo_file = $scope.fileName;
			}
		);
	$scope.$watch(function() {
		return $scope.data.hotel_logo;
	}, function(logo) {
				if (logo === 'false') {
					$scope.fileName = "Choose File....";
				}
				$scope.hotel_logo_file = $scope.fileName;
			}
		);

	/**
	* function to open calndar popup for choosing pms start date
	*/
	$scope.setPmsStartDate = function() {
		ngDialog.open({
            template: '/assets/partials/hotel/adPmsStartDateCalendarPopup.html',
            className: 'ngdialog ngdialog-theme-default calendar-single1',
            closeByDocument: true,
            scope: $scope
        });
	};

	/**
    *   A post method for Test MliConnectivity for a hotel
    */
	$scope.clickedTestMliConnectivity = function() {
		var postData = {
			"mli_chain_code": $scope.data.mli_chain_code,
			"mli_hotel_code": $scope.data.mli_hotel_code
		};

		if ($scope.mli.certificate != "") {
			postData.mli_pem_certificate = $scope.mli.certificate;
		}
		var testMliConnectivitySuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.successMessage = "Connection Valid";
		};

		$scope.invokeApi(ADHotelDetailsSrv.testMliConnectivity, postData, testMliConnectivitySuccess);
	};

	/**
    *   A post method for Add New and UPDATE Existing hotel details.
    */
	$scope.clickedSave = function() {
		var unwantedKeys;

		// SNT Admin - To save Add/Edit data
		if ($scope.isAdminSnt) {
			unwantedKeys = ["time_zones", "brands", "chains", "check_in_time", "check_out_time", "countries", "currency_list", "pms_types", "signature_display", "hotel_logo", "languages", "hotel_template_logo", "theme_list"];

			if ($scope.data.country !== $scope.swedenCountryId) {
				unwantedKeys.push("max_control_unit");
			}
			var data = dclone($scope.data, unwantedKeys);

			if ($scope.mli.certificate != "") {
				data.mli_certificate = $scope.mli.certificate;
			}
			data.interface_type_ids = getSelectedInterfaceTypes(data);
			data.max_control_unit = parseInt(data.max_control_unit);
			var themeData = {
				'value': (!!$scope.selectedTheme) ? $scope.selectedTheme.value : 'ORANGE'
			};

			data.selected_theme = themeData;
			var postSuccess = function() {
				$scope.$emit('hideLoader');
				$state.go("admin.hotels");
			};

			data.isSNTAdmin = true;

			// CICO-42171 : For overlay hotels, param : is_multi_property should be false.
			if ($scope.data.hotel_pms_type === 'OWS') {
				data.is_multi_property = false;
			}

			if ($scope.isEdit) {
				$scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, postSuccess);
			}
			else {
				$scope.invokeApi(ADHotelDetailsSrv.addNewHotelDeatils, data, postSuccess);
			}
		}
		// Hotel Admin -To save Edit data
		else {


		/** ********* Commented out to fix CICO-8508 ****************************/
		// template logo was not updating when existing image was removed
		/** ******************************************************************/

			if ($scope.data.payment_gateway === "MLI") {
				unwantedKeys = ["time_zones", "brands", "chains", "check_in_time", "check_out_time", "countries", "currency_list", "pms_types", "hotel_pms_type", "is_single_digit_search", "is_pms_tokenized", "signature_display", "hotel_list", "menus", "mli_hotel_code", "mli_chain_code", "mli_access_url", "languages", "date_formats", "currency_formats", "six_merchant_id", "six_validation_code", "is_external_references_import_on", "external_references_import_freq", "is_hold_room_import_on", "hold_room_import_freq", "allow_desktop_swipe", "cc_swipe_listening_port", "theme_list", "cc_swipe_listening_url"];
			} else {
				unwantedKeys = ["time_zones", "brands", "chains", "check_in_time", "check_out_time", "countries", "currency_list", "pms_types", "hotel_pms_type", "is_single_digit_search", "is_pms_tokenized", "signature_display", "hotel_list", "menus", "mli_hotel_code", "mli_chain_code", "mli_access_url", "languages", "date_formats", "currency_formats", "mli_payment_gateway_url", "mli_merchant_id", "mli_api_version", "mli_api_key", "mli_site_code", "is_external_references_import_on", "external_references_import_freq", "is_hold_room_import_on", "hold_room_import_freq", "allow_desktop_swipe", "cc_swipe_listening_port", "theme_list", "cc_swipe_listening_url"];
			}


			var data = dclone($scope.data, unwantedKeys);

			data.interface_type_ids = getSelectedInterfaceTypes(data);
			var themeDataHA = {
				'value': (!!$scope.selectedTheme) ? $scope.selectedTheme.value : 'ORANGE'
			};

			data.selected_theme = themeDataHA;
			if ($scope.hotelLogoPrefetched === data.hotel_logo) {
				data.hotel_logo = "";
			}
			if ($scope.hotelTemplateLogoPrefetched === data.hotel_template_logo) {
				data.hotel_template_logo = "";
			}
			var postSuccess = function() {
				$scope.$emit('hideLoader');

				// CICO-39623 : Setting up app theme.
	            if ( !!$scope.selectedTheme && $scope.selectedTheme.value !== 'ORANGE' ) {
	              var appTheme = 'theme-' + ($scope.selectedTheme.value).toLowerCase();

	              document.getElementsByTagName("html")[0].setAttribute( 'class', appTheme );
	            }
	            else {
	            	document.getElementsByTagName("html")[0].removeAttribute( 'class');
	            }

				$state.go('admin.dashboard', {menu: $scope.findMainMenuIndex('Hotel & Staff')});
				$scope.$emit('hotelNameChanged', {"new_name": $scope.data.hotel_name});
				angular.forEach($scope.data.currency_list, function(item, index) {
		       		if (item.id === $scope.data.default_currency) {
		       			$rootScope.currencySymbol = getCurrencySign(item.code);
				 	}
	       		});
			};

			$scope.invokeApi(ADHotelDetailsSrv.updateHotelDeatils, data, postSuccess);
		}
	};

	/**
	 * when clicked on Hold Status flag
	 */
	$scope.toggleTheHoldStatusValue = function() {
		$scope.data.is_hold_flag_enabled = !$scope.data.is_hold_flag_enabled;
	};

	/**
	 * when clicked on Ignore Room Status for Pre-Assigned Rooms
	 */
	$scope.toggleTheIgnoreRoomStatusValue = function() {
		$scope.data.ignore_room_status_for_pre_assigned = !$scope.data.ignore_room_status_for_pre_assigned;
	};

	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.toggleClicked = function() {
		$scope.data.is_pms_tokenized = ($scope.data.is_pms_tokenized === 'true') ? 'false' : 'true';
	};
	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.toggleInvoiceSequence = function() {
		if (!$scope.data.enable_mod_type) {
			$scope.data.enable_mod_type = !$scope.data.enable_mod_type;
		}
	};
	/**
    *   Method to toggle data for 'is_pms_tokenized' as true/false.
    */
	$scope.doNotUpdateVideoToggleClicked = function() {
		$scope.data.do_not_update_video_checkout = ($scope.data.do_not_update_video_checkout === 'true') ? 'false' : 'true';
	};

    /**
    *   Method to toggle data for 'room_status_per_room_type' as true/false.
    */
	$scope.roomStatusUpdatePerRoomType = function() {
		$scope.data.is_room_status_import_per_room_type_on = ($scope.data.is_room_status_import_per_room_type_on === 'true') ? 'false' : 'true';
	};

	/**
    *   Method to toggle data for 'use_kiosk_entity_id_for_fetch_booking' as true/false.
    */
	$scope.kioskEntityToggleClicked = function() {
		$scope.data.use_kiosk_entity_id_for_fetch_booking = ($scope.data.use_kiosk_entity_id_for_fetch_booking === 'true') ? 'false' : 'true';
	};

	/**
    *   Method to toggle data for 'use_snt_entity_id_for_checkin_checkout' as true/false.
    */
	$scope.sntEntityToggleClicked = function() {
		$scope.data.use_snt_entity_id_for_checkin_checkout = ($scope.data.use_snt_entity_id_for_checkin_checkout === 'true') ? 'false' : 'true';
	};

	/**
	 * Toggle the OWS logging
	 */
	$scope.toggleOWSLogging = function() {
		$scope.data.is_ows_logging_enabled = !$scope.data.is_ows_logging_enabled;
	};

	/**
    *   to test MLI connectivity.
    */

	$scope.testMLIPaymentGateway = function() {

		var testMLIPaymentGatewaySuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.successMessage = "Connection Valid";
		};

		var testMLIPaymentGatewayError = function(data) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
		};

		$scope.invokeApi(ADHotelDetailsSrv.testMLIPaymentGateway, {}, testMLIPaymentGatewaySuccess, testMLIPaymentGatewayError);

	};


	/**
    *   Method to go back to previous state.
    */
	$scope.back = function() {

		if ($scope.isAdminSnt) {

    		if ($scope.previousStateIsDashBoard) {
    			$state.go("admin.dashboard", {"menu": 0});
    		}
    		else {
    			$state.go("admin.hotels");
    		}

		}
		else {
			if ($rootScope.previousStateParam) {
				$state.go($rootScope.previousState, { menu: $rootScope.previousStateParam});
			}
			else if ($rootScope.previousState) {
				$state.go($rootScope.previousState);
			}
			else
			{
				$state.go('admin.dashboard', {menu: 0});
			}
		}
	};
	/**
    *   To handle change in hotel chain and populate brands accordingly.
    */
	$scope.$watch('data.hotel_chain', function() {
		$scope.data.brands = [];
        angular.forEach($scope.data.chains, function(item, index) {
                if (item.id === $scope.data.hotel_chain) {
                	$scope.data.brands = item.brands;
                }
        });
    });
	/**
    *   To handle show hide status for the logo delete button
    */
    $scope.isLogoAvailable = function(logo) {
    	if (logo !== '/assets/images/logo.png' && logo !== 'false') {
    		return true;
    	}
    	else {
    		return false;
    	}
    };

    $scope.toggleInterfaceType = function(index) {
    	$scope.data.interface_types[index].is_checked = $scope.data.interface_types[index].is_checked === 'true' ? "false" : "true";
    };

    var getSelectedInterfaceTypes = function(data) {
    	var selectedIds = [];

    	for (var i = 0; i < data.interface_types.length; i++) {
    		if (data.interface_types[i].is_checked === 'true') {
    			selectedIds.push(data.interface_types[i].id);
    		}
    	}
    	return selectedIds;
    };

    // Set dropdown defaults when they are empty or null
    var setDropdownDefaults = function() {
    	if (!$scope.data.hotel_brand) {
			$scope.data.hotel_brand = "";
		}

		if (!$scope.data.hotel_chain) {
			$scope.data.hotel_chain = "";
		}

		if (!$scope.data.hotel_date_format) {
			$scope.data.hotel_date_format = "";
		}

		if (!$scope.data.hotel_currency_format) {
			$scope.data.hotel_currency_format = "";
		}

		if (!$scope.data.default_currency) {
			$scope.data.default_currency = "";
		}

		if (!$scope.data.selected_language) {
			$scope.data.selected_language = "";
		}
    };

    // CICO-39623 : Setting up theme color here..
    $scope.isToggleThemePreviewControl = true;
    $scope.selectedTheme = {};

    // Toggle the theme preview control.
    $scope.toggleThemePreviewControl = function() {
 	  	$scope.isToggleThemePreviewControl = !$scope.isToggleThemePreviewControl;
    };
    // Handle click action on theme selection.
    $scope.themeSelected = function( selectedTheme ) {
 	  	$scope.selectedTheme = selectedTheme;
    };
    // Handle outside click
    $scope.clickedOutside = function(event) {
    	if (event.target.id !== 'color-palete') {
	    	$scope.isToggleThemePreviewControl = true;
	    }
    	event.stopPropagation();
    };
    // Handle click on MP flag checkbox.
    $scope.clickedMultiPropertyCheckbox = function() {
    	if ( !$scope.data.is_multi_property && isMPFlagResetConfirmPopupNeeded ) {
			$scope.message = $scope.data.hotel_name + ' will now be de-selected from Multi property';
			ngDialog.open({
                template: '/assets/partials/hotel/adHotelMPFlagDeSelectionConfirm.html',
                className: '',
                scope: $scope,
                closeByDocument: false
            });
    	}
    };
    // Close the popup.
    var closeDialogue = function() {
    	ngDialog.close();
    };

    // Success callbacks after De-Selecting MP flag
    var succeessCallbackdSelectMPFlag = function() {
    	$scope.$emit('hideLoader');
		closeDialogue();
    };

    // Failure callbacks after De-Selecting MP flag
    var failureCallbackdSelectMPFlag = function( errorMessage ) {
    	$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
    };

    // Handle Continue button click..
    $scope.clickedContinue = function() {
    	var params = {
    		'hotel_id': $scope.data.id
    	};

    	$scope.invokeApi(ADHotelDetailsSrv.deSelectMPFlag, params, succeessCallbackdSelectMPFlag, failureCallbackdSelectMPFlag);
    };
    // Handle Cancel button click..
    $scope.clickedCancel = function() {
    	$scope.data.is_multi_property = true;
    	closeDialogue();
    };
    /*
     * Clicked Legal settings button - SNT admin
     */
    $scope.clickedLegalSettings = function() {
    	ngDialog.open({
            template: '/assets/partials/hotel/adHotelLegalSettings.html',
            className: '',
            scope: $scope,
            closeByDocument: false,
            controller: 'adHotelLegalSettingsController'
        });
    };
}]);
