admin.controller('ADRatePromotionsCtrl', [
	'$scope', 'ADPromotionsSrv',
	function ($scope, ADPromotionsSrv) {

		$scope.state = {
			availablePromotions: [],
			assignedPromotions: [],
			selectedAvailablePromotion: -1,
			selectedAssignedPromotion: -1
		};


		$scope.toggleAvailablePromotion = function (index) {
			if (index !== $scope.state.selectedAvailablePromotion) {
				$scope.state.selectedAvailablePromotion = index;
			} else {
				$scope.state.selectedAvailablePromotion = -1;
			}
		};

		$scope.toggleAssignedPromotion = function (index) {
			if (index !== $scope.state.selectedAssignedPromotion) {
				$scope.state.selectedAssignedPromotion = index;
			} else {
				$scope.state.selectedAssignedPromotion = -1;
			}
		};

		$scope.initRatePromotions = function () {
			var onFetchSuccess = function (data) {
				$scope.state.availablePromotions = data;
			};
			$scope.invokeApi(ADPromotionsSrv.fetch, {}, onFetchSuccess);
		};

		$scope.linkSelectedPromotion = function () {
			if ($scope.state.selectedAvailablePromotion > -1) {
				$scope.state.assignedPromotions.push($scope.state.availablePromotions.splice($scope.state.selectedAvailablePromotion, 1)[0]);
				$scope.state.selectedAvailablePromotion = -1;
			}
		};
		$scope.unlinkSelectedPromotion = function () {
			if ($scope.state.selectedAssignedPromotion > -1) {
				$scope.state.availablePromotions.push($scope.state.assignedPromotions.splice($scope.state.selectedAssignedPromotion, 1)[0]);
				$scope.state.selectedAssignedPromotion = -1;
			}

		};
		$scope.linkAllPromotions = function () {
			Array.prototype.push.apply($scope.state.assignedPromotions, $scope.state.availablePromotions);
			$scope.state.availablePromotions = [];
			$scope.state.selectedAssignedPromotion = -1;
			$scope.state.selectedAvailablePromotion = -1;

		};
		$scope.unlinkAllPromotions = function () {
			Array.prototype.push.apply($scope.state.availablePromotions, $scope.state.assignedPromotions);
			$scope.state.assignedPromotions = [];
			$scope.state.selectedAssignedPromotion = -1;
			$scope.state.selectedAvailablePromotion = -1;
		};

		$scope.saveRatePromotions = function () {
			// TODO: Implement API call to save the promotions for the rate here!
		};

		$scope.initRatePromotions();
	}
]);