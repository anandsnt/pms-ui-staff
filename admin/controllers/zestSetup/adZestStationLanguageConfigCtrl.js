admin.controller('adZestStationLanguageConfigCtrl',
	['$scope',
	'adZestStationLanguageConfigSrv',
	'$log',
	function($scope, adZestStationLanguageConfigSrv, $log) {

		BaseCtrl.call(this, $scope);

		$scope.detailIndex = -1

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
				listHavingValues = combinedList[1];

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

		$scope.downloadLang = function(lang) {
	        $timeout(function() {
	            $scope.downloadPromptFileName = lang + '.json';
	            var link = document.getElementById('download-link-popup'); // ie. en-download-link
	            var jwt = $window.localStorage.getItem('jwt');

	            link.href = 'staff/locales/download/' + lang + '?hotel_uuid=' + sntAuthorizationSrv.getProperty() + '&auth_token=' + jwt;
	        }, 500);
	        ngDialog.open({
	            template: '/assets/partials/zestStation/adZestStationLanguageFile.html',
	            className: 'ngdialog-theme-default single-calendar-modal',
	            scope: $scope,
	            closeByDocument: true
	        });
	    };

	    $scope.downloadPromptFileName = '';
    

	    $scope.saveLanguageEditorChanges = function() {

	        var lang = $scope.editingLanguage;

	        $scope.languageEditorData = angular.copy($scope.languageEditorDataTmp);
	        // save ref in case needed for continuing to edit
	        languagesEditedInSession[lang].json = angular.copy($scope.languageEditorData);

	        var encoded = 'data:application/json;base64,' + window.btoa(unescape(encodeURIComponent(JSON.stringify($scope.languageEditorData))));

	        // current language being edited, for saving, need to save with long-name (ie. "english" instead of "en")
	        // check for default
	        if (lang === 'en') {
	            lang = 'english';

	        } else if (lang === 'fr') {
	            lang = 'french';

	        } else if (lang === 'es') {
	            lang = 'spanish';

	        } else if (lang === 'de') {
	            lang = 'german';

	        } else if (lang === 'it') {
	            lang = 'italian';

	        } else if (lang === 'cl') {
	            lang = 'castellano';

	        } else {
	            $log.log('need to add new language code here');
	        }

	        $scope.zestSettings.zest_lang[lang + '_translations_file'] = encoded;
	        $scope.closePrompt();
	    };
	    // when editing on-screen, need to fetch the language then show on-screen
	    // if a user closes the window, we need to persist the reference in case they
	    // want to continue editing
	    var languagesEditedInSession = [];
	    var continueEditing = function(lang) {
	        if (languagesEditedInSession[lang]) {
	            return true;
	        } // else
	        return false;
	    };
	    var openEditor = function(json) {
	        // converts object into a plyable array
	        $scope.languageEditorDataTmp = angular.copy(json);

	        ngDialog.open({
	            template: '/assets/partials/zestStation/adZestStationLanguageEditor.html',
	            className: 'ngdialog-theme-default single-calendar-modal language-editor',
	            scope: $scope,
	            closeByDocument: true
	        });
	    };

	    //  track which languages were fetched/edited already, 
	    //  we dont want to re-fetch when user accidentily closes the window and needs to re-open it
	    $scope.editLang = function(lang) {

	        $scope.editingLanguage = lang;
	        // shows user an on-screen prompt, with the tags and values, so they can edit in-screen

	        if (continueEditing(lang)) {

	            $log.log('continuing to edit...');
	            openEditor(languagesEditedInSession[lang].json);
	        } else {


	            $log.log('fetching language json file for editing');

	            var options = {
	                params: {
	                    'lang': lang
	                },
	                successCallBack: function(json) {
	                    $log.log(json); // show the info in console
	                    // reference to downloaded data in case user wants to continue editing after closing window
	                    languagesEditedInSession[lang] = {
	                        'json': json
	                    };
	                    openEditor(json);
	                }
	            };

	            $scope.callAPI(ADZestStationSrv.loadTranslationFiles, options);

	        }


	    };

	    $scope.languageSelected = function(index) {
	    	$scope.detailIndex = index;
	    };

	    $scope.saveSettings = function(language) {
	    	var options = {
				params: language
			};

			$scope.callAPI(adZestStationLanguageConfigSrv.saveLanguageConfig, options);
	    	$scope.detailIndex = -1;	    	
	    };

	    $scope.cancel = function() {
	    	$log.log('language settings cancelled');
	    	$scope.detailIndex = -1;
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