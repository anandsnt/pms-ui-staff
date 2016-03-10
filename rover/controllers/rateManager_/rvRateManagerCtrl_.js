angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    'rvRateManagerDataModelSrv',
    function($scope,
             $filter,
             rvRateManagerDataModelSrv) {

    BaseCtrl.call(this, $scope);

    $scope.toggleFilterOption = () => { $scope.rateManagerDataModel.filterOptions.isVisible = ! $scope.rateManagerDataModel.filterOptions.isVisible };

    /**
     * to set the heading and title
     * @param nonTranslatedTitle {String}
     */
    var setHeadingAndTitle = (nonTranslatedTitle) => {
        var title = $filter('translate')(nonTranslatedTitle);
        $scope.setTitle(title);
        $scope.heading = title;
    };

    /**
     * to set initial data model
     */
    var initializeDataModel = () => {
        $scope.rateManagerDataModel = rvRateManagerDataModelSrv.getDataModel();
    };

    /**
     * initialisation function
     */
    (() => {
        setHeadingAndTitle( 'RATE_MANAGER_TITLE' );

        initializeDataModel();
    })();

}]);