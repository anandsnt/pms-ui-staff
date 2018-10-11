admin.controller('ADRatePromotionsCtrl', [
	'$scope', 'ADPromotionsSrv', '$rootScope',
	function($scope, ADPromotionsSrv, $rootScope) {

		$scope.state = {
			availablePromotions: [],
			assignedPromotions: [],
			selectedAvailablePromotion: -1,
			selectedAssignedPromotion: -1
		};

		$scope.toggleAvailablePromotion = function(index) {
			if (index !== $scope.state.selectedAvailablePromotion) {
				$scope.state.selectedAvailablePromotion = index;
			} else {
				$scope.state.selectedAvailablePromotion = -1;
			}
		};

		$scope.toggleAssignedPromotion = function(index) {
			if (index !== $scope.state.selectedAssignedPromotion) {
				$scope.state.selectedAssignedPromotion = index;
			} else {
				$scope.state.selectedAssignedPromotion = -1;
			}
		};

		$scope.initRatePromotions = function() {
			var onFetchSuccess = function(data) {
				$scope.state.availablePromotions = [];
				$scope.state.assignedPromotions = [];
				_.each(data.promotions, function(promo) {
					var promoDetails = _.findWhere(data.promotion_rates, {
						promotion_id: promo.id
					});

					if (promoDetails) {
						$scope.state.assignedPromotions.push(promo);
					} else {
						$scope.state.availablePromotions.push(promo);
					}
				});
				$scope.$emit('hideLoader');
			};

			if (!!$scope.rateData && !!$scope.rateData.id) {
				$scope.invokeApi(ADPromotionsSrv.fetchRatePromos, $scope.rateData.id, onFetchSuccess);
			}
		};

		$scope.linkSelectedPromotion = function() {
			if ($scope.state.selectedAvailablePromotion > -1) {
				$scope.state.assignedPromotions.push($scope.state.availablePromotions.splice($scope.state.selectedAvailablePromotion, 1)[0]);
				$scope.state.selectedAvailablePromotion = -1;
			}
		};
		$scope.unlinkSelectedPromotion = function() {
			if ($scope.state.selectedAssignedPromotion > -1) {
				$scope.state.availablePromotions.push($scope.state.assignedPromotions.splice($scope.state.selectedAssignedPromotion, 1)[0]);
				$scope.state.selectedAssignedPromotion = -1;
			}

		};
		$scope.linkAllPromotions = function() {
			Array.prototype.push.apply($scope.state.assignedPromotions, $scope.state.availablePromotions);
			$scope.state.availablePromotions = [];
			$scope.state.selectedAssignedPromotion = -1;
			$scope.state.selectedAvailablePromotion = -1;

		};
		$scope.unlinkAllPromotions = function() {
			Array.prototype.push.apply($scope.state.availablePromotions, $scope.state.assignedPromotions);
			$scope.state.assignedPromotions = [];
			$scope.state.selectedAssignedPromotion = -1;
			$scope.state.selectedAvailablePromotion = -1;
		};

		$scope.saveRatePromotions = function() {
			$scope.invokeApi(ADPromotionsSrv.updateRatePromos, {
				id: $scope.rateData.id,
				promos: {
					linked_promotion_ids: _.pluck($scope.state.assignedPromotions, "id")
				}
			}, function() {
				$scope.$emit('hideLoader');
				// Navigate to next level. If date ranges are available move to config rate screen
				// If no date range added, move to add_date_range screen
				var menuName = "ADD_NEW_DATE_RANGE";

				if ($scope.rateData.date_ranges.length > 0) {
					var dateRangeId = $scope.rateData.date_ranges[$scope.rateData.date_ranges.length - 1].id;

					menuName = dateRangeId;
					$rootScope.$broadcast("needToShowDateRange", dateRangeId);
				}
				$scope.$emit("changeMenu", menuName);
			});
		};

		// CICO-56662
		var listener = $scope.$on('INIT_PROMOTIONS', function() {
			$scope.initRatePromotions();
		});

		$scope.$on('$destroy', listener );
	}
]);
