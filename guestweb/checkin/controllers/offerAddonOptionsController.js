(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, checkinAddonService, $sce) {

		var selectedAddon = {},
			setSelectedAddon = function(addon, isSingleAddonAvailable) {
				addon.title = isSingleAddonAvailable ? 'Would you like to add ' + addon.title + ' to your stay?' : addon.title;
				$scope.selectedAddon = addon;
				$scope.showPurchaseStatus = false;
				$scope.purchaseStatusText = '';
				$scope.mode = 'DETAILED_VIEW';
				$scope.selectedAddonDescrition = $sce.trustAsHtml($scope.selectedAddon.description);
				$(document.body).scrollTop(0);
			};

		$scope.addonSelected = function(selectedAddon) {
			setSelectedAddon(selectedAddon, false);
		};

		$scope.purchaseAddon = function() {

			if ($scope.selectedAddon.type === 'per room' || $scope.selectedAddon.type === 'flat rate') {
				if ($scope.selectedAddon.quantity > 0) {
					$scope.purchaseStatusText = 'Thanks for the purchase. Your addon will be added to your account.';
					$scope.showPurchaseStatus = true;
				} else {
					$scope.doneClicked();
				}
			} else {
				$scope.selectedAddon.is_selected = !$scope.selectedAddon.is_selected;
				$scope.purchaseStatusText = 'Thanks for the purchase. Your addon will be added to your account.';
				$scope.showPurchaseStatus = true;
			}
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
		'$scope', '$rootScope', '$state', 'checkinAddonService', '$sce',
		offerAddonOptionsController
	];

	sntGuestWeb.controller('offerAddonOptionsController', dependencies);
})();