admin.controller('ADPromotionsCtrl', [
	'$scope', '$rootScope', 'ADPromotionsSrv', 'ngTableParams', 'rates', 'ngDialog',
	function ($scope, $rootScope, ADPromotionsSrv, NgTableParams, rates, ngDialog) {


		$scope.state = {
			promotions: [],
			current: false,
			rates: rates.results
		};

		var fetchPromotions = function () {
			// Step1 : fetch existing segments
			function onFetchSuccess(data) {
				$scope.$emit('hideLoader');
				_.each(data, function (promotion) {
					promotion.assignedRates = [];
					promotion.availableRates = [];
					_.each($scope.state.rates, function (rate) {
						if (_.indexOf(promotion.linked_rates, rate.id) > -1) {
							promotion.assignedRates.push(rate);
						} else {
							promotion.availableRates.push(rate);
						}
					});
					$scope.state.promotions.push(promotion);
				});
			}
			$scope.invokeApi(ADPromotionsSrv.fetch, {}, onFetchSuccess);
		};

		var initPromotions = function () {
			$scope.promotionsList = new NgTableParams({
				page: 1, // show first page
				count: $scope.state.promotions.length, // count per page - Need to change when on pagination implemntation
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: fetchPromotions
			});
		};

		$scope.toggleActivatePromotions = function () {};

		$scope.addPromo = function () {
			$scope.state.newPromo = ADPromotionsSrv.getPromoDataModel();
			$scope.state.current = 'NEW';
		};

		$scope.getDiscountText = function (discount) {
			if (!discount.value) {
				return '';
			}
			return discount.type === 'AMOUNT' ? $rootScope.currencySymbol + discount.value : discount.value + '%';
		};

		$scope.onEditPromo = function (promotion, index) {
			$scope.state.storedPromo = angular.copy(promotion);
			$scope.state.current = index;
		};

		$scope.onCancelEdit = function (index) {
			$scope.state.promotions[index] = angular.copy($scope.state.storedPromo);
			$scope.state.current = false;
		};

		$scope.popupCalendar = function (dateNeeded) {
			$scope.dateNeeded = dateNeeded;

			ngDialog.open({
				template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
				controller: 'promotionsDatesRangeCtrl',
				className: 'ngdialog-theme-default single-date-picker',
				closeByDocument: true,
				scope: $scope
			});
		};

		$scope.cancelAddPromo = function () {
			$scope.state.current = false;
		};

		$scope.saveNewPromo = function () {};

		$scope.toggleAvailableRate = function (index) {
			if (index !== $scope.state.selectedAvailableRate) {
				$scope.state.selectedAvailableRate = index;
			} else {
				$scope.state.selectedAvailableRate = -1;
			}
		};

		$scope.toggleAssignedRate = function (index) {
			if (index !== $scope.state.selectedAssignedRate) {
				$scope.state.selectedAssignedRate = index;
			} else {
				$scope.state.selectedAssignedRate = -1;
			}
		};

		$scope.linkSelectedRate = function (promo) {
			if ($scope.state.selectedAvailableRate > -1) {
				promo.assignedRates.push(promo.availableRates.splice($scope.state.selectedAvailableRate, 1)[0]);
				$scope.state.selectedAvailableRate = -1;
			}
		};

		$scope.unlinkSelectedRate = function (promo) {
			if ($scope.state.selectedAssignedRate > -1) {
				promo.availableRates.push(promo.assignedRates.splice($scope.state.selectedAssignedRate, 1)[0]);
				$scope.state.selectedAssignedRate = -1;
			}
		};

		$scope.linkAllRates = function(promo){
			Array.prototype.push.apply( promo.assignedRates, promo.availableRates);	
			promo.availableRates = [];
			$scope.state.selectedAssignedRate = -1;
			$scope.state.selectedAvailableRate = -1;
		};

		$scope.unlinkAllRates = function(promo){
			Array.prototype.push.apply(promo.availableRates, promo.assignedRates);			
			promo.assignedRates = [];
			$scope.state.selectedAssignedRate = -1;
			$scope.state.selectedAvailableRate = -1;
		};
		initPromotions();
	}
]);