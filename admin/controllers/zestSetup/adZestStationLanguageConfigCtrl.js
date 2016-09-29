admin.controller('adZestStationLanguageConfigCtrl',
	['$scope',
	'adZestStationLanguageConfigSrv',
	function($scope, adZestStationLanguageConfigSrv){

		BaseCtrl.call(this, $scope);

		var saveNewLanguagePosition = function(languageName, position) {
			var options = {
				params: {
					'language_name': languageName, //TODO: we need to change this to id when api is comfortable to do so
					'position': position
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
				saveNewLanguagePosition(languageName, position + 1);
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