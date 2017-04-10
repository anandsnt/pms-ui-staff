sntZestStation.controller('zsCheckinAddonCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsCheckinSrv',
	'zsEventConstants',
	'$timeout',
	'$translate',
	function($scope, $stateParams, $state, zsCheckinSrv, zsEventConstants, $timeout, $translate) {

		var navigateToTermsPage = function() {

			var stateParams = {
				'guest_id': $scope.selectedReservation.guest_details[0].id,
				'reservation_id': $scope.selectedReservation.id,
				'deposit_amount': $scope.selectedReservation.reservation_details.deposit_amount,
				'room_no': $scope.selectedReservation.reservation_details.room_number, // this changed from room_no, to room_number
				'room_status': $scope.selectedReservation.reservation_details.room_status,
				'payment_type_id': $scope.selectedReservation.reservation_details.payment_type,
				'guest_email': $scope.selectedReservation.guest_details[0].email,
				'guest_email_blacklisted': $scope.selectedReservation.guest_details[0].is_email_blacklisted,
				'first_name': $scope.selectedReservation.guest_details[0].first_name,
				'balance_amount': $scope.selectedReservation.reservation_details.balance_amount,
				'confirmation_number': $scope.selectedReservation.confirmation_number,
				'pre_auth_amount_for_zest_station': $scope.selectedReservation.reservation_details.pre_auth_amount_for_zest_station,
				'authorize_cc_at_checkin': $scope.selectedReservation.reservation_details.authorize_cc_at_checkin,
				'is_from_room_upsell': $stateParams.is_from_room_upsell,
				'is_from_addons': 'true'
			};

			$state.go('zest_station.checkInTerms', stateParams);
		};

		$scope.navigateToNextScreen = function() {
			navigateToTermsPage();
		};

		var generalError = function() {
			$scope.mode = 'ERROR_MODE';
		};

		$scope.isAddonFlatOrRoomType = function(addonToBe) {
			if (_.isUndefined(addonToBe)) {
				return false;
			} else {
				var addon = angular.copy(addonToBe);

				// To delete once the addon import API is fixed
				addon.amount_type = (addon.amount_type === 'Room') ? 'Per Room' : addon.amount_type;
				addon.amount_type = (addon.amount_type === 'Flat') ? 'Flat Rate' : addon.amount_type;
				// To deleted above
				return addon.amount_type === 'Per Room' || addon.amount_type === 'Flat Rate';
			}
		};

		var setPageNumberDetails = function() {
			$scope.$emit('hideLoader');
			if ($scope.addonsList.length <= 6) {
				// if 6 or less upgrades are available
				$scope.pageStartingIndex = 1;
				$scope.pageEndingIndex = $scope.addonsList.length;
				$scope.viewableAddons = angular.copy($scope.addonsList);
				if ($scope.addonsList.length === 1) {
					$scope.addonSelected = $scope.addonsList[0];
				}
			} else {
				// if multiple pages (each containing 6 items) are present and user navigates
				// using next and previous buttons
				$scope.pageStartingIndex = 1 + 6 * ($scope.pageNumber - 1);
				// ending index can depend upon the no of items
				if ($scope.pageNumber * 6 < $scope.addonsList.length) {
					$scope.pageEndingIndex = $scope.pageNumber * 6;
				} else {
					$scope.pageEndingIndex = $scope.addonsList.length;
				}
				// set viewable room list - 6 items at a time
				$scope.viewableAddons = [];

				for (var index = -1; index < 5; index++) {
					if (!_.isUndefined($scope.addonsList[$scope.pageStartingIndex + index])) {
						$scope.viewableAddons.push($scope.addonsList[$scope.pageStartingIndex + index]);
					}
				}
			}
			// enable/disable next previous
			$scope.disableNextButton = ($scope.pageEndingIndex === $scope.addonsList.length);
			$scope.disablePreviousButton = $scope.pageStartingIndex === 1;
			// set the height for container
			$('#upgrades').css({
				"height": "calc(100% - 230px)"
			});
		};

		$scope.viewNextPage = function() {
			$scope.disableNextButton = true;
			$timeout(function() {
				$scope.pageNumber++;
				setPageNumberDetails();
			}, 200);
		};

		$scope.viewPreviousPage = function() {
			$scope.disablePreviousButton = true;
			$timeout(function() {
				$scope.pageNumber--;
				setPageNumberDetails();
			}, 200);
		};

		var addonGeneralFailure = function() {
			$scope.showAddonPopup = false;
			$scope.showErrorPopUp = true;
			$scope.errorHeader = 'ADDON_ADD_ERROR_HEADER';
			$scope.errorMessage = 'ADDON_ADD_ERROR_MESSAGE';
		};
		var addonRemoveGeneralFailure = function() {
			$scope.showAddonPopup = false;
			$scope.showErrorPopUp = true;
			$scope.errorHeader = 'ADDON_REMOVAL_ERROR_HEADER';
			$scope.errorMessage = 'ADDON_REMOVAL_ERROR_MESSAGE';
		};
		var updateCheckinSrvWithNewAddonData = function() {
			if ($scope.selectedAddon.is_selected) {
				// add the newly added addon
				var newAddon = {
					'id': $scope.selectedAddon.addon_id,
					'name': $scope.selectedAddon.name
				};

				$scope.selectedReservation.addons.push(newAddon);
			} else {
				// remove the delted addon
				$scope.selectedReservation.addons = _.filter($scope.selectedReservation.addons, function(addon) {
					return addon.id !== $scope.selectedAddon.addon_id;
				});
			}
			zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
		};
		var addRemoveAddonSucess = function(selectedAddon) {
			$scope.selectedAddon.is_selected = $scope.selectedAddonCount > 0;
			$scope.selectedAddon.quantity = angular.copy($scope.selectedAddonCount);
			$scope.showAddonPopup = false;
			$scope.selectedAddonQtyBeforeActions = angular.copy($scope.selectedAddon.quantity);
			updateCheckinSrvWithNewAddonData();
		};
		var addAddonToReservation = function(selectedAddon) {
			var params = {
				id: $scope.selectedReservation.id,
				addon_id: selectedAddon.addon_id
			};

			if ($scope.isAddonFlatOrRoomType(selectedAddon)) {
				params.quantity = angular.copy($scope.selectedAddonCount);
			}
			$scope.callAPI(zsCheckinSrv.updateAddon, {
				params: params,
				'successCallBack': function() {
					addRemoveAddonSucess(selectedAddon);
				},
				'failureCallBack': addonGeneralFailure
			});
		};
		var removeAddonFromReservation = function(selectedAddon) {
			$scope.callAPI(zsCheckinSrv.deleteAddon, {
				params: {
					id: $scope.selectedReservation.id,
					addon_id: selectedAddon.addon_id
				},
				'successCallBack': function() {
					addRemoveAddonSucess(selectedAddon);
				},
				'failureCallBack': addonRemoveGeneralFailure
			});
		};

		$scope.incrementAddonQty = function() {
			$scope.selectedAddonCount = $scope.selectedAddonCount + 1;
		};
		$scope.decrementAddonQuantity = function() {
			$scope.selectedAddonCount = $scope.selectedAddonCount > 0 ? $scope.selectedAddonCount - 1 : 0;
		};
		$scope.decrementAddonQtyForNonRoomFlatType = function() {
			$scope.selectedAddonCount = $scope.selectedAddonCount > 0 ? $scope.selectedAddonCount - 1 : 0;
		};
		$scope.incrementAddonQtyForNonRoomFlatType = function() {
			if ($scope.selectedAddonCount === 1) {
				return;
			} else {
				$scope.selectedAddonCount = $scope.selectedAddonCount + 1;
			}
		};

		// DONE button action in addon list screen
		$scope.addOnDoneButtonClicked = function(selectedAddon) {
			if ($scope.selectedAddonQtyBeforeActions === $scope.selectedAddonCount) {
				$scope.showAddonPopup = false;
				return;
			} else {
				if ($scope.selectedAddonCount === 0) {
					// if addon was added from ZS,remove addon
					if (selectedAddon.is_selected) {
						removeAddonFromReservation(selectedAddon)
					} else {
						$scope.showAddonPopup = false;
					}
				} else {
					addAddonToReservation(selectedAddon);
				}
			};
		};

		// On addon Selected from the list
		$scope.addonSelected = function(addon) {
			$scope.selectedAddonQtyBeforeActions = angular.copy(addon.quantity);
			$scope.selectedAddon = addon;
			$scope.showAddonPopup = true;
			$scope.selectedAddonCount = addon.quantity;
		};
		$scope.closePopup = function() {
			$scope.showAddonPopup = false;
		};

		var fetchHotelAddonLabels = function() {
			var fetchAddonLabelSuccess = function(response) {
				var amountTypesLabels = response.amount_types;
				var postTypeLabels = response.post_types;
				_.each($scope.addonsList, function(addon) {
					addon.amount_type_label = '';
					_.each(amountTypesLabels, function(amountTypeLabel) {
						if (addon.amount_type === amountTypeLabel.description && amountTypeLabel.label !== '') {
							addon.amount_type_label = amountTypeLabel.label;
						}
					});
					// if no custom label is present, set to amount type
					addon.amount_type_label = (addon.amount_type_label === '') ? addon.amount_type : addon.amount_type_label;

					addon.post_type_label = '';
					_.each(postTypeLabels, function(postTypeLabel) {
						if (addon.post_type === postTypeLabel.description && postTypeLabel.label !== '') {
							addon.post_type_label = postTypeLabel.label;
						}
					});
					// if no custom label is present, set to post type
					addon.post_type_label = (addon.post_type_label === '') ? addon.post_type : addon.post_type_label;
				});
				setPageNumberDetails();
				$scope.loadingCompleted = true;
				$scope.showPageNumberDetails = true;
			};

			$scope.callAPI(zsCheckinSrv.fetchHotelAddonLabels, {
				params: {
					reservation_id: $scope.selectedReservation.id
				},
				'successCallBack': fetchAddonLabelSuccess,
				'failureCallBack': generalError
			});
		};

		var fetchAddons = function() {

			var fetchAddonsSuccess = function(response) {

				var selectedAddonIds = _.pluck($scope.selectedReservation.addons, 'id');

				// no need to show already added addons
				if (selectedAddonIds.length > 0) {
					_.each(selectedAddonIds, function(selectedId) {
						response.addons = _.filter(response.addons, function(addon, index) {
							return addon.addon_id !== selectedId;
						});
					});
				}
				// show only active addons for zest station
				$scope.addonsList = _.reject(response.addons, function(addon) {
					return !addon.zest_station_active;
				});
				_.each($scope.addonsList, function(addon) {
					addon.is_selected = false;
					addon.quantity = 0;
					var usedLanguageCode = $translate.use();
					if (usedLanguageCode !== 'en') {
						_.each(addon.translations, function(translation) {
							if (parseInt(translation.language_id) === parseInt($scope.languageId)) {
								addon.name = translation.translated_name;
								addon.suffix_label = translation.translated_suffix;
								addon.description = translation.translated_alternate_description;
							}
						});
					}
				});
				// set page number details
				$scope.pageNumber = 1;
				if ($scope.addonsList.length > 0) {
					if ($scope.addonsList.length === 1) {
						$scope.selectedAddon = $scope.addonsList[0];
						$scope.selectedAddonCount = 0;
						$scope.selectedAddonQtyBeforeActions = 0;
					}
					fetchHotelAddonLabels();
				} else {
					navigateToTermsPage();
				}
			};

			$scope.callAPI(zsCheckinSrv.fetchAddons, {
				params: {
					reservation_id: $scope.selectedReservation.id
				},
				'successCallBack': fetchAddonsSuccess,
				'failureCallBack': generalError
			});
		};

		$scope.addonPurchaseCompleted = function() {
			// check if any one of the addons were purchased
			var purchasedAddons = _.filter($scope.addonsList, function(addon) {
				return addon.is_selected;
			});

			if (purchasedAddons.length > 0) {
				$scope.selectedReservation.skipAddon = true;
				zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
				$state.go('zest_station.checkInReservationDetails');
			} else {
				navigateToTermsPage();
			}
		};

		var onBackButtonClicked = function() {
			if ($stateParams.is_from_room_upsell === 'true') {
				$state.go('zest_station.roomUpsell');
			} else {
				$state.go('zest_station.checkInReservationDetails');
			}
		};
		var findSelectedLanguageId = function() {
			var usedLanguageCode = $translate.use();
			$scope.languageId = _.find($scope.zestStationData.hotelLanguages, function(language) {
				return language.code === usedLanguageCode;
			}).id;
			fetchAddons();
		};
		/**
		 * [initializeMe description]
		 */
		var initializeMe = (function() {
			$scope.addonsList = [];
			$scope.languageId = '';
			$scope.languageCode = 'en'; // let default be english
			$scope.upsellDisplayOrderAmountFirst = $scope.zestStationData.addon_upsell_display_order === 'amount_then_post_type';
			$scope.errorHeader = '';
			$scope.errorMessage = '';
			$scope.loadingCompleted = false;
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			// hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, onBackButtonClicked);
			$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
			findSelectedLanguageId();

		}());
	}
]);