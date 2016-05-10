sntZestStation.controller('zsLanguageHandlerCtrl', [
    '$scope',
    'zsEventConstants',
    'zsGeneralSrv',
    function($scope, zsEventConstants, zsGeneralSrv) {

        BaseCtrl.call(this, $scope);

        var setDefaultLanguage = function() {
            _.each($scope.languageDetails, function(language) {
                if ($scope.zestStationData.zest_lang.default_language == language.name) {
                    $scope.$parent.selectedLanguage = language;
                };
            });
            if (!!$scope.$parent.selectedLanguage) {
                //if no default language is selected and englsih file 
                //is updated. use it else use the EN_snt
                if ($scope.zestStationData.zest_lang.english_translations_file_updated) {
                    $scope.translateTo('en')
                } else {
                    $scope.translateTo('EN_snt');
                }
            } else {
                //if some default language is set and corresposnding file is updated
                $scope.translateTo($scope.$parent.selectedLanguage.info.code);
            }

        };
        var setlanguageListForPopUp = function() {
            $scope.languageList = [];
            _.each($scope.languageDetails, function(language) {
                if ($scope.zestStationData.zest_lang[language.name] == true) {
                    $scope.languageList.push(language);
                };
            });
        };
        $scope.getClassForSelectedLanguage = function(language) {
            if (language.name == $scope.$parent.selectedLanguage.name) {
                return "active";
            }
        };
        $scope.selectLanguage = function(language) {
            $scope.$parent.selectedLanguage = language;
            $scope.translateTo($scope.$parent.selectedLanguage.info.code);
            $scope.$parent.languageSelect();
        };

        /**
         * [initializeMe description]
         * @return {[type]} [description]
         */
        var initializeMe = function() {
            $scope.languageDetails = zsGeneralSrv.returnLanguageList();
            setlanguageListForPopUp();
            setDefaultLanguage();
        };
        initializeMe();

    }
]);