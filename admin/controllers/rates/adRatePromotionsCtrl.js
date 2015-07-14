admin.controller('ADRatePromotionsCtrl', [
	'$scope', 'ADPromotionsSrv',
	function($scope, ADPromotionsSrv) {

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
				_.each(data.promotion_rates, function(promo) {
					var promoDetails = _.findWhere(data.promotions, {
						id: promo.promotion_id
					});
					if (promoDetails) {
						if (promo.is_linked) {
							$scope.state.assignedPromotions.push(promoDetails);
						} else {
							$scope.state.availablePromotions.push(promoDetails);
						}
					}
				});
			};
			$scope.invokeApi(ADPromotionsSrv.fetchRatePromos, $scope.rateData.id, onFetchSuccess);
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
			},function(){
				$scope.$emit('hideLoader');
			});
		};

		$scope.initRatePromotions();
	}
]);