(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, $stateParams, checkinAddonService, $sce, sntGuestWebSrv, checkinDetailsService) {
		var amountTypesLabels = [],
			postTypeLabels = [],
			selectedAddon = {},
			existingAddons = [],
			setSelectedAddon = function(addon, isSingleAddonAvailable) {
				$scope.selectedAddon = addon;
				$scope.showPurchaseStatus = false;
				$scope.purchaseStatusText = '';
				$scope.mode = 'DETAILED_VIEW';
				$scope.selectedAddonDescrition = $sce.trustAsHtml($scope.selectedAddon.description);
				if ($scope.addonList.length === 1) {
					$scope.addonPurchaseMsgForDisplay = $scope.addonPurchaseMsg.replace("@addon_name@", $scope.selectedAddon.name);
				} else {
					$scope.addonPurchaseMsgForDisplay = $scope.selectedAddon.name;
				}
				$scope.selectedAddonQuantity = angular.copy($scope.selectedAddon.quantity);
				$(document.body).scrollTop(0);
			},
			setText = function(cmsString, defaultString) {
				return cmsString.length > 0 ? cmsString : defaultString;
			},
			fetchScreenDetails = function(screenId) {
				return sntGuestWebSrv.extractAddonScreenDetails(screenId);
			};

		$scope.addonSelected = function(selectedAddon) {
			setSelectedAddon(selectedAddon, false);
		};
		$scope.isAddonFlatOrRoomType = function(addonToBe) {
			var addon = angular.copy(addonToBe);
			// To delete once the addon import API is fixed
			addon.amount_type = (addon.amount_type === 'Room') ? 'Per Room' : addon.amount_type;
			addon.amount_type = (addon.amount_type === 'Flat') ? 'Flat Rate' : addon.amount_type;
			// To deleted above
			return addon.amount_type === 'Per Room' || addon.amount_type === 'Flat Rate';
		};

		$scope.purchaseAddon = function(addon) {
			// disable to purchase more than one LC addon
			if (addon.isLateCheckoutAddon && $scope.isOneLcoAdded()) {
				return;
			}

			var addonAdditionSuccess = function() {
				if ($scope.isAddonFlatOrRoomType(addon)) {
					addon.quantity = angular.copy($scope.selectedAddonQuantity);
					if (addon.quantity > 0) {
						addon.is_selected = true;
						$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
						$scope.showPurchaseStatus = true;
					} else {
						addon.is_selected = false;
						$scope.doneClicked();
					}
				} else {
					addon.is_selected = !addon.is_selected;
					if ($scope.selectedAddon.is_selected) {
						$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
						$scope.showPurchaseStatus = true;
					} else if (addon.isLateCheckoutAddon) {
						$scope.selectedAddon.title = addon.name;
						$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
						$scope.showPurchaseStatus = true;
					} else {
						$scope.doneClicked();
					}
				}
				// update the data in srv with newly added addon
				var checkinDetails = checkinDetailsService.getResponseData();
				var newAddon = {
					'id': addon.addon_id,
					'name': addon.name
				};

				checkinDetails.addons_data.push(newAddon);
				checkinDetailsService.setResponseData(checkinDetails);
				$(document.body).scrollTop(0);
			};


			var params = {
				'addon_id': addon.addon_id
			};

			if ($scope.isAddonFlatOrRoomType(addon)) {
				params.quantity = parseInt($scope.selectedAddonQuantity);
			}
			$scope.isLoading = true;
			checkinAddonService.updateAddon(
				params
			).then(function() {
				$scope.isLoading = false;
				addonAdditionSuccess();
			}, function() {
				$scope.showPurchaseStatus = true;
				$scope.purchaseStatusText = angular.copy($scope.addonFailureMessage);
				$scope.isLoading = false;
			});
		};

		$scope.removeAddon = function(addon) {

			var addonRemovalSuccess = function() {
				if ($scope.isAddonFlatOrRoomType(addon)) {
					addon.is_selected = false;
					addon.quantity = 0;
				} else {
					addon.is_selected = !addon.is_selected;
				}
				// update the data in srv by removing deleted addon
				var checkinDetails = checkinDetailsService.getResponseData();

				checkinDetails.addons_data = _.filter(checkinDetails.addons_data, function(addon) {
					return addon.id !== addon.addon_id;
				});
				checkinDetailsService.setResponseData(checkinDetails);
				$scope.doneClicked();
				$(document.body).scrollTop(0);
			}


			var params = {
				'addon_id': addon.addon_id
			};
			if ($scope.isAddonFlatOrRoomType(addon)) {
				params.quantity = parseInt(addon);
			}
			$scope.isLoading = true;
			checkinAddonService.deleteAddon(
				params
			).then(function() {
				$scope.isLoading = false;
				addonRemovalSuccess();
			}, function() {
				$scope.showPurchaseStatus = true;
				$scope.purchaseStatusText = angular.copy($scope.addonRemovalFailureMessage);
				$scope.isLoading = false;
			});
		};
		var goToNextScreen = function() {
			$rootScope.skipedAddons = true;
			if ($stateParams.isFrom === "checkinLater") {
				$state.go('preCheckinStatus')
			} else {
				$state.go('checkinKeys')
			}

		};

		$scope.doneClicked = function() {
			if ($scope.addonList.length > 1) {
				$scope.mode = 'LIST_VIEW';
				$(document.body).scrollTop(0);
			} else {
				goToNextScreen();
			}
		};

		$scope.noThanksClicked = function() {
			if ($scope.addonList.length === 1 || $scope.mode === 'LIST_VIEW') {
				goToNextScreen();
			} else {
				$scope.mode = 'LIST_VIEW';
			}
		};

		$scope.hideAddAddonButton = function() {
			if (typeof $scope.selectedAddon === "undefined") {
				return false;
			} else if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
				return $scope.selectedAddon.is_selected && parseInt($scope.selectedAddonQuantity) === 0;
			} else {
				return $scope.selectedAddon.is_selected
			}
		};

		$scope.isOneLcoAdded = function() {
			var lcoAddon = _.find($scope.addonList, function(addon) {
				return addon.isLco;
			});
			var isAnyOneLcoSelected = _.some(lcoAddon.lco_addons, function(addon) {
				return addon.is_selected;
			});
			return isAnyOneLcoSelected;
		};

	var fetchLateCheckoutSettings = function() {
			var fetchLateCheckoutSettingsSuccess = function(response) {
					var checkIfAddonIdIsPresent = function(lco) {
						return (!_.isUndefined(lco.addon_id) && lco.addon_id !== '');
					};
					var alreadyPresentAddonIds = _.pluck(existingAddons, 'id');
					var checkIfLcoIsAlreadyPurchased = function(addon_id) {
						return _.some(alreadyPresentAddonIds, function(id) {
							return parseInt(addon_id) === parseInt(id);
						});
					};
					var updateAddonListWrTLcoPresent = function(lcoAddonId) {
						$scope.addonList = _.reject($scope.addonList, function(addon) {
							return parseInt(addon.addon_id) === parseInt(lcoAddonId);
						});
					};
					var isFirstLcoSelected = false;
					var isSecondLcoSelected = false;
					var isThirdLcoSelected = false;
					var firstLcoIndex = -1;
					var lateCheckoutAddons = [];
					var lcoAddonList = [];
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

					// Dont offer lower LCO offers if higher level is already purchased, ie if 3rd offer is purchased don't offer 1st and 2nd
					// But if only 1st is purchased offer 2 and 3
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
					_.each($scope.addonList, function(addon, addonIndex) {
						_.each(lcoAddonList, function(lcoAddon) {
							if (parseInt(addon.addon_id) === parseInt(lcoAddon.id)) {
								if (firstLcoIndex === -1) {
									firstLcoIndex = addonIndex; // the bundled LCO will appear @ this index
								}
								addon.isLateCheckoutAddon = true;
								addon.time = lcoAddon.time;
								lateCheckoutAddons.push(addon);
							}
						});
					});

					// remove all LCO addons from main addons list
					$scope.addonList = _.reject($scope.addonList, function(addon) {
						return addon.isLateCheckoutAddon;
					});

					// create new Bunlded addon for LCO
					if (lateCheckoutAddons.length > 0) {

						$scope.lcoAddonMainDesciprtion = setText(fetchScreenDetails("LCO-ADDON-MAIN-DESC").screen_title, "Extend your Stay. Available Offers from @amount@ onwards.");
						var minimumLcoAmount = $rootScope.currencySymbol + _.first(lateCheckoutAddons).amount.toString();
						$scope.lcoAddonMainDesciprtion = $scope.lcoAddonMainDesciprtion.replace("@amount@", minimumLcoAmount);

						var bundledLCOAddon = {
							"lco_addons": lateCheckoutAddons,
							"name": setText(fetchScreenDetails("LATE-CHECKOUT-HEADING").screen_title, "Late Checkout"),
							"isLco": true,
							"description": setText(fetchScreenDetails("LATE-CHECKOUT-SUB-HEADING").screen_title, "Please select a late checkout offer from the list below to extend yor stay.")
						};

						if (!_.isUndefined(response.late_checkout_addon_image) && response.late_checkout_addon_image.length > 0) {
							$scope.lateCheckoutBundleImage = response.late_checkout_addon_image;
						} else {
							$scope.lateCheckoutBundleImage = lateCheckoutAddons[0].image
						}

						$scope.addonList.splice(firstLcoIndex, 0, bundledLCOAddon);
					}

				$scope.isLoading = false;
			};

			checkinAddonService.getlateCheckoutSettings().then(function(response) {
				fetchLateCheckoutSettingsSuccess(response.data);
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		};


		var handleLabelMappings = function() {
			_.each($scope.addonList, function(addon) {
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
			
			// $rootScope.sellLcoAsAddons = false;
			if ($rootScope.sellLcoAsAddons) {
				fetchLateCheckoutSettings();
			} else {
				$scope.isLoading = false;
			}
		};

		var getAddonAdminSettings = function() {
			checkinAddonService.getAddonAdminSettings().then(function(response) {
				amountTypesLabels = response.amount_types;
				postTypeLabels = response.post_types;
				handleLabelMappings();
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		};

		var fetchExistingAddonsSucess = function(allAvailableAddons) {
			var selectedAddonIds = _.pluck(existingAddons, 'id');
			var addons = [];

			// no need to show already added addons
			if (selectedAddonIds.length > 0) {
				_.each(selectedAddonIds, function(selectedId) {
					allAvailableAddons = _.filter(allAvailableAddons, function(addon, index) {
						return addon.addon_id !== selectedId;
					});
				});
			}

			addons = allAvailableAddons;
			// show only active addons for zestweb
			addons = _.reject(addons, function(addon) {
				return !addon.zest_web_active;
			});
			// Mark all as unselected initially
			_.each(addons, function(addon) {
				addon.is_selected = false;
				addon.quantity = 0;
			});
			$scope.addonList = addons;
			if (addons.length === 0) {
				// no addons present
				goToNextScreen();
			} else if (addons.length === 1) {
				// single addon
				var isSingleAddonAvailable = true;
				selectedAddon = addons[0];
				setSelectedAddon(selectedAddon, isSingleAddonAvailable);
			} else {
				// Multi addons
				$scope.mode = 'LIST_VIEW';
			}

			getAddonAdminSettings();
		};

		(function() {
			// set screen texts from CMS,  find using screen id
			$scope.addonListTitle = setText(fetchScreenDetails("ADDON-LIST").screen_title, "Enhance Your Stay");
			$scope.addonContinue = setText(fetchScreenDetails("ADDON-CONTINUE").screen_title, "Continue");
			$scope.addonSkip = setText(fetchScreenDetails("ADDON-SKIP").screen_title, "No Thanks.");
			$scope.addonPurchase = setText(fetchScreenDetails("ADDON-PURCHASE").screen_title, "Add");
			$scope.addonRemove = setText(fetchScreenDetails("ADDON-REMOVE").screen_title, "Remove");
			$scope.addonRemovalFailureMessage = setText(fetchScreenDetails("ADDON-REMOVAL-FAILURE").screen_title, "Sorry, Something went wrong.");
			$scope.addonFailureMessage = setText(fetchScreenDetails("ADDON-FAILURE").screen_title, "Sorry, This addon can't be added to your reservation");
			$scope.addonSuccesMessage = setText(fetchScreenDetails("ADDON-SUCCESS").screen_title, "Thanks for the purchase. Your addon will be added to your account.");
			$scope.addonSelectQty = setText(fetchScreenDetails("ADDON-SELECT-QTY").screen_title, "Select quantity");
			$scope.addonPurchaseMsg = setText(fetchScreenDetails("ADDON-PURCHASE-MSG").screen_title, "Would you like to add @addon_name@ to your stay?");
			$scope.lcoAddonStartingMsg = setText(fetchScreenDetails("LCO-ADDON-STARTING-MSG").screen_title, "Extend your stay till");
			$scope.lcoAddonEndingMsg = setText(fetchScreenDetails("LCO-ADDON-ENDING-MSG").screen_title, "at");
			$scope.lcoAddonMainDesciprtion = '';

			$scope.addonList = [];
			$scope.isLoading = true;
			$scope.selectedAddon = {};
			$scope.quantityList = _.range(6);
			var params = {};
			checkinAddonService.getAddonList(params).then(function(response) {
				existingAddons = checkinDetailsService.getResponseData().addons_data;
				fetchExistingAddonsSucess(response.addons);
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		})();
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', '$stateParams', 'checkinAddonService', '$sce', 'sntGuestWebSrv', 'checkinDetailsService',
		offerAddonOptionsController
	];

	sntGuestWeb.controller('offerAddonOptionsController', dependencies);
})();