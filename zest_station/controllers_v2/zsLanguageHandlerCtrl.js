sntZestStation.controller('zsLanguageHandlerCtrl', [
    '$scope',
    'zsEventConstants',
    'zsGeneralSrv',
    function($scope, zsEventConstants,zsGeneralSrv) {

        BaseCtrl.call(this, $scope);

        var setDefaultLanguage = function(){
            _.each($scope.languageDetails, function(language){
                if($scope.zestStationData.zest_lang.default_language == language.name){
                    $scope.$parent.selectedLanguage = language;
                };
            });
            $scope.translateTo($scope.$parent.selectedLanguage.info.code);
        };
        var setlanguageListForPopUp = function(){
            $scope.languageList =[];
            _.each($scope.languageDetails, function(language){
                if($scope.zestStationData.zest_lang[language.name] == true){
                   $scope.languageList.push(language);
                };
            });
        };
        $scope.getClassForSelectedLanguage = function(language){
            if(language.name ==$scope.$parent.selectedLanguage.name){
                return "active";
            }
        };
        $scope.selectLanguage = function(language){
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