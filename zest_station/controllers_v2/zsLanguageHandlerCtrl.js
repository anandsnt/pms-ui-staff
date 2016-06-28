sntZestStation.controller('zsLanguageHandlerCtrl', [
    '$scope',
    'zsEventConstants',
    'zsGeneralSrv',
    '$translate',
    function($scope, zsEventConstants, zsGeneralSrv, $translate) {

        BaseCtrl.call(this, $scope);

        $scope.translateTo = function(lang_code, language) {
            $translate.use(lang_code);
            $scope.selectedLanguage = language;
            $scope.resetHomeScreenTimer();
            $scope.runDigestCycle();
        };

        var setDefaultLanguage = function() {

            var findTheDefaultLanguage = function() {
                    _.each($scope.languageDetails, function(language) {
                        if ($scope.zestStationData.zest_lang.default_language == language.name) {
                            $scope.$parent.selectedLanguage = language;
                        };
                    });
                    return $scope.$parent.selectedLanguage;
                }
                //if some default language is set and corresposnding file is updated
            if (!!$scope.zestStationData.zest_lang.default_language) {
                $scope.zestStationData.zest_lang.default_language = $scope.zestStationData.zest_lang.default_language;
                var language = findTheDefaultLanguage();
                //when english is set as default language and 
                //no english file is uploaded
                if ($scope.zestStationData.zest_lang.default_language === "English" && !$scope.zestStationData.zest_lang.english_translations_file_updated) {
                    $scope.translateTo('EN_snt', language);
                } else {
                    //when translated files are present
                    $scope.translateTo(language.info.code, language);
                }
            } else {
                //if no default language was set and english translation file was updated
                //use en translations. If no file was updtaed use the EN_snt file
                $scope.zestStationData.zest_lang.default_language = "English";
                var language = findTheDefaultLanguage();
                if ($scope.zestStationData.zest_lang.english_translations_file_updated) {
                    $scope.translateTo('en', language);
                } else {
                    $scope.translateTo('EN_snt', language);
                }
            };

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
            $scope.translateTo($scope.$parent.selectedLanguage.info.code, $scope.$parent.selectedLanguage);
            $scope.$parent.languageSelect();
        };

        $scope.$on('RESET_LANGUAGE', function() {
            setDefaultLanguage();
        });

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