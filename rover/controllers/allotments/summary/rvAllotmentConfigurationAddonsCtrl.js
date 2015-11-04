sntRover.controller('rvAllotmentConfigurationAddonsCtrl', [
	'$scope',
	'$rootScope',
	'RVReservationAddonsSrv',
	'rvAllotmentConfigurationSrv',
	'ngDialog',
	function($scope, $rootScope, RVReservationAddonsSrv, rvAllotmentConfigurationSrv, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller("enhanceAllotmentStays");

		$rootScope.setPrevState = {
			title: "ALLOTMENT DETAILS",
			name: 'rover.allotments.config',
			callback: 'backToAllotmentDetails',
			scope: $scope
		};

		$scope.setHeadingTitle('Add-ons & Packages');

		var refreshAddonsScroller = function() {
			$scope.refreshScroller("enhanceAllotmentStays");
		};

		// by default load Best Sellers addon
		// Best Sellers in not a real charge code [just hard coding -1 as charge allotment id to fetch best sell addons]
		// same will be overrided if with valid charge code id
		$scope.activeAddonCategoryId = -1;
		$scope.addons = [];

		$scope.selectAddonCategory = function(category, event) {
			event.stopPropagation();
			if (category !== '') {
				$scope.activeAddonCategoryId = category.id;
				$scope.fetchAddons(category.id);
			} else {
				$scope.activeAddonCategoryId = -1;
				$scope.fetchAddons();
			}
		};

		/**
		 * function to go back to reservation details
		 */
		$scope.backToAllotmentDetails = function() {
			$scope.closeAllotmentAddonsScreen();
		};

		/**
		 *
		 */
		var successCallBackFetchAddons = function(data) {
			var inclusiveAddons = _.where(data.rate_addons, {
				is_inclusive: true
			});

			$scope.allotmentConfigData.addons.inclusiveAddons = inclusiveAddons;
			$scope.addons = [];
			$scope.$emit("hideLoader");
			// remove null values
			$scope.addons = [];
			$scope.$emit("hideLoader");
			angular.forEach(data.results, function(item) {
				if (item !== null) {
					var addonItem = {};
					addonItem.id = item.id;
					addonItem.isBestSeller = item.bestseller;
					addonItem.category = item.charge_group.name;
					addonItem.title = item.name;
					addonItem.description = item.description;
					addonItem.price = item.amount;
					addonItem.taxes = item.taxes;
					addonItem.stay = "";
					if (item.amount_type !== "") {
						addonItem.stay = item.amount_type.description;
					}
					if (item.post_type !== "") {
						if (addonItem.stay !== "") {
							addonItem.stay += " / " + item.post_type.description;
						} else {
							addonItem.stay = item.post_type.description;
						}
					}
					addonItem.amountType = item.amount_type;
					addonItem.postType = item.post_type;
					addonItem.amountTypeDesc = item.amount_type.description;
					addonItem.postTypeDesc = item.post_type.description;
					$scope.addons.push(addonItem);
				}
			});

			refreshAddonsScroller();
		};

		$scope.fetchAddons = function(paramChargeGrpId) {
			var chargeAllotmentId = paramChargeGrpId === undefined ? '' : paramChargeGrpId;
			var is_bestseller = paramChargeGrpId === undefined ? true : false;

			$scope.callAPI(RVReservationAddonsSrv.fetchAddons, {
				successCallBack: successCallBackFetchAddons,
				params: {
					'charge_group_id': chargeAllotmentId,
					'is_bestseller': is_bestseller,
					'from_date': $scope.allotmentConfigData.summary.block_from,
					'to_date': $scope.allotmentConfigData.summary.block_to,
					'is_active': true,
					'is_not_rate_only': true

				}
			});
		};

		if ($scope.isInAddonSelectionMode()) {
			$scope.fetchAddons();
		}

		/**
		 * Method used open the addons popup
		 * @return undefined
		 */
		$scope.openAddonsPopup = function() {
			ngDialog.open({
				template: '/assets/partials/allotments/summary/allotmentAddonsPopup.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		var onEnhanceSuccess = function(data) {
			$scope.allotmentConfigData.selectedAddons = data;
			$scope.computeAddonsCount();
			$scope.openAddonsPopup();
		};

		var onEnhanceFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		$scope.selectAddon = function(addon, addonCount) {
			var params = {
				"addon_id": addon.id,
				"addon_count": parseInt(addonCount),
				"id": $scope.allotmentConfigData.summary.allotment_id
			};
			var options = {
				successCallBack: onEnhanceSuccess,
				failureCallBack: onEnhanceFailure,
				params: params
			};
			$scope.callAPI(rvAllotmentConfigurationSrv.addAllotmentEnhancement, options);
		};

		var onRemoveAddonSuccess = function(data) {
			$scope.allotmentConfigData.selectedAddons = data;
			$scope.computeAddonsCount();
		};

		var onRemoveAddonFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};

		$scope.removeAddon = function(addon) {
			var params  = {
				"addon_id": addon.id,
				"id": $scope.allotmentConfigData.summary.allotment_id
			};
			var options = {
				successCallBack: onRemoveAddonSuccess,
				failureCallBack: onRemoveAddonFailure,
				params: params
			}
			$scope.callAPI(rvAllotmentConfigurationSrv.removeAllotmentEnhancement, options);
		};
	}
]);