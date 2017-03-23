(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, checkinAddonService, $sce, sntGuestWebSrv) {

		var selectedAddon = {},
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
				$(document.body).scrollTop(0);
			};


			var params = {
				'addon_id': $scope.selectedAddon.addon_id
			};

			if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
				params.quantity = parseInt($scope.selectedAddon.quantity);
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
				} else {
					$scope.selectedAddon.is_selected = !$scope.selectedAddon.is_selected;
				}
				$scope.doneClicked();
				$(document.body).scrollTop(0);
			}


			var params = {
				'addon_id': $scope.selectedAddon.addon_id
			};
			if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
				params.quantity = parseInt($scope.selectedAddon.quantity);
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

		$scope.doneClicked = function() {
			if ($scope.addonList.length > 1) {
				$scope.mode = 'LIST_VIEW';
				$(document.body).scrollTop(0);
			} else {
				$rootScope.skipedAddons = true;
				$state.go('preCheckinStatus');
			}
		};

		$scope.noThanksClicked = function() {
			if ($scope.addonList.length === 1 || $scope.mode === 'LIST_VIEW') {
				$rootScope.skipedAddons = true;
				$state.go('preCheckinStatus');
			} else {
				$scope.mode = 'LIST_VIEW';
			}
		};

		$scope.hideAddAddonButton = function() {
			if (typeof $scope.selectedAddon === "undefined") {
				return false;
			} else if ($scope.isAddonFlatOrRoomType($scope.selectedAddon)) {
				return $scope.selectedAddon.is_selected && parseInt($scope.selectedAddon.quantity) === 0;
			} else {
				return $scope.selectedAddon.is_selected
			}
		};

		var addonFetchSuccess = function(addons) {
			// var selectedAddonIds = [5]; //already selected list for the reservation
			// _.each(selectedAddonIds, function(selectedAddonId) {
			// 	addons = _.reject(addons, function(addon) {
			// 		return addon.id == selectedAddonId;
			// 	});
			// });
			addons = _.reject(addons, function(addon) {
				return !addon.zest_web_active;
			});
			_.each(addons, function(addon) {
				addon.is_selected = false;
				addon.quantity = 0;
			});
			$scope.addonList = addons;
			if (addons.length === 0) {
				// no addons present
				$rootScope.skipedAddons = true;
				$state.go('preCheckinStatus');
			} else if (addons.length === 1) {
				// single addon
				var isSingleAddonAvailable = true;
				selectedAddon = addons[0];
				setSelectedAddon(selectedAddon, isSingleAddonAvailable);
			} else {
				// Multi addons
				$scope.mode = 'LIST_VIEW';
			}
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
			$scope.addonRemovalFailureMessage = setText(fetchScreenDetails("ADDON-FAILURE").screen_title, "Sorry, Something went wrong.");
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
				$scope.isLoading = false;
				addonFetchSuccess(response.addons);
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
			// TO DO
			$scope.upsellDisplayOrderAmountFirst = true; // "amount_then_post_type";
		})();
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', 'checkinAddonService', '$sce', 'sntGuestWebSrv',
		offerAddonOptionsController
	];

	sntGuestWeb.controller('offerAddonOptionsController', dependencies);
})();