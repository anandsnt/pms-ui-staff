
admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};

    var getEnabledLanguages = function(langs){
        if (!$scope.zestSettings.zest_lang){return null;};
        var langs = Object.keys($scope.zestSettings.zest_lang);
        var languages = [];
        
        if (!langs){
            return null;
        } else {
        
            for (var i in langs){
                if (langs[i].charAt(0).toUpperCase() === langs[i].charAt(0)){//is a language if [is capitalized]
                    languages.push({
                        name:    langs[i],
                        value: langs[i]
                    });
                }
            }

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
