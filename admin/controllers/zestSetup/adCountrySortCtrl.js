admin.controller('ADCountrySortCtrl', ['$scope', 'ADCountrySortSrv',
	function($scope, ADCountrySortSrv) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.errorMessage = '';
		$scope.listingMode = true;
		$scope.countrySelected = "";

		//fetch country list with sorted and unsorted countries
		var fetchCountryList = function() {
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
			$scope.callAPI(ADCountrySortSrv.fetchCountries, options);
		};

		var init = function() {
			fetchCountryList();
		}();

		//add new country to sort list
		$scope.addCountryToSequence = function() {
			$scope.listingMode = false;
		};

		$scope.backClicked = function() {
			$scope.listingMode = true;
		};

		var saveSortedList = function(id, position) {
			var options = {
				params: {
					'country_id': id,
					'position': position
				},
				successCallBack: fetchCountryList
			};
			$scope.callAPI(ADCountrySortSrv.saveComponentOrder, options);
		};

		//save new country to sort list
		$scope.saveCountry = function() {
			if (_.isEmpty($scope.countrySelected)) {
				$scope.errorMessage = ["Please select a country"];
			} else {
				saveSortedList($scope.countrySelected, $scope.sortedCountries.length + 1);
			};
		};

		//delete a country from the sort list
		$scope.deleteItem = function(id, $index) {
			var options = {
				params: {
					'id': id
				},
				successCallBack: fetchCountryList
			};
			$scope.callAPI(ADCountrySortSrv.deleteItem, options);
		};

		//save new order
		var saveNewPosition = function(id, position, prevPosition) {
			_.isUndefined(position) ? "" : saveSortedList(id, position+1);
		};

		$scope.sortableOptions = {
			stop: function(e, ui) {
				if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null) {
					saveNewPosition(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
				}
			}
		};
	}
]);