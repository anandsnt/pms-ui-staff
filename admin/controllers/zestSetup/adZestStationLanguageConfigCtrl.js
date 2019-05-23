admin.controller('adZestStationLanguageConfigCtrl',
	['$scope',
	'adZestStationLanguageConfigSrv',
	'sntAuthorizationSrv',
	'$log',
	'$timeout',
	'ngDialog',
	'$window',
	function($scope, adZestStationLanguageConfigSrv, sntAuthorizationSrv, $log, $timeout, ngDialog, $window) {

		BaseCtrl.call(this, $scope);

		$scope.detailIndex = -1;

		var saveNewLanguagePosition = function(languageName, position) {
			var languageListForApi = $scope.languageList.map(function(language, index) {
				return {
					'id': language.id,
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

		// when language list fetch completed
		var onFetchLanguageList = function(data) {
			var combinedList = _.partition(data.languages, { position: null }),
				nullList = combinedList[0],
				listHavingValues = combinedList[1];

			$scope.languageList = _.sortBy(listHavingValues, 'position').concat(nullList);
			$scope.detailIndex = -1;
			$scope.isAddMode = false;
		};

		/**
		 * to fetch the language list
		 */
		var fetchLanguageList = function() {
			var options = {
				successCallBack: onFetchLanguageList
			};

			$scope.callAPI(adZestStationLanguageConfigSrv.fetchLanguageList, options);
		};

		// when language fetch completed
		var onFetchLanguage = function(data) {
			$scope.selectedLanguage = data;
		};

		$scope.languageSelected = function(index) {
			var options = {
				params: $scope.languageList[index],
				successCallBack: onFetchLanguage
			};

			$scope.callAPI(adZestStationLanguageConfigSrv.fetchLanguage, options);
			$scope.isAddMode = false;
			$scope.detailIndex = index;
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

			$scope.selectedLanguage.translations_file = encoded;
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

		$scope.searchbar = {
	        value: ''
	    };


		// when editing a tags value with some filter
	    // if the text is not in the tag/value, the field
	    // may disappear, but if we track what is being editing/
	    // has-focus, we can allow that tag to stay until user is done editing
	    $scope.editingTag = '';
	    $scope.editingTagKey = function(k) {
	        $scope.editingTag = k;
	    };

	    $scope.showResult = function(key, value) {
	        // show key/value as a result if returning true
	        // hide the field if user is searching/filtering
	        // and neither match the value entered
	        // 
	        var v = $scope.searchbar.value.toLowerCase(),
	            k = key.toLowerCase(),
	            txt = value.toLowerCase();

	        if ($scope.editingTag === key) { // see editingTagKey comments
	            return 'true';
	        } else if (v.length === 0) {
	            return 'true';
	        } else if (k.indexOf(v) !== -1) {
	            return 'true';
	        } else if (txt.indexOf(v) !== -1) {
	            return 'true';
	        }
	        return 'false';
	    };

		//  track which languages were fetched/edited already,
		//  we dont want to re-fetch when user accidentily closes the window and needs to re-open it
		$scope.editLang = function(lang) {
			$scope.editingLanguage = lang;
			// shows user an on-screen prompt, with the tags and values, so they can edit in-screen
			if (continueEditing(lang)) {
				$log.log('continuing to edit...');
				openEditor(languagesEditedInSession[lang].json);
			} else if ($scope.selectedLanguage.translation_file_updated) {
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

				$scope.callAPI(adZestStationLanguageConfigSrv.loadTranslationFiles, options);
			} 
		};

		$scope.toggleLanguage = function(language, isChecked) {
			$scope.isAddMode = false;
			language.active = isChecked;
			$scope.saveSettings(language);
		};

		$scope.saveSettings = function(language) {
			if (language.translations_file) {
				language.translation_file_updated = true;

				languagesEditedInSession[language.name] = null;
				
			}

			var options = {
				params: language
			};

			options.successCallBack = $scope.isAddMode ? saveNewLanguagePosition : fetchLanguageList;

			if ($scope.detailIndex === -1) {
				options.failureCallBack = function(errorMessage) {
					$scope.fetchedFailed(errorMessage);
					fetchLanguageList();
				};
			}

			if ($scope.isAddMode) {
				$scope.callAPI(adZestStationLanguageConfigSrv.createLanguageConfig, options);
			}
			else {
				$scope.callAPI(adZestStationLanguageConfigSrv.saveLanguageConfig, options);
			}
		};

		$scope.cancel = function() {
			$log.log('language settings cancelled');
			$scope.detailIndex = -1;
			if ($scope.isAddMode) {
				$scope.languageList.shift();
				$scope.isAddMode = false;
			}
		};

		$scope.closePrompt = function() {
			ngDialog.close();
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
			if (window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1) {
				$scope.saveAsText = 'Save-As';
			} else {
				$scope.saveAsText = 'Download Linked File As';
			}
		})();
	}
]);