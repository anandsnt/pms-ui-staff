(function() {
	var offerAddonOptionsController = function($scope, $rootScope, $state, checkinAddonService) {

		var selectedAddon = {},
			setSelectedAddon = function(addon, isSingleAddonAvailable) {
				addon.title = isSingleAddonAvailable ? 'Would you like to add ' + addon.title + ' to your stay?' : addon.title;
				$scope.selectedAddon = addon;
				$scope.showPurchaseStatus = false;
				$scope.purchaseStatusText = '';
				$scope.mode = 'DETAILED_VIEW';
			};

		/**
		 * [addonSelected user selected one of the addons]
		 * @param  {[type]} selectedAddonId [description]
		 * @return {[type]}                 [description]
		 */
		$scope.addonSelected = function(selectedAddonId) {
			selectedAddon = _.find($scope.addonList, function(addon) {
				return addon.id === selectedAddonId;
			});
			setSelectedAddon(selectedAddon, false);
		};

		/**
		 * [removeAddedAddons once you have purchased addon, remove it from list]
		 * @param  {[type]} selectedAddon [description]
		 * @return {[type]}               [description]
		 */
		var removeAddedAddons = function(selectedAddon) {
			//remove the purchased addon from list
			$scope.addonList = _.reject($scope.addonList, function(addon) {
				return addon.id == selectedAddon.id;
			});
		};
		$scope.purchaseAddon = function() {
			$scope.purchaseStatusText = 'Thanks for the purchase. Your addon will be added to your account.';
			$scope.showPurchaseStatus = true;
			removeAddedAddons(selectedAddon);
		};

		$scope.doneClicked = function() {
			if ($scope.addonList.length > 0) {
				$scope.mode = 'LIST_VIEW';
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
		'$scope', '$rootScope', '$state', 'checkinAddonService',
		offerAddonOptionsController
	];

	sntGuestWeb.controller('offerAddonOptionsController', dependencies);
})();