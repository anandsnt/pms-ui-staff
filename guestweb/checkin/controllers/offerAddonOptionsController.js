(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, checkinAddonService, $sce, sntGuestWebSrv) {

		var selectedAddon = {},
			setSelectedAddon = function(addon, isSingleAddonAvailable) {
				$scope.selectedAddon = addon;
				$scope.showPurchaseStatus = false;
				$scope.purchaseStatusText = '';
				$scope.mode = 'DETAILED_VIEW';
				$scope.selectedAddonDescrition = $sce.trustAsHtml($scope.selectedAddon.description);
				if ($scope.addonList.length > 1) {
					$scope.addonPurchaseMsgForDisplay = $scope.addonPurchaseMsg.replace("@addon_name@", $scope.selectedAddon.title);
				} else {
					$scope.addonPurchaseMsgForDisplay = $scope.selectedAddon.title;
				}
				$(document.body).scrollTop(0);
			};

		$scope.addonSelected = function(selectedAddon) {
			setSelectedAddon(selectedAddon, false);
		};

		$scope.purchaseAddon = function() {

			if ($scope.selectedAddon.type === 'per room' || $scope.selectedAddon.type === 'flat rate') {
				if ($scope.selectedAddon.quantity > 0) {
					$scope.purchaseStatusText = angular.copy($scope.addonSuccesMessage);
					$scope.showPurchaseStatus = true;
				} else {
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

		var addonFetchSuccess = function(addons) {
			var selectedAddonIds = [5]; //already selected list for the reservation
			_.each(selectedAddonIds, function(selectedAddonId) {
				addons = _.reject(addons, function(addon) {
					return addon.id == selectedAddonId;
				});
			});
			_.each(addons, function(addon) {
				addon.is_selected = false;
				addon.quantity = 0;
			});
			$scope.addonList = addons;
			if (addons.length === 0) {
				$rootScope.skipedAddons = true;
				$state.go('preCheckinStatus');
			} else if (addons.length === 1) {
				var isSingleAddonAvailable = true;
				selectedAddon = addons[0];
				setSelectedAddon(selectedAddon, isSingleAddonAvailable);
			} else {
				$scope.mode = 'LIST_VIEW';
			}
		};
		var setText = function(cmsString, defaultString) {
			return cmsString.length > 0 ? cmsString : defaultString;
		};
		(function() {
			var screenCMSDetails1 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-LIST");
			$scope.addonListTitle = setText(screenCMSDetails1.screen_title, "Enhance Your Stay");

			var screenCMSDetails2 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-CONTINUE");
			$scope.addonContinue = setText(screenCMSDetails2.screen_title, "Continue");

			var screenCMSDetails3 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-SKIP");
			$scope.addonSkip = setText(screenCMSDetails3.screen_title, "No Thanks.");

			var screenCMSDetails4 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-PURCHASE");
			$scope.addonPurchase = setText(screenCMSDetails4.screen_title, "Add");

			var screenCMSDetails5 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-REMOVE");
			$scope.addonRemove = setText(screenCMSDetails5.screen_title, "Remove");

			var screenCMSDetails6 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-FAILURE");
			$scope.addonFailureMessage = setText(screenCMSDetails6.screen_title, "Sorry, This addon can't be added to your reservation");

			var screenCMSDetails7 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-SUCCESS");
			$scope.addonSuccesMessage = setText(screenCMSDetails7.screen_title, "Thanks for the purchase. Your addon will be added to your account.");

			var screenCMSDetails8 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-SELECT-QTY");
			$scope.addonSelectQty = setText(screenCMSDetails8.screen_title, "Select quantity");

			var screenCMSDetails9 = sntGuestWebSrv.extractAddonScreenDetails("ADDON-PURCHASE-MSG");
			$scope.addonPurchaseMsg = setText(screenCMSDetails9.screen_title, "Would you like to add @addon_name@ to your reservation?.");
		})();

		(function() {
			$scope.addonList = [];
			$scope.isLoading = true;
			$scope.quantityList = _.range(21);
			var params = {};
			checkinAddonService.getAddonList(params).then(function(response) {
				$scope.isLoading = false;
				addonFetchSuccess(response.addons);
			}, function() {
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
		})();
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', 'checkinAddonService', '$sce', 'sntGuestWebSrv',
		offerAddonOptionsController
	];

	sntGuestWeb.controller('offerAddonOptionsController', dependencies);
})();