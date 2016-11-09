admin.controller('adZestStationLanguageConfigCtrl',
	['$scope',
	'adZestStationLanguageConfigSrv',
	function($scope, adZestStationLanguageConfigSrv) {

		BaseCtrl.call(this, $scope);

		var saveNewLanguagePosition = function(languageName, position) {
			var languageListForApi = $scope.languageList.map(function(language, index) {
				return {
					'name': language.name,
					'position': index + 1 // index will be in teh order of position
				};
			});
			var options = {
				params: {
					languages: languageListForApi
				},
				successCallBack: fetchLanguageList
			};

			$scope.callAPI(adZestStationLanguageConfigSrv.saveLanguageList, options);
		};

		// when dragging stopped
		var onDragStop = function(e, ui) {
			var position = ui.item.sortable.dropindex,
				languageName = ui.item.sortable.model.name,
				prevPosition = ui.item.sortable.index;

			if (position !== null && position !== prevPosition) {
				saveNewLanguagePosition(languageName, position);
			}
		};

		// when language fetch completed
		var onFetchLanguageList = function(data) {
			var combinedList = _.partition(data.languages, { position: null }),
				nullList = combinedList[0],
				listHavingValues= combinedList[1];

			$scope.languageList = _.sortBy(listHavingValues, 'position').concat(nullList);
		};

		/**
		 * to fetch the country list
		 */
		var fetchLanguageList = function() {
			var options = {
				successCallBack: onFetchLanguageList
			};

			$scope.callAPI(adZestStationLanguageConfigSrv.fetchLanguageList, options);
		};

		/**
		 * initialization
		 * @return {undefined}
		 */
		(function() {
			$scope.languageList = [];

			// fetch the language list
			fetchLanguageList();

			// this sortable options will give us callback when dragging stopped
			$scope.sortableOptions = {
				stop: onDragStop
			};
		})();
	}
]);