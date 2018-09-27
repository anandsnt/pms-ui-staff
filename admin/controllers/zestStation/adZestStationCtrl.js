admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', 'ngDialog', '$timeout', '$log', 'sntAuthorizationSrv', 'configurableImagesData', function($scope, $rootScope, $state, $stateParams, ADZestStationSrv, $filter, ngDialog, $timeout, $log, sntAuthorizationSrv, configurableImagesData) {
    BaseCtrl.call(this, $scope);

    $scope.data = {};
    $scope.configurableImages = configurableImagesData.configurable_images;
    
    var zestLanguageDataCopy = {};

    $scope.uploadedIcon = {
        preview_createkey: false,
        createkey: ''
    };

    var setLanguageDisplayNames = function(langs) {
        /*
         * Using this to display language as seen in zest station
         * once we add an API (display name) variable
         * we can remove this reference, -CICO-27814
         */
        for (var i in langs) {
            if (langs[i].value === 'Castellano') {
                langs[i].name = 'Castellano';
            }
            if (langs[i].value === 'English') {
                langs[i].name = 'English';
            }
            if (langs[i].value === 'French') {
                langs[i].name = 'Français';
            }
            if (langs[i].value === 'German') {
                langs[i].name = 'Deutsch';
            }
            if (langs[i].value === 'Italian') {
                langs[i].name = 'Italiano';
            }
            if (langs[i].value === 'Spanish') {
                langs[i].name = 'Español';
            }
        }
        return langs;
    };

    $scope.updateDefaultLanguageDropdown = function() {
        $scope.enabledLangs = getEnabledLanguages();
        validateDefaultLang();
    };

    $scope.offlineReconnectValueList = [
        {
            'name': '10',
            'value': '10'
        }, {
            'name': '20',
            'value': '20'
        }, {
            'name': '30',
            'value': '30'
        }, {
            'name': '40',
            'value': '40'
        }, {
            'name': '50',
            'value': '50'
        }, {
            'name': '60',
            'value': '60'
        }
    ];

    var validateDefaultLang = function() {
        var lang = $scope.zestSettings.zest_lang.default_language;
        var enabledLanguages = getEnabledLanguages();
        var isValid = false;

        for (var i in enabledLanguages) {
            if (lang === enabledLanguages[i].value) {
                isValid = true;
            }
        }
        if (!isValid) {
            $scope.zestSettings.zest_lang.default_language = '';
        }
    };

    $scope.hasFileUpdatedOrUploading = function(name) {
        if ($scope.zestSettings && $scope.zestSettings.zest_lang) {
            if ($scope.zestSettings.zest_lang[name + '_translations_file_updated'] ||
                $scope.zestSettings.zest_lang[name + '_translations_file']) {
                return true; }
            return false;
        }
        return false;
    };
    $scope.hasKeyImageFileUpdatedOrUploading = function() {
        if ($scope.zestSettings && $scope.zestSettings.key_create_file_uploaded) {
            if ($scope.zestSettings.key_create_file_uploaded !== '' && $scope.zestSettings.key_create_file_uploaded !== 'false' && $scope.zestSettings.key_create_file_uploaded.indexOf('/logo.png') === -1) {
                $scope.uploadedIcon.createkey = $scope.zestSettings.key_create_file_uploaded;
                return true; 
            }
            return false;
        }
        return false;
    };

    var getEnabledLanguages = function() {
        if (!$scope.zestSettings.zest_lang) {
            return null; }
        var langs = Object.keys($scope.zestSettings.zest_lang);
        var languages = [];

        if (!langs) {
            return null;
        } 
            /*
            * For a language to be set as Default,
            * it should be Enabled and have an uploaded file,
            * otherwise the user shouldnt be allowed to set it to default
            */
        var isCapitalizedProperty, isEnabled, hasFileUpdatedOrUploading, langName;

        for (var i in langs) {
                
            isCapitalizedProperty = langs[i].charAt(0).toUpperCase() === langs[i].charAt(0);
            isEnabled = $scope.zestSettings.zest_lang[langs[i]];
            langName = langs[i].toLowerCase();
                
            hasFileUpdatedOrUploading = $scope.hasFileUpdatedOrUploading(langName);
            if (isCapitalizedProperty && isEnabled && hasFileUpdatedOrUploading) {// is a language if [is capitalized] and enabled
                languages.push({
                    value: langs[i]
                });
            }
                // dont allow user to check a language unless it has a file associated attached
            if (isCapitalizedProperty && !hasFileUpdatedOrUploading) {
                $scope.zestSettings.zest_lang[langs[i]] = false;
            }
                
        }
        
        languages = setLanguageDisplayNames(languages);

        return languages;

    };

    var setupDefaultLanguageDropdown = function() {
        $scope.enabledLangs = getEnabledLanguages();
        if ($scope.enabledLangs === null) {
            $scope.defaultLangsDivClass = 'overlay';
        } else {
            $scope.defaultLangsDivClass = '';
            if (!$scope.zestSettings.zest_lang.default_language || $scope.zestSettings.zest_lang.default_language === '') {
                $scope.zestSettings.zest_lang.default_language = '';
            }
        }
    };

    var fetchZestStationData = function() {

        var fetchSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.zestStationData = data;
            setupDefaultLanguageDropdown();

        };

        $scope.invokeApi(ADZestStationSrv.fetchZestStationData, {}, fetchSuccess);
    };


    var fetchSettings = function() {
        var fetchSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.zestSettings = data;
            fetchZestStationData();
        };

        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };
    var checkIfFileWasAdded = function(file) {
        return !!(!!file && file.length > 0);
    };

    var setUpTranslationFilesStatus = function() {
        zestLanguageDataCopy = angular.copy($scope.zestSettings.zest_lang);
        checkIfFileWasAdded(zestLanguageDataCopy.english_translations_file) ? zestLanguageDataCopy.english_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.french_translations_file) ? zestLanguageDataCopy.french_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.spanish_translations_file) ? zestLanguageDataCopy.spanish_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.german_translations_file) ? zestLanguageDataCopy.german_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.italian_translations_file) ? zestLanguageDataCopy.italian_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.castellano_translations_file) ? zestLanguageDataCopy.castellano_translations_file_updated = true : '';
    };

    $scope.saveSettings = function() {

        var apiParams  = angular.copy($scope.zestSettings);

        var saveSuccess = function() {
            $scope.zestSettings.zest_lang = angular.copy(zestLanguageDataCopy);
            $scope.successMessage = $filter('translate')('SETTINGS_HAVE_BEEN_SAVED');
            $scope.$emit('hideLoader');
            angular.element(document.querySelector('.content-scroll')).scrollTop(0);
        };

        var saveImages = function() {
            $scope.configurableImages = $scope.configurableImages || {};

            var imageApiParams = angular.copy($scope.configurableImages);

            // pass '' for deleting image
            _.each(Object.keys(imageApiParams), function(key) {
                if (!imageApiParams[key]) {
                    imageApiParams[key] = '';
                }
            });

            options = {
                params: {
                    'configurable_images': imageApiParams
                },
                successCallBack: saveSuccess
            };

            $scope.callAPI(ADZestStationSrv.saveImages, options);

        };

        setUpTranslationFilesStatus();

        var dataToSend = {
            'kiosk': apiParams
        };

        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveImages);
    };

    $scope.closePrompt = function() {
        ngDialog.close();
    };
    $scope.downloadPromptFileName = '';
    $scope.downloadLang = function(lang) {
        $timeout(function() {
            $scope.downloadPromptFileName = lang + '.json';
            var link = document.getElementById('download-link-popup'); // ie. en-download-link

            link.href = 'staff/locales/download/' + lang + '?hotel_uuid=' + sntAuthorizationSrv.getProperty();
        }, 500);
        ngDialog.open({
            template: '/assets/partials/zestStation/adZestStationLanguageFile.html',
            className: 'ngdialog-theme-default single-calendar-modal',
            scope: $scope,
            closeByDocument: true
        });
    };

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

    $scope.showLoader = function() {
        $scope.$emit('showLoader');
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

    $scope.saveAsText = '';
    $scope.isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') !== -1;

    $scope.goToUsers = function() {
        $state.go('admin.users');
    };

    $scope.init = function() {
        fetchSettings();
        if ($scope.isChrome) {
            $scope.saveAsText = 'Save-As';
        } else {
            $scope.saveAsText = 'Download Linked File As';
        }
    };

    $scope.init();


}]);
