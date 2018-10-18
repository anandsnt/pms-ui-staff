admin.controller('ADCountrySortCtrl', ['$scope', '$rootScope', '$state','ADCountrySortSrv',
	function($scope, $rootScope, $state,ADCountrySortSrv) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.errorMessage = '';
		$scope.listingMode = true;
		$scope.countrySelected = "";
		$scope.restrictedCountriesList = [];

		$scope.screenData = {
			mode: 'SORT',
			countrySearch: ''
		};
		if (!$scope.$$phase) {
			$scope.$digest();
		}

		$scope.changeModeToSortingList = function() {
			$scope.screenData.mode = 'SORT';
		};

		$scope.changeModeToRestrictionList = function() {
			$scope.screenData.mode = 'RESTRICTIONS';
		};
		/*  ************************************** SORTING ******************************************  */


		// fetch country list with sorted and unsorted countries
		var fetchSortedCountryList = function() {
			var onfetchCountriesSuccess = function(response) {
				$scope.sortedCountries = response.sorted;
				$scope.unSortedCountries = response.unsorted;
				$scope.countrySelected = "";
				$scope.listingMode = true;
			};
			var options = {
				params: {},
				successCallBack: onfetchCountriesSuccess
			};

			$scope.callAPI(ADCountrySortSrv.fetchSortedCountries, options);
		};

		// add new country to sort list
		$scope.addCountryToSequence = function() {
			$scope.listingMode = false;
		};

		$scope.backClicked = function() {
			if ($scope.screenData.mode === 'SORT') {
				if (!$scope.listingMode) {
					$scope.listingMode = true;
				} else {
					$scope.goBack($rootScope, $state);
				}
			} else {
				$scope.listingMode = true;
				$scope.screenData.mode = 'SORT';
			}
		};

		var saveSortedList = function(id, position) {
			var options = {
				params: {
					'country_id': id,
					'position': position
				},
				successCallBack: fetchSortedCountryList
			};

			$scope.callAPI(ADCountrySortSrv.saveComponentOrder, options);
		};

		// save new country to sort list
		$scope.saveCountry = function() {
			if (_.isEmpty($scope.countrySelected)) {
				$scope.errorMessage = ["Please select a country"];
			} else {
				saveSortedList($scope.countrySelected, $scope.sortedCountries.length + 1);
			}
		};

		// delete a country from the sort list
		$scope.deleteItem = function(id, $index) {
			var options = {
				params: {
					'id': id
				},
				successCallBack: fetchSortedCountryList
			};

			$scope.callAPI(ADCountrySortSrv.deleteItem, options);
		};

		// save new order
		var saveNewPosition = function(id, position, prevPosition) {
			_.isUndefined(position) ? "" : saveSortedList(id, position + 1);
		};

		$scope.sortableOptions = {
			stop: function(e, ui) {
				if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null) {
					saveNewPosition(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
				}
			}
		};

		/*  ************************************** UNSUBSCRIBE ******************************************  */

		var fetchRestrictedCountriesList = function() {
			var onfetchCountriesListSuccess = function(response) {
				$scope.restrictedCountriesList = response;
			};
			var options = {
				params: {},
				successCallBack: onfetchCountriesListSuccess
			};

			$scope.callAPI(ADCountrySortSrv.fetchRestrictedCountriesList, options);
		};

		$scope.toggleSubscription = function(country, type) {

			var onUnsubsribeSuccess = function () {
				country[type] = !country[type];
			};
			var params = angular.copy(country);
			params[type] = !params[type];

			var options = {
				params: params,
				successCallBack: onUnsubsribeSuccess
			};

			$scope.callAPI(ADCountrySortSrv.unsubscribeCountryFromList, options);
			
		};

		$scope.toggleAllSubscription = function(country) {
			var wasAllSelected = country.check_in && country.check_out && country.room_ready;
			var onUnsubsribeSuccess = function () {
				country.check_in = !wasAllSelected;
				country.check_out = !wasAllSelected;
				country.room_ready = !wasAllSelected;
			};
			var params = angular.copy(country);

			params.check_in = !wasAllSelected;
			params.check_out = !wasAllSelected;
			params.room_ready = !wasAllSelected;
			
			var options = {
				params: params,
				successCallBack: onUnsubsribeSuccess
			};

			$scope.callAPI(ADCountrySortSrv.unsubscribeCountryFromList, options);
		};

		$scope.isAAllRestrictionSelectd = function(country) {
			return country.check_in && country.check_out && country.room_ready;
		};

		$scope.isAnyRestrictionSelectd = function(country) {
			return country.check_in || country.check_out || country.room_ready;
		};

		var init = (function() {
			fetchSortedCountryList();
			fetchRestrictedCountriesList();
		}());
	}
]);