
admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', 'ngDialog', '$timeout', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, ngDialog, $timeout) {
    BaseCtrl.call(this, $scope);
    $scope.$emit('changedSelectedMenu', 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};
    
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
        console.info('update lang dropdown');
        $scope.enabledLangs = getEnabledLanguages();
        validateDefaultLang();
    };
    
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
                $scope.zestSettings.zest_lang[name + '_translations_file']) {return true;}
            return false;
        } else {return false;}
    };

    $scope.hasKeyImageFileUpdatedOrUploading = function(name) {
        if ($scope.zestSettings && $scope.zestSettings.key_create_file_uploaded) {
            if ($scope.zestSettings.key_create_file_uploaded !== '' && $scope.zestSettings.key_create_file_uploaded !== 'false' && $scope.zestSettings.key_create_file_uploaded.indexOf('/logo.png') === -1) {return true;}
            return false;
        } else {return false;}
    };
    
    var getEnabledLanguages = function() {
        if (!$scope.zestSettings.zest_lang) {return null;}
        var langs = Object.keys($scope.zestSettings.zest_lang);
        var languages = [];

        if (!langs) {
            return null;
        } else {
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
            }
            languages = setLanguageDisplayNames(languages);
            
            return languages;
        }
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
        
        var fetchSuccess = function (data) {
            $scope.$emit('hideLoader');
            $scope.zestStationData = data;
            setupDefaultLanguageDropdown();
            
        };

        $scope.invokeApi(ADZestStationSrv.fetchZestStationData, {}, fetchSuccess);
    };
    
    
    var fetchSettings = function () {
        var fetchSuccess = function (data) {
            $scope.$emit('hideLoader');
            $scope.zestSettings = data;
            fetchZestStationData();
        };

        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };
    var checkIfFileWasAdded = function(file) {
        return !!file && file.length > 0 ? true : false;
    };

    var setUpTranslationFilesStatus = function() {
        zestLanguageDataCopy = angular.copy($scope.zestSettings.zest_lang);
        checkIfFileWasAdded(zestLanguageDataCopy.english_translations_file) ? zestLanguageDataCopy.english_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.french_translations_file) ? zestLanguageDataCopy.french_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.spanish_translations_file) ? zestLanguageDataCopy.spanish_translations_file_updated = true : '' ;
        checkIfFileWasAdded(zestLanguageDataCopy.german_translations_file) ? zestLanguageDataCopy.german_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.italian_translations_file) ? zestLanguageDataCopy.italian_translations_file_updated = true : '';
        checkIfFileWasAdded(zestLanguageDataCopy.castellano_translations_file) ? zestLanguageDataCopy.castellano_translations_file_updated = true : '';
    };

    $scope.saveSettings = function(dontReturn) {
        // /handling for the api for now, api has some issue with the default image setting back to snt logo...
        // api dev should resolve this at some point
        if ($scope.zestSettings.key_create_file_uploaded.indexOf('/logo.png') !== -1) {
            $scope.zestSettings.key_create_file_uploaded = 'false';
        }
        var saveSuccess = function() {
            $scope.zestSettings.zest_lang = angular.copy(zestLanguageDataCopy);
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
            if (!dontReturn) {
                $scope.goBackToPreviousState();    
            }
            
        };

        setUpTranslationFilesStatus();
        
        var dataToSend = {
            'kiosk': $scope.zestSettings
        };

        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess);
    };

    $scope.closePrompt = function() {
        ngDialog.close();
    };
    $scope.downloadPromptFileName = '';
    $scope.downloadLang = function(lang) {
        $timeout(function() {
            $scope.downloadPromptFileName = lang + '.json';
            var link = document.getElementById('download-link-popup');// ie. en-download-link

            link.href = 'staff/locales/download/' + lang + '.json';
        }, 500);
        ngDialog.open({
            template: '/assets/partials/zestStation/adZestStationLanguageFile.html',
            className: 'ngdialog-theme-default single-calendar-modal',
            scope: $scope,
            closeByDocument: true
        });
    };

    $scope.saveLanguageEditorChanges = function() {
        // current language being edited, for saving, need to save with long-name (ie. "english" instead of "en")
        var lang = $scope.editingLanguage,
            encoded = 'data:application/json;base64,' + window.btoa(unescape(encodeURIComponent(JSON.stringify($scope.languageEditorData))));
            
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

        } else if (lang === 'cs') {
            lang = 'castellano';

        } else {
            console.log('need to add new language code here');
        }
      
        $scope.zestSettings.zest_lang[lang + '_translations_file'] = encoded;
        $scope.closePrompt();
    };
    //  track which languages were fetched/edited already, 
    //  we dont want to re-fetch when user accidentily closes the window and needs to re-open it
    $scope.editLang = function(lang) {

        $scope.editingLanguage = lang;
        // shows user an on-screen prompt, with the tags and values, so they can edit in-screen

        $scope.showLoader();
        var jsonRefUrl = 'staff/locales/download/' + lang + '.json';

        console.log('going to fetch language json file for editing');

        $.getJSON(jsonRefUrl, function(json) {
            var loaderScope = angular.element('#loading-spinner').scope();

            loaderScope.hasLoader = false;
            console.log(json); // this will show the info it in firebug console
            loaderScope.$digest();

            // converts object into a plyable array
            $scope.languageEditorData = json;

            ngDialog.open({
                template: '/assets/partials/zestStation/adZestStationLanguageEditor.html',
                className: 'ngdialog-theme-default single-calendar-modal language-editor',
                scope: $scope,
                closeByDocument: true
            });

        });
    };

    $scope.searchbar = {
        value: ''
    };

    $scope.showLoader = function() {
        $scope.$emit('showLoader');
    };

    $scope.showResult = function(key, value) {
        var v = $scope.searchbar.value.toLowerCase();
        k = key.toLowerCase(),
        txt = value.toLowerCase();

        if (v.length === 0) {
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
