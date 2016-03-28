admin.controller('ADStationaryCtrl',
	['$scope',
	'ADStationarySrv',
	'ngTableParams',
	'availableGuestLanguages',
	'availableHoldStatus',
	function($scope, ADStationarySrv, ngTableParams, availableGuestLanguages, availableHoldStatus) {

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";
	$scope.location_image_file = $scope.fileName;
	$scope.memento = {
		hotel_picture: "",
		location_image: ""
	};

	/*
	* Fetches the stationary items
	*/
	var fetchStationary = function(params) {
		var successCallbackOfFetch = function(data) {
			$scope.$emit('hideLoader');
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
		$scope.languages = availableGuestLanguages;
		$scope.holdStatusList = availableHoldStatus.data.hold_status;
		$scope.locale = $scope.languages.default_locale;
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
		//CICO-26524
		$scope.data.group_hold_status_data = [];
		if($scope.data.groupholdstatus !== ""){
			var groupConfirmationData = {};
			groupConfirmationData.hold_status_id = $scope.data.groupholdstatus;
			groupConfirmationData.confirmation_email_header = $scope.data.group_confirmation_header;
			groupConfirmationData.confirmation_email_footer = $scope.data.group_confirmation_footer;
			$scope.data.group_hold_status_data.push(groupConfirmationData);
		}
		var postingData = dclone($scope.data, filterKeys);
		//calling the save api
		if ($scope.hotelTemplateLogoPrefetched === postingData.location_image) {
			postingData.location_image = "";
		}
		postingData.locale = $scope.locale;


		$scope.invokeApi(ADStationarySrv.saveStationary, postingData, successCallbackOfSaveDetails);
	};

	// CICO-17706 : While Cancellation Email is Turned OFF , Print Cancellation Email also forced to OFF.
	$scope.$watch('data.send_cancellation_letter', function(newValue, oldValue) {
		if(!newValue) {
	   		$scope.data.print_cancellation_letter = false;
		}
	});

	/**
	 *   To watch location image
	 */
	$scope.$watch(function() {
		return $scope.data.location_image;
	}, function(logo) {
		if (logo === 'false') {
			$scope.fileName = "Choose File....";
		}
		$scope.location_image_file = $scope.fileName;
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

	/*
	* Get invoked when the locale is changed
	*/
	$scope.onLocaleChange = function() {
		var params = {};
		params.locale = $scope.locale;
		fetchStationary(params);
	}

	$scope.showConfirmationHeaderFooterBasedOnHoldStatus = function(){
		//If not set for any status - then empty
		$scope.data.group_confirmation_header = "";
		$scope.data.group_confirmation_footer = "";
		angular.forEach($scope.data.group_hold_status_data, function(value, key) {

	     	if(value.hold_status_id == $scope.data.groupholdstatus){
	     		$scope.data.group_confirmation_header = value.confirmation_email_header;
		        $scope.data.group_confirmation_footer = value.confirmation_email_footer;
	     	}
	    });
	};

}]);