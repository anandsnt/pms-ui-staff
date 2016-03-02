admin.controller('ADLanguagesCtrl', ['$scope', 'ADLanguagesSrv', '$state', 'ngTableParams', '$filter', '$stateParams',
    function($scope, ADLanguagesSrv, $state, ngTableParams, $filter, $stateParams) {

    BaseCtrl.call(this, $scope);
    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    /**
     * Fetch languages list from server
     * @param {Object} parameters for call
     * @return {undefined}
     */
    var fetchData = function() {
        var onFetchSuccess = function(data) {
            $scope.$emit('hideLoader');
            $scope.languageData = data;
        };
        $scope.invokeApi(ADLanguagesSrv.fetch, {}, onFetchSuccess);
    };

    // on change activation
    $scope.onToggleActivation = function(language) {
        language.is_show_on_guest_card = !language.is_show_on_guest_card;
        $scope.updateLanguage(language);
    };

    $scope.updateLanguage = function(language) {
        var onToggleSuccess = function(data) {
            $scope.$emit('hideLoader');
        };
        $scope.invokeApi(ADLanguagesSrv.updateLanguage, language, onToggleSuccess);
    };

    $scope.toggleLanguagesUse = function() {
        var onToggleSuccess = function(data) {
            $scope.$emit('hideLoader');
        };
        $scope.languageData.show_language_field = !$scope.languageData.show_language_field;
        $scope.invokeApi(ADLanguagesSrv.toggleLanguagesUse, {
            show_language_field: $scope.languageData.show_language_field
        }, onToggleSuccess);
    };

    var init = function() {
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;
        $scope.languageData = {
            languages: [],
            show_language_field: true
        };

        $scope.itemList = new ngTableParams(
            {
                page: 1, // show first page
                count: $scope.languageData.languages.length,
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: fetchData
            }
        );
    };

    init();

}]);