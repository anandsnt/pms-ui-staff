
admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', 'ngDialog', '$timeout', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, ngDialog, $timeout) {
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};
    
    var setLanguageDisplayNames = function(langs){
        /*
         * Using this to display language as seen in zest station
         * once we add an API (display name) variable
         * we can remove this reference, -CICO-27814
         */
        for (var i in langs){
            if (langs[i].value === 'Castellano'){
                langs[i].name = 'Castellano';
            }
            if (langs[i].value === 'English'){
                langs[i].name = 'English';
            }
            if (langs[i].value === 'French'){
                langs[i].name = 'Français';
            }
            if (langs[i].value === 'German'){
                langs[i].name = 'Deutsch';
            }
            if (langs[i].value === 'Italian'){
                langs[i].name = 'Italiano';
            }
            if (langs[i].value === 'Spanish'){
                langs[i].name = 'Español';
            }
        }
        return langs;
    };
    
    $scope.updateDefaultLanguageDropdown = function(){
        console.info('update lang dropdown');
        $scope.enabledLangs = getEnabledLanguages();
        validateDefaultLang();
    };
    
    var validateDefaultLang = function(){
        var lang = $scope.zestSettings.zest_lang.default_language;
        var enabledLanguages = getEnabledLanguages();
        var isValid = false;
        for (var i in enabledLanguages){
            if (lang === enabledLanguages[i].value){
                isValid = true;
            }
        }
        if (!isValid){
            $scope.zestSettings.zest_lang.default_language = '';
        }
    };
    
    $scope.hasFileUpdatedOrUploading = function(name){
        if ($scope.zestSettings && $scope.zestSettings.zest_lang){
            if ($scope.zestSettings.zest_lang[name+'_translations_file_updated'] ||
                $scope.zestSettings.zest_lang[name+'_translations_file']){return true;}
            return false;
        } else return false;
    };

    $scope.hasKeyImageFileUpdatedOrUploading = function(name){
        if ($scope.zestSettings && $scope.zestSettings.key_create_file_uploaded){
            if ($scope.zestSettings.key_create_file_uploaded !== ''){return true;}
            return false;
        } else return false;
    };
    
    var getEnabledLanguages = function(){
        if (!$scope.zestSettings.zest_lang){return null;};
        var langs = Object.keys($scope.zestSettings.zest_lang);
        var languages = [];
        if (!langs){
            return null;
        } else {
            /*
            * For a language to be set as Default,
            * it should be Enabled and have an uploaded file,
            * otherwise the user shouldnt be allowed to set it to default
            */
            var isCapitalizedProperty, isEnabled, hasFileUpdatedOrUploading, langName;
            for (var i in langs){
                
                isCapitalizedProperty = langs[i].charAt(0).toUpperCase() === langs[i].charAt(0);
                isEnabled = $scope.zestSettings.zest_lang[langs[i]];
                langName = langs[i].toLowerCase();
                
                hasFileUpdatedOrUploading = $scope.hasFileUpdatedOrUploading(langName);
                if (isCapitalizedProperty && isEnabled && hasFileUpdatedOrUploading){//is a language if [is capitalized] and enabled
                    languages.push({
                        value: langs[i]
                    });
                }
            }
            languages = setLanguageDisplayNames(languages);
            
            return languages;
        }
    };
    
    var setupDefaultLanguageDropdown = function(){
        $scope.enabledLangs = getEnabledLanguages();
            if ($scope.enabledLangs === null){
                $scope.defaultLangsDivClass = 'overlay';
            } else {
                $scope.defaultLangsDivClass = '';
                if (!$scope.zestSettings.zest_lang.default_language || $scope.zestSettings.zest_lang.default_language === ''){
                    $scope.zestSettings.zest_lang.default_language = '';
                }
            }
    };
    
    var fetchZestStationData =  function(){
        
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
    var checkIfFileWasAdded = function(file){
        return (!!file && file.length > 0) ? true : false;
    };

    var setUpTranslationFilesStatus = function() {
        zestLanguageDataCopy = angular.copy($scope.zestSettings.zest_lang);
        checkIfFileWasAdded(zestLanguageDataCopy.english_translations_file) ? zestLanguageDataCopy.english_translations_file_updated = true : "";
        checkIfFileWasAdded(zestLanguageDataCopy.french_translations_file)  ? zestLanguageDataCopy.french_translations_file_updated = true :"";
        checkIfFileWasAdded(zestLanguageDataCopy.spanish_translations_file) ? zestLanguageDataCopy.spanish_translations_file_updated = true : "" ;
        checkIfFileWasAdded(zestLanguageDataCopy.german_translations_file)  ? zestLanguageDataCopy.german_translations_file_updated = true :"";
        checkIfFileWasAdded(zestLanguageDataCopy.italian_translations_file) ? zestLanguageDataCopy.italian_translations_file_updated = true :"";
        checkIfFileWasAdded(zestLanguageDataCopy.castellano_translations_file) ? zestLanguageDataCopy.castellano_translations_file_updated = true : "";
    };

    $scope.saveSettings = function() {
        var saveSuccess = function() {
            $scope.zestSettings.zest_lang = angular.copy(zestLanguageDataCopy);
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
            $scope.goBackToPreviousState();
        };
        setUpTranslationFilesStatus();
        
        var dataToSend = {
            'kiosk': $scope.zestSettings
        };
        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess);
    };

    var makeTextFile = function (text) {
        //just makes a downloadable text file blob
        var data = new Blob([text], {type: 'text/plain'});
        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.

        //textFile ref can be used if doing a temp storage of a downloaded file, not needed at this point
       // if (textFile !== null) {
        //  window.URL.revokeObjectURL(textFile);
        //}
        var textFile = window.URL.createObjectURL(data);
        return textFile;
    };

    $scope.downloadPromptFileName = '';
    var downloadLangFile = function(lang, dataFile){
        //make json file into a downloadable string
        var dataStr = JSON.stringify(dataFile);
        var link;

        if($scope.isChrome){
            link = document.getElementById(lang+'-download-link');//ie. en-download-link
            link.href = makeTextFile(dataStr);
            link.click();//auto init the actual download link(url)
        } else {
             //in safari it should just open in new window if clicked
             $timeout(function(){
                $scope.downloadPromptFileName = lang+'.json';
                link = document.getElementById('download-link-popup');//ie. en-download-link
                link.href = makeTextFile(dataStr);
             },500);
             ngDialog.open({
                template: '/assets/partials/zestStation/adZestStationLanguageFile.html',
                className: 'ngdialog-theme-default single-calendar-modal',
                scope: $scope,
                closeByDocument: true
            });
        }
    };
    $scope.closePrompt = function(){
        ngDialog.close();
    };

    $scope.downloadLang = function(lang){
        var onSuccess = function(dataFile){
            $scope.$emit('hideLoader');
            downloadLangFile(lang, dataFile);
        }

        var onFailure = function(dataFile){
            //TODO, add errorMessage to this controller
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADZestStationSrv.fetchLangFile, {'lang':lang}, onSuccess, onFailure);
    };
    $scope.isChrome = (window.navigator.userAgent.toLowerCase().indexOf("chrome") !== -1);

    $scope.init = function() {
        fetchSettings();
    };

    $scope.init();


}]);
