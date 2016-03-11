angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    'rvRateManagerDataModelSrv',
    'rateMgrSelectedOrderPrefrnce',
    'rateMgrOrderValues',
    'rateTypes',
    'rates',
    function($scope,
             $filter,
             rvRateManagerDataModelSrv,
             rateMgrSelectedOrderPrefrnce,
             rateMgrOrderValues,
             rateTypes,
             rates) { 

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

        //filling the sort options & preferred one from the admin
        $scope.rateManagerDataModel.filterOptions.orderBy.selectedValue = rateMgrSelectedOrderPrefrnce.id;
        $scope.rateManagerDataModel.filterOptions.orderBy.values = rateMgrOrderValues;

        //filling the rate & rate types
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.rateTypes = rateTypes;
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.rates = rates.results;
    };

    /**
     * initialisation function
     */
    (() => {
        setHeadingAndTitle( 'RATE_MANAGER_TITLE' );

        initializeDataModel();

        //we have to open the filter on the left side
        $scope.rateManagerDataModel.filterOptions.isVisible = true;
    })();

}]);