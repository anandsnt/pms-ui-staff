(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, $stateParams, checkinAddonService, $sce, sntGuestWebSrv, checkinDetailsService) {
		var amountTypesLabels = [],
			postTypeLabels = [],
			selectedAddon = {},
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
			return addon.amount_type === 'Per Room' || $scope.selectedAddon.amount_type === 'Flat Rate';
		};

		$scope.purchaseAddon = function() {

			var addonAdditionSuccess = function() {
				if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
					$scope.selectedAddon.quantity = angular.copy($scope.selectedAddonQuantity);
					if ($scope.selectedAddon.quantity > 0) {
						$scope.selectedAddon.is_selected = true;
						$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
						$scope.showPurchaseStatus = true;
					} else {
						$scope.selectedAddon.is_selected = false;
						$scope.doneClicked();
					}
				} else {
					$scope.selectedAddon.is_selected = !$scope.selectedAddon.is_selected;
					if ($scope.selectedAddon.is_selected) {
						$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
						$scope.showPurchaseStatus = true;
					} else {
						$scope.doneClicked();
					}
				}
				// update the data in srv with newly added addon
				var checkinDetails = checkinDetailsService.getResponseData();
				var newAddon = {
					'id': $scope.selectedAddon.addon_id,
					'name': $scope.selectedAddon.name
				};

				checkinDetails.addons_data.push(newAddon);
				checkinDetailsService.setResponseData(checkinDetails);
				$(document.body).scrollTop(0);
			};


			var params = {
				'addon_id': $scope.selectedAddon.addon_id
			};

			if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
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

		$scope.removeAddon = function() {

			var addonRemovalSuccess = function() {
				if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
					$scope.selectedAddon.is_selected = false;
					$scope.selectedAddon.quantity = 0;
				} else {
					$scope.selectedAddon.is_selected = !$scope.selectedAddon.is_selected;
				}
				// update the data in srv by removing deleted addon
				var checkinDetails = checkinDetailsService.getResponseData();

				checkinDetails.addons_data = _.filter(checkinDetails.addons_data, function(addon) {
					return addon.id !== $scope.selectedAddon.addon_id;
				});
				checkinDetailsService.setResponseData(checkinDetails);
				$scope.doneClicked();
				$(document.body).scrollTop(0);
			}


			var params = {
				'addon_id': $scope.selectedAddon.addon_id
			};
			if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
				params.quantity = parseInt($scope.selectedAddonQuantity);
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
			$scope.isLoading = false;
		};

		var getAddonAdminSettings =  function(){
			checkinAddonService.getAddonAdminSettings().then(function(response) {
				amountTypesLabels = response.amount_types;
				postTypeLabels = response.post_types;
				handleLabelMappings();
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		};

		var fetchExistingAddonsSucess = function(allAvailableAddons, existingAddons) {
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
			var fetchScreenDetails = function(screenId) {
				return sntGuestWebSrv.extractAddonScreenDetails(screenId);
			};
			var setText = function(cmsString, defaultString) {
				return cmsString.length > 0 ? cmsString : defaultString;
			};
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
			$scope.addonPurchaseMsg = setText(fetchScreenDetails("ADDON-PURCHASE-MSG").screen_title, "Would you like to add @addon_name@ to your stay?.");

			$scope.addonList = [];
			$scope.isLoading = true;
			$scope.selectedAddon = {};
			$scope.quantityList = _.range(6);
			var params = {};
			checkinAddonService.getAddonList(params).then(function(response) {
				var existingAddons = checkinDetailsService.getResponseData().addons_data;
				fetchExistingAddonsSucess(response.addons, existingAddons);
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