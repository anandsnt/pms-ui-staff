admin.controller('ADTranslationCtrl',['$scope','$rootScope','$state','ADTranslationSrv','ngTableParams','$filter','availableLanguages','menuDetails', function($scope, $rootScope,$state,ADTranslationSrv, ngTableParams, $filter, availableLanguages, menuDetails){

    BaseCtrl.call(this, $scope);

    /*
    * Get the request params for getting the translation list for a locale
    */
    var getRequestParams = function() {
        var params = {};
        params.locale = $scope.filter.locale;
        params.menu_option_id = $scope.filter.menuOption;
        params.option_item_id = $scope.filter.item;
        return params;

    };
    var onFetchSuccess = function(data) {
                $scope.data = data;
                $scope.$emit('hideLoader');

                if (!$scope.tableParams) {
                  loadTable();
                } else {
                    $scope.tableParams.reload();
                }

            },
            onFetchFailure = function(error){
                $scope.data = [];
                $scope.$emit('hideLoader');
            };

    /*
    * Get label translations under a given item in a particular locale
    */
    var getLabelTranslations = function() {
        var params = getRequestParams();
        $scope.invokeApi(ADTranslationSrv.getLabelTranslationForLocale, params, onFetchSuccess, onFetchFailure);
    };

    /*
    * Get label translations object for save
    */
    var getTranslationsForSave = function() {
        var requestData = {};
        requestData.locale = $scope.filter.locale;
        requestData.labels = $scope.data;
        return requestData;
    };

    /*
    * Function which get invoked when save translation btn is clicked
    */
    $scope.clickedSave = function() {
        var onSaveSuccess = function(data) {
                $scope.$emit('hideLoader');
                $scope.successMessage = $filter("translate")('TRANSLATIONS_SAVED_SUCCESSFULLY');
            },
            onSaveFailure = function(error) {
                $scope.$emit('hideLoader');
                $scope.errorMessage.push(error);
            };
        var request = getTranslationsForSave();
        $scope.errorMessage = [];
        $scope.successMessage = "";
        $scope.invokeApi(ADTranslationSrv.saveLabelTranslationForLocale, request, onSaveSuccess, onSaveFailure);
    };

    /*
    * Function which get invoked when the locale is changed
    */
    $scope.onLocaleChange = function() {
        getLabelTranslations();
    };

    /*
    * Function which get invoked when the menu option is changed
    */
    $scope.onMenuOptionChange = function() {
        getLabelTranslations();
    };

    /*
    * Function which get invoked when the item under a menu option is changed
    */
    $scope.onItemChange = function() {
        getLabelTranslations();
    };

    /*
    * Searches the translation for a given locale which matched the search text
    */
    $scope.searchEntered = function() {
        var params = {};
        params.locale = $scope.filter.locale;
        params.option_item_id = $scope.filter.item;
        params.query = $scope.filter.searchText;

        $scope.invokeApi(ADTranslationSrv.getLabelTranslationForLocale, params, onFetchSuccess, onFetchFailure);

    };

    /*
    * Sets the value of translation for a given label when entered
    */
    $scope.onTranslationChange = function(id, value) {
        var translation = _.find($scope.data, function(trans) {
                                return trans.id == id;
                            });
        translation.value = value;
    };

    /*
    * Loads the table which shows the translation of various labels
    */
    var loadTable = function() {
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
    };

    /*
    * Initialize the controller
    */
    var init = function() {
        $scope.languages = availableLanguages;
        $scope.menuDetails = menuDetails;
        $scope.filter = {
            locale : $scope.languages.default_locale,
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