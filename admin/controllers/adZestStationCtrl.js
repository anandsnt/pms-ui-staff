
admin.controller('ADZestStationCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', function ($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit("changedSelectedMenu", 10);

    $scope.data = {};
    var zestLanguageDataCopy = {};
    $scope.fetchSettings = function () {
        var fetchSuccess = function (data) {
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

        $scope.fetchSettings();
    };

    $scope.init();


}]);
