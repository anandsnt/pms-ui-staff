angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    'rvRateManagerDataModelSrv',
    'rateMgrSelectedOrderPrefrnce',
    'rateMgrOrderValues',
    'rateTypes',
    'rates',
    '$rootScope',
    function($scope,
             $filter,
             rvRateManagerDataModelSrv,
             rateMgrSelectedOrderPrefrnce,
             rateMgrOrderValues,
             rateTypes,
             rates,
             $rootScope) { 

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
     * to have animation while opening & closing
     */
    $rootScope.$on('ngDialog.opened', function(e, $dialog) {
        setTimeout(function(){
          $dialog.addClass('modal-show');
        },100);
    });

    /**
     * initialisation function
     */
    (() => {
        setHeadingAndTitle( 'RATE_MANAGER_TITLE' );

        initializeDataModel();

        const {render} = ReactDOM; 
        render(
            <RateManagerRoot/>,
            document.querySelector('#rate-manager .content')
        );


    })();

}]);