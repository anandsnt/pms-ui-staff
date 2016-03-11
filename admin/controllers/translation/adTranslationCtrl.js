admin.controller('ADTranslationCtrl',['$scope','$rootScope','$state','ADTranslationSrv','ngTableParams','$filter','availableLanguages','menuDetails', function($scope, $rootScope,$state,ADTranslationSrv, ngTableParams, $filter, availableLanguages, menuDetails){

    var getRequestParams = function() {
        var params = {};
        params.locale_id = $scope.filter.locale;
        params.menu_option_id = $scope.filter.menuOption;
        params.option_item_id = $scope.filter.item;
        return params;

    };
    var onFetchSuccess = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');

                $scope.tableParams = new ngTableParams({
                // show first page
                page: 1,
                // count per page - Need to change when on pagination implemntation
                count: $scope.data.length,
                sorting: {
                    // initial sorting
                    name: 'asc'
                }
            }, {
                // length of data
                total: $scope.data.length,
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                                        $filter('orderBy')($scope.data, params.orderBy()) :
                                        $scope.data;
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            },
            onFetchFailure = function(error){
                $scope.data = [];
                $scope.$emit('hideLoader');
            };
    var getLabelTranslations = function() {
        var params = getRequestParams();        
        $scope.invokeApi(ADTranslationSrv.getLabelTranslationForLocale, params, onFetchSuccess, onFetchFailure);
    };

    var getTranslationsForSave = function() {
        var requestData = {};
        requestData.locale_id = $scope.filter.locale;
        requestData.labels = $scope.data;
        return requestData;
    };

    $scope.clickedSave = function() {
        var onSaveSuccess = function(data) {
                $scope.$emit('hideLoader');
            },
            onSaveFailure = function(error) {
                $scope.$emit('hideLoader');
            };
        var request = getTranslationsForSave();
        $scope.invokeApi(ADTranslationSrv.saveLabelTranslationForLocale, request, onSaveSuccess, onSaveFailure);
    };

    $scope.onLocaleChange = function() {
        getLabelTranslations();
    };

    $scope.onMenuOptionChange = function() {
        getLabelTranslations();
    };

    $scope.onItemChange = function() {
        getLabelTranslations();
    };

    $scope.searchEntered = function() {
        var params = {};
        params.locale_id = $scope.filter.locale;
        params.option_item_id = $scope.filter.item;
        params.query = $scope.filter.searchText;               

        $scope.invokeApi(ADTranslationSrv.searchLabelTranslationForLocale, params, onFetchSuccess, onFetchFailure);

    };


    var init = function() {
        $scope.languages = availableLanguages;
        $scope.menuDetails = menuDetails;
        $scope.filter = {
            locale : $scope.languages.default_locale_id,
            menuOption : $scope.menuDetails.menu_options[0].id,
            item : $scope.menuDetails.menu_options[0].option_items[0].id,
            searchText : ""
        };
        
        $scope.items = $scope.menuDetails.menu_options[0].option_items;
        $scope.data = [];
        getLabelTranslations();

    };
    init();

}]);