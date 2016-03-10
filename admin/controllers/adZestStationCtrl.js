admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};


    $scope.fetchSettings = function() {
        var fetchSuccess = function(data) {
            $scope.zestSettings = data;
            $scope.$emit('hideLoader');

        };
        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };

    var checkIfFileWasAdded = function(file){
        return (!!file && file.length > 0) ? true : false;
    };

    var setUpTranslationFilesStatus = function() {
        zestLanguageDataCopy = angular.copy($scope.zestSettings.zest_lang);
        zestLanguageDataCopy.english_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.english_translations_file);
        zestLanguageDataCopy.french_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.french_translations_file);
        zestLanguageDataCopy.spanish_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.spanish_translations_file);
        zestLanguageDataCopy.german_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.german_translations_file);
        zestLanguageDataCopy.italian_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.italian_translations_file);
        zestLanguageDataCopy.castellano_translations_exists = checkIfFileWasAdded(zestLanguageDataCopy.castellano_translations_file);
    };

    $scope.saveSettings = function() {
        var saveSuccess = function() {
            $scope.zestSettings.zest_lang = angular.copy(zestLanguageDataCopy);
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
        };
        var saveFailed = function(response) {
            $scope.errorMessage = 'Failed';
            $scope.$emit('hideLoader');
        };
        setUpTranslationFilesStatus();
        var dataToSend = {
            'kiosk': {
                "home_screen": $scope.zestSettings.home_screen,
                "zest_station_message_texts": $scope.zestSettings.zest_station_message_texts,
                "zest_lang": zestLanguageDataCopy
            }

        };
        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
    };
    $scope.init = function() {
        $scope.fetchSettings();
    };

    $scope.init();


}]);