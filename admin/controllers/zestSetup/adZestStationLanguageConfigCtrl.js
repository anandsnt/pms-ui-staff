admin.controller('adZestStationLanguageConfigCtrl',
	['$scope',
	'adZestStationLanguageConfigSrv',
	function($scope, adZestStationLanguageConfigSrv){

		BaseCtrl.call(this, $scope);

		var saveNewLanguagePosition = function(languageName, position, prevPosition) {
			var languageListForApi = $scope.languageList.map(function(language, index){
				return {
					'name': language.name,
					'position': index + 1 //index will be in teh order of position
				}
			});
			var options = {
				params: {
					language_list: languageListForApi
				},
				successCallBack: fetchLanguageList
			};
			$scope.callAPI(adZestStationLanguageConfigSrv.saveLanguageList, options);
		};

		//when dragging stopped
		var onDragStop = function(e, ui) {
			var position = ui.item.sortable.dropindex,
				languageName = ui.item.sortable.model.name,
				prevPosition = ui.item.sortable.index;

			if (position && position !== prevPosition) {
				saveNewLanguagePosition(languageName, position, prevPosition);
			}
		};

		//when language fetch completed
		var onFetchLanguageList = function(data) {
			$scope.languageList = data.language_list;
		}

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
		(function(){
			$scope.languageList = [];

			//fetch the language list
			fetchLanguageList();

			//this sortable options will give us callback when dragging stopped
			$scope.sortableOptions = {
				stop: onDragStop
			};
		})();
	}
]);