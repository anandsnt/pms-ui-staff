admin.controller('ADPromotionsCtrl', [
	'$scope', '$rootScope', 'ADPromotionsSrv', 'ngTableParams', 'activeRates', 'ngDialog', '$filter',
	function($scope, $rootScope, ADPromotionsSrv, NgTableParams, rates, ngDialog, $filter) {


		$scope.state = {
			promotions: [],
			current: -1,
			rates: rates.results,
			usePromos: false
		};

		$scope.filterRates = function(promo) {
			promo.assignedRates = [];
			promo.availableRates = [];
			_.each($scope.state.rates, function(rate) {
				if (ADPromotionsSrv.shouldShowRate(rate, promo.from_date, promo.to_date)) {
					if (_.indexOf(promo.linked_rates, rate.id) > -1) {
						promo.assignedRates.push(rate);
					} else {
						promo.availableRates.push(rate);
					}
				}
			});
		};

		var fetchPromotions = function() {
			// Step1 : fetch existing segments
			function onFetchSuccess(data) {
				$scope.$emit('hideLoader');
				$scope.state.promotions = [];
				$scope.state.usePromos = data.is_use_promotions;
				_.each(data.promotions, function(promo) {
					promo.assignedRates = [];
					promo.availableRates = [];
					_.each($scope.state.rates, function(rate) {
						if (ADPromotionsSrv.shouldShowRate(rate, promo.from_date, promo.to_date)) {
							if (_.indexOf(promo.linked_rates, rate.id) > -1) {
								promo.assignedRates.push(rate);
							} else {
								promo.availableRates.push(rate);
							}
						}
					});
					$scope.state.promotions.push(promo);
				});
			}
			$scope.invokeApi(ADPromotionsSrv.fetch, {}, onFetchSuccess);
		};

		var initPromotions = function() {
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

		$scope.toggleActivatePromotions = function() {
			$scope.invokeApi(ADPromotionsSrv.togglePromotions, {
				is_use_promotions: !!$scope.state.usePromos
			}, function() {
				$scope.$emit('hideLoader');
				$rootScope.isPromoActive = !!$scope.state.usePromos;
			});
		};

		$scope.addPromo = function() {
			$scope.state.newPromo = ADPromotionsSrv.getPromoDataModel();
			$scope.state.newPromo.availableRates = angular.copy($scope.state.rates);
			$scope.state.newPromo.assignedRates = [];
			$scope.state.current = 'NEW';
		};

		$scope.getDiscountText = function(discount) {
			if (!discount.value) {
				return '';
			}
			return discount.type === 'amount' ? $rootScope.currencySymbol + discount.value : discount.value + '%';
		};

		$scope.onEditPromo = function(promotion, index) {
			$scope.state.storedPromo = angular.copy(promotion);
			$scope.state.current = index;
		};

		$scope.onCancelEdit = function(index) {
			$scope.state.promotions[index] = angular.copy($scope.state.storedPromo);
			$scope.state.current = -1;
		};

		$scope.popupCalendar = function(dateNeeded) {
			$scope.dateNeeded = dateNeeded;

			ngDialog.open({
				template: '/assets/partials/rates/addonsDateRangeCalenderPopup.html',
				controller: 'promotionsDatesRangeCtrl',
				className: 'ngdialog-theme-default single-date-picker',
				closeByDocument: true,
				scope: $scope
			});
		};

		$scope.cancelAddPromo = function() {
			$scope.state.current = -1;
		};

		$scope.toggleActivation = function(promo){
			promo.is_active = !promo.is_active;
			$scope.updatePromo(promo);
		};

		$scope.save = function() {
			$scope.invokeApi(ADPromotionsSrv.save, {
				name: $scope.state.newPromo.name,
				category: "rate", // Hard coded to differentiate from the beacon promos.
				from_date: $filter('date')($scope.state.newPromo.from_date, "yyyy-MM-dd"),
				to_date: $filter('date')($scope.state.newPromo.from_date, "yyyy-MM-dd"),
				discount_type: $scope.state.newPromo.discount.type,
				discount_value: $scope.state.newPromo.discount.value,
				linked_rates: _.pluck($scope.state.newPromo.assignedRates,'id'),
				description: $scope.state.newPromo.description
			}, function() {
				$scope.$emit('hideLoader');
				$scope.state.current = -1;
				fetchPromotions();
			});
		};

		$scope.updatePromo = function(promo){
			$scope.invokeApi(ADPromotionsSrv.update, {
				id: promo.id,
				name: promo.name,
				category: "rate", // Hard coded to differentiate from the beacon promos.
				from_date: $filter('date')(promo.from_date, "yyyy-MM-dd"),
				to_date: $filter('date')(promo.from_date, "yyyy-MM-dd"),
				discount_type: promo.discount.type,
				discount_value: promo.discount.value,
				linked_rates: _.pluck(promo.assignedRates,'id'),
				description: promo.description,
				is_active: promo.is_active
			}, function() {
				$scope.$emit('hideLoader');
				$scope.state.current = -1;
				fetchPromotions();
			});
		};

		$scope.deletePromo = function(promo){
			$scope.invokeApi(ADPromotionsSrv.delete, {
				id: promo.id
			}, function() {
				$scope.$emit('hideLoader');
				$scope.state.current = -1;
				fetchPromotions();
			});
		};

		$scope.toggleAvailableRate = function(index) {
			if (index !== $scope.state.selectedAvailableRate) {
				$scope.state.selectedAvailableRate = index;
			} else {
				$scope.state.selectedAvailableRate = -1;
			}
		};

		$scope.toggleAssignedRate = function(index) {
			if (index !== $scope.state.selectedAssignedRate) {
				$scope.state.selectedAssignedRate = index;
			} else {
				$scope.state.selectedAssignedRate = -1;
			}
		};

		$scope.linkSelectedRate = function(promo) {
			if ($scope.state.selectedAvailableRate > -1) {
				promo.assignedRates.push(promo.availableRates.splice($scope.state.selectedAvailableRate, 1)[0]);
				$scope.state.selectedAvailableRate = -1;
			}
		};

		$scope.unlinkSelectedRate = function(promo) {
			if ($scope.state.selectedAssignedRate > -1) {
				promo.availableRates.push(promo.assignedRates.splice($scope.state.selectedAssignedRate, 1)[0]);
				$scope.state.selectedAssignedRate = -1;
			}
		};

		$scope.linkAllRates = function(promo) {
			Array.prototype.push.apply(promo.assignedRates, promo.availableRates);
			promo.availableRates = [];
			$scope.state.selectedAssignedRate = -1;
			$scope.state.selectedAvailableRate = -1;
		};

		$scope.unlinkAllRates = function(promo) {
			Array.prototype.push.apply(promo.availableRates, promo.assignedRates);
			promo.assignedRates = [];
			$scope.state.selectedAssignedRate = -1;
			$scope.state.selectedAvailableRate = -1;
		};


		initPromotions();
	}
]);