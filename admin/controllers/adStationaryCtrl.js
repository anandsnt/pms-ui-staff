admin.controller('ADStationaryCtrl', ['$scope', 'ADStationarySrv', 'ngTableParams', function($scope, ADStationarySrv, ngTableParams) {

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	$scope.fileName = "Choose File....";
	$scope.location_image_file = $scope.fileName;
	$scope.memento = {
		hotel_picture: "",
		location_image: ""
	}

	$scope.init = function() {

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
				})
			});

			$scope.data = data;
			$scope.itemList = new ngTableParams({
				page: 1, // show first page
				count: $scope.data.social_network_links.length, // count per page - Need to change when on pagination implemntation
				sorting: {
					name: 'asc' // initial sorting
				}
			});
			$scope.hotelTemplateLogoPrefetched = data.location_image;
		};
		$scope.invokeApi(ADStationarySrv.fetch, {}, successCallbackOfFetch);
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

		var filterKeys = ["guest_bill_template", "hotel_logo"];
		if ($scope.data.hotel_picture === $scope.memento.hotel_picture) {
			filterKeys.push('hotel_picture')
		}
		if ($scope.data.location_image === $scope.memento.location_image) {
			filterKeys.push('location_image')
		}
		var postingData = dclone($scope.data, filterKeys);
		//calling the save api
		if ($scope.hotelTemplateLogoPrefetched === postingData.location_image) {
			postingData.location_image = "";
		}
		$scope.invokeApi(ADStationarySrv.saveStationary, postingData, successCallbackOfSaveDetails);
	};

	// CICO-17706 : While Cancellation Email is Turned OFF , Print Cancellation Email also forced to OFF.
	$scope.$watch('data.send_cancellation_letter', function(newValue, oldValue) {
	   if(!newValue) $scope.data.print_cancellation_letter = false;
	});

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
		if (logo !== '/assets/logo.png' && logo !== 'false') {
			return true;
		}
		else {
			return false;
		}
	};

	$scope.onEditSocialLink = function(link, index) {
		$scope.editStoreLink = angular.copy(link);
		$scope.currentSocialLink = index;
	}
	$scope.onCancelEditLink = function(index) {
		$scope.data.social_network_links[index] = $scope.editStoreLink;
		$scope.currentSocialLink = false;
	}

	$scope.onCancelAddLink = function() {
		$scope.currentSocialLink = false;
	}

	$scope.onAddNewSocialLink = function() {
		$scope.newSocialLinkData = {
			type: '',
			link: ''
		}
		$scope.currentSocialLink = 'NEW';
	}

	$scope.onPushNewLink = function() {
		$scope.data.social_network_links.push($scope.newSocialLinkData);
		$scope.currentSocialLink = false;
	}

	$scope.onRemoveLink = function(link) {
		$scope.data.social_network_links = _.without($scope.data.social_network_links, link);
	}

	$scope.onUpdateSocialLink = function() {
		$scope.currentSocialLink = false;
	}

}]);