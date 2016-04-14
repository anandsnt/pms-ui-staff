
admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};
    
    var setLanguageDisplayNames = function(langs){
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
        };
        setUpTranslationFilesStatus();
        
        var dataToSend = {
            'kiosk': $scope.zestSettings
        };
        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess);
    };
    $scope.init = function() {
        fetchSettings();
    };

    $scope.init();


}]);
