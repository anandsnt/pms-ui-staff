admin.controller('ADCountrySortCtrl', ['$scope', 'ADCountrySortSrv',
	function($scope, ADCountrySortSrv) {

		BaseCtrl.call(this, $scope);
		$scope.successMessage = '';
		$scope.listingMode = true;
		$scope.countrySelected = "";

        var fetchCountryList = function(){
        		var onfetchCountriesSuccess = function(response) {
				$scope.sortedCountries = response.sorted;
				$scope.unSortedCountries = response.unsorted;
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
		$scope.addCountryToSequence = function() {
			$scope.listingMode = false;
		};

		$scope.backClicked = function() {
			$scope.listingMode = true;
		};

		$scope.saveCountry = function() {
			var successCallBack = function() {
				fetchCountryList();
			};
			var selectedCountryIndex = _.findIndex($scope.sortedCountries, function(country) {
				return country.id == $scope.countrySelected
			});
			//push only if country wasnt added before
			if (selectedCountryIndex === -1) {
				successCallBack();
				var options = {
					params: {
						'country_id' : $scope.countrySelected,
						'position' : 1
					}
				}
				$scope.callAPI(ADCountrySortSrv.saveComponentOrder, options);
			} else {
				//do nothing
			}
			$scope.countrySelected = "";
			$scope.listingMode = true;

		};

		$scope.deleteItem = function(id, $index) {
			var successCallBack = function() {
				$scope.sortedCountries = _.without($scope.sortedCountries, _.findWhere($scope.sortedCountries, {
					id: id
				}));
			};
			successCallBack();
		};

		/* save new order*/

		var saveNewPosition = function(id, position, prevPosition) {

			var options = {
				params: {
					'country_id' : id,
					'position' : position
				}
			};
			$scope.callAPI(ADCountrySortSrv.saveComponentOrder, options);
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