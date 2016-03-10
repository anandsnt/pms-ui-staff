admin.controller('ADTranslationCtrl',['$scope','$rootScope','$state','ADTranslationSrv','ngTableParams','$filter','availableLanguages','menuDetails', function($scope, $rootScope,$state,ADTranslationSrv, ngTableParams, $filter, availableLanguages, menuDetails){

    var getRequestParams = function() {
        var params = {};
        params.locale_id = $scope.filter.locale;
        params.menu_option_id = $scope.filter.menuOption;
        params.option_item_id = $scope.filter.item;
        return params;

    };
    var getLabelTranslations = function() {
        var params = getRequestParams();
        var onFetchSuccess = function(data) {
                $scope.translations = data;
            },
            onFetchFailure = function(error){
                $scope.translations = [];
            };
        $scope.invokeApi(ADTranslationSrv.getLabelTranslationForLocale, params, onFetchSuccess, onFetchFailure);
    };
    var init = function() {
        $scope.languages = availableLanguages;
        $scope.menuDetails = menuDetails;
        $scope.filter = {
            locale : $scope.languages.default_locale_id,
            menuOption : $scope.menuDetails.menu_options[0].id,
            item : $scope.menuDetails.menu_options[0].option_items[0].id
        };
        $scope.searchTxt = "";
        $scope.items = $scope.menuDetails.menu_options[0].option_items;
        $scope.translations = [];
        getLabelTranslations();

    };
    init();

}]);