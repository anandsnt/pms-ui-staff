sntZestStation.controller('zsCheckinAddonCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsCheckinSrv',
	'zsEventConstants',
	'$timeout',
	'$translate',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsCheckinSrv, zsEventConstants, $timeout, $translate, zsGeneralSrv) {
		
		var lcoAddonList = [];

		$scope.selectedLcoAddonId = '';
		$scope.selectedAddon = {};
		$scope.pageData = zsGeneralSrv.retrievePaginationStartingData();

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

		// check if addon type is room or flat, based on this the qunatity limit need to be set
		$scope.isAddonFlatOrRoomType = function(addonToBe) {
			var isAddonFlatOrRoomType = false;

			if (_.isUndefined(addonToBe)) {
				isAddonFlatOrRoomType = false;
			} else {
				var addon = angular.copy(addonToBe);

				// To delete once the addon import API is fixed
				addon.amount_type = (addon.amount_type === 'Room') ? 'Per Room' : addon.amount_type;
				addon.amount_type = (addon.amount_type === 'Flat') ? 'Flat Rate' : addon.amount_type;
				// To deleted above
				isAddonFlatOrRoomType =  addon.amount_type === 'Per Room' || addon.amount_type === 'Flat Rate';
			}

			return isAddonFlatOrRoomType;
		};

		var setPageNumberDetails = function() {
			$scope.$emit('hideLoader');
			var itemsPerPage = 6;

			$scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.addonsList, itemsPerPage, $scope.pageData.pageNumber);
			// once the addons list is set, reset height of the container
			$('#upgrades').css({
				"height": "calc(100% - 230px)"
			});
		};

		$scope.paginationAction = function(disableButtonFlag, isNextPage) {
			disableButtonFlag = true;
			$scope.$emit('showLoader');
			$timeout(function() {
				$scope.pageData.pageNumber = isNextPage ? ++$scope.pageData.pageNumber : --$scope.pageData.pageNumber;
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
		var addRemoveAddonSucess = function() {
			$scope.selectedAddon.is_selected = $scope.selectedAddonCount > 0;
			$scope.selectedAddon.quantity = angular.copy($scope.selectedAddonCount);
			$scope.showAddonPopup = false;
			$scope.selectedAddonQtyBeforeActions = angular.copy($scope.selectedAddon.quantity);
			updateCheckinSrvWithNewAddonData();
			if ($scope.addonsList.length === 1) {
				navigateToTermsPage();
			}
		};
		var addAddonToReservation = function(addon, isLco) {
			var params = {
				id: $scope.selectedReservation.id,
				addon_id: addon.addon_id
			};

			if ($scope.isAddonFlatOrRoomType(addon)) {
				params.quantity = angular.copy($scope.selectedAddonCount);
			}
			$scope.callAPI(zsCheckinSrv.updateAddon, {
				params: params,
				'successCallBack': function() {
					if (!_.isUndefined(isLco)) {
						addon.is_selected = true;
						$scope.selectedAddon.is_selected = true;
						$scope.showAddonPopup = false;
					} else {
						addRemoveAddonSucess(addon);
					}
				},
				'failureCallBack': addonGeneralFailure
			});
		};
		var removeAddonFromReservation = function(addon, isLco) {
			$scope.callAPI(zsCheckinSrv.deleteAddon, {
				params: {
					id: $scope.selectedReservation.id,
					addon_id: addon.addon_id
				},
				'successCallBack': function() {
					if (!_.isUndefined(isLco)) {
						addon.is_selected = false;
						$scope.selectedAddon.is_selected = false;
						$scope.selectedLcoAddonId = '';
						$scope.showAddonPopup = false;
					} else {
						addRemoveAddonSucess(addon);
					}
				},
				'failureCallBack': addonRemoveGeneralFailure
			});
		};

		$scope.addRemoveLcoAddon = function() {
			var addon = _.find($scope.selectedAddon.addons, function(addon) {
				return parseInt(addon.addon_id) === parseInt($scope.selectedLcoAddonId);
			});

			if (!addon.is_selected) {
				addAddonToReservation(addon, true);
			} else {
				removeAddonFromReservation(addon, true);
			}
		};

		$scope.isOneLcoAdded = function() {
			var lcoAddon = _.find($scope.pageData.viewableItems, function(addon) {
				return addon.isLco;
			});
			var isAnyOneLcoSelected = _.some(lcoAddon.addons, function(addon) {
				return addon.is_selected;
			});
			
			return isAnyOneLcoSelected;
		};

		$scope.selectDeselectLco = function(lcoAddon) {
			if (!$scope.isOneLcoAdded() && !lcoAddon.is_selected) {
				$scope.selectedLcoAddonId = lcoAddon.addon_id;
			} else {
				$scope.selectedLcoAddon = '';
			}
		};

		// check if the the Late checkout addon already added or not
		$scope.checkIfLcoAddonWasAdded = function() {
			if ($scope.selectedAddon.isLco) {
				var addon = _.find($scope.selectedAddon.addons, function(addon) {
					return parseInt(addon.addon_id) === parseInt($scope.selectedLcoAddonId);
				});

				return _.isUndefined(addon) ? false : addon.is_selected;
			}
			return false;
		};
		// show late checout add button if one LCO addon is selected and it wasn't added before, else show remove
		$scope.lcoRemoveMode = function() {
			return $scope.checkIfLcoAddonWasAdded();
		};
		$scope.lcoAddonsBackAction =  function() {
			$scope.showAddonPopup = false;
			$scope.selectedLcoAddonId = '';
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
			if ($scope.selectedAddonCount !== 1) {
				$scope.selectedAddonCount = $scope.selectedAddonCount + 1;
			} else {
				return;
			}
		};

		// DONE button action in addon list screen
		$scope.addOnDoneButtonClicked = function(selectedAddon) {
			if ($scope.selectedAddonQtyBeforeActions === $scope.selectedAddonCount) {
				$scope.showAddonPopup = false;
			} else {
				if ($scope.selectedAddonCount === 0) {
					// if addon was added from ZS,remove addon
					if (selectedAddon.is_selected) {
						removeAddonFromReservation(selectedAddon);
					} else {
						$scope.showAddonPopup = false;
					}
				} else {
					addAddonToReservation(selectedAddon);
				}
			}
		};

		// On addon Selected from the list
		$scope.addonSelected = function(addon) {
			$scope.selectedAddonQtyBeforeActions = angular.copy(addon.quantity);
			$scope.selectedAddon = addon;
			$scope.showAddonPopup = true;
			$scope.selectedAddonCount = addon.quantity;
			if (addon.isLco) {
				var selectLcoAddon = _.find($scope.selectedAddon.addons, function(addon) {
					return addon.is_selected;
				});

				$scope.selectedLcoAddonId = _.isUndefined(selectLcoAddon) ? '' : selectLcoAddon.addon_id;
			}
		};
		$scope.closePopup = function() {
			$scope.showAddonPopup = false;
		};

		var fetchLateCheckoutSettings = function() {
			var fetchLateCheckoutSettingsSuccess = function(response) {
					var checkIfAddonIdIsPresent = function(lco) {
						return (lco && !_.isUndefined(lco.addon_id) && lco.addon_id !== '');
					};
					var alreadyPresentAddonIds = _.pluck($scope.selectedReservation.addons, 'id');
					var checkIfLcoIsAlreadyPurchased = function(addon_id) {
						return _.some(alreadyPresentAddonIds, function(id) {
							return parseInt(addon_id) === parseInt(id);
						});
					};
					var updateAddonListWrTLcoPresent = function(lcoAddonId) {
						$scope.addonsList = _.reject($scope.addonsList, function(addon) {
							return parseInt(addon.addon_id) === parseInt(lcoAddonId);
						});
					};
					var isFirstLcoSelected = false;
					var isSecondLcoSelected = false;
					var isThirdLcoSelected = false;
					var firstLcoIndex = -1;
					var lateCheckoutAddons = [];
					var extractTime = function(time) {
						time = parseInt(time) < 10 ? time.slice(1, 2) : time;
						return time;
					};
					var addLateCheckoutAddon = function(lco_charge) {
							lcoAddonList.push({
								id: lco_charge.addon_id,
								time: extractTime(lco_charge.time)
							});
					};

					// Dont offer lower LCO offers if higher level is already purchased
					if (checkIfAddonIdIsPresent(response.extended_checkout_charge_2)) {
						isThirdLcoSelected = checkIfLcoIsAlreadyPurchased(response.extended_checkout_charge_2.addon_id);
						if (!isThirdLcoSelected) {
							addLateCheckoutAddon(response.extended_checkout_charge_2);
						} else {
							updateAddonListWrTLcoPresent(response.extended_checkout_charge_2.addon_id);
						}
					}
					if (checkIfAddonIdIsPresent(response.extended_checkout_charge_1)) {
						isSecondLcoSelected = checkIfLcoIsAlreadyPurchased(response.extended_checkout_charge_1.addon_id);
						if (!isSecondLcoSelected && !isThirdLcoSelected) {
							addLateCheckoutAddon(response.extended_checkout_charge_1);
						} else {
							updateAddonListWrTLcoPresent(response.extended_checkout_charge_1.addon_id);
						}
					}
					if (checkIfAddonIdIsPresent(response.extended_checkout_charge_0)) {
						isFirstLcoSelected = checkIfLcoIsAlreadyPurchased(response.extended_checkout_charge_0.addon_id);
						if (!isFirstLcoSelected && !isSecondLcoSelected && !isThirdLcoSelected) {
							addLateCheckoutAddon(response.extended_checkout_charge_0);
						} else {
							updateAddonListWrTLcoPresent(response.extended_checkout_charge_0.addon_id);
						}
					}

					// create LC addons using the LC addon Ids
					_.each($scope.addonsList, function(addon, addonIndex) {
						_.each(lcoAddonList, function(lcoAddon) {
							if (parseInt(addon.addon_id) === parseInt(lcoAddon.id)) {
								if (firstLcoIndex === -1) {
									firstLcoIndex = addonIndex; // the bundled LCO will appear @ this index
								}
								addon.isLateCheckoutAddon = true;
								addon.index = lcoAddon.index;
								addon.time = lcoAddon.time;
								lateCheckoutAddons.push(addon);
							}
						});
					});

					// remove all LCO addons from main addons list
					$scope.addonsList = _.reject($scope.addonsList, function(addon) {
						return addon.isLateCheckoutAddon;
					});

					// create new Bunlded addon for LCO
					if (lateCheckoutAddons.length > 0) {
						var lcoImage;

						if (!_.isUndefined(response.late_checkout_addon_image) && response.late_checkout_addon_image.length > 0) {
							lcoImage = response.late_checkout_addon_image;
						} else {
							lcoImage = lateCheckoutAddons[0].image;
						}
						var bundledLCOAddon = {
							"addons": lateCheckoutAddons,
							"name": "LCO",
							"isLco": true,
							"image": lcoImage
						};

						$scope.addonsList.splice(firstLcoIndex, 0, bundledLCOAddon);
					}

				setPageNumberDetails();
			};

			$scope.callAPI(zsCheckinSrv.fetchLateCheckoutSettings, {
				params: {
					reservation_id: $scope.selectedReservation.id
				},
				'successCallBack': fetchLateCheckoutSettingsSuccess,
				'failureCallBack': generalError
			});
		};

		var fetchHotelAddonLabels = function() {
			var fetchAddonLabelSuccess = function(response) {
				var amountTypesLabels;
				var postTypeLabels;

				var translatedLabels = _.find(response.translations, function(translation) {
					return translation.language_id === $scope.languageId;
				});
				
				// check if translations are added, else use english ones
				if (_.isUndefined(translatedLabels)) {
					amountTypesLabels = response.amount_types;
					postTypeLabels = response.post_types;
				} else {
					amountTypesLabels = translatedLabels.amount_types;
					postTypeLabels = translatedLabels.post_types;
				}
				// Loop through the addons list and assign the labels set in admin --> upsells --> adodn upsell
				// amount type labels and post type labels are arrays

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
				// TO DELETE
				if ($scope.zestStationData.is_sell_late_checkout_as_addon) {
					fetchLateCheckoutSettings();
				} else {
					setPageNumberDetails();
				}

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
						response.addons = _.filter(response.addons, function(addon) {
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
			// for now we will not go back to reservation details page.

			// check if any one of the addons were purchased
			// var purchasedAddons = _.filter($scope.addonsList, function(addon) {
			// 	return addon.is_selected;
			// });

			// if (purchasedAddons.length > 0) {
			// 	$scope.selectedReservation.skipAddon = true;
			// 	zsCheckinSrv.setSelectedCheckInReservation([$scope.selectedReservation]);
			// 	$state.go('zest_station.checkInReservationDetails');
			// } else {
				navigateToTermsPage();
			// }
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
			var selectedLanguage = _.find($scope.zestStationData.hotelLanguages, function(language) {
				return language.language === usedLanguageCode;
			});

			// For custom languages, use English for now
			// TODO: Handle addon translations for custom languages in hotel admin
			if (!selectedLanguage) {
				selectedLanguage = _.find($scope.zestStationData.hotelLanguages, function(language) {
					return language.language === 'English';
				});
			}
			$scope.languageId = selectedLanguage.id;

			fetchAddons();
		};

		/**
		 * [initializeMe description]
		 */
		(function() {
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
			if ($stateParams.isQuickJump !== 'true') {
				$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
				findSelectedLanguageId();
			}
		}());
	}
]);