angular.module('sntRover').controller('rvRateManagerCtrl_', ['$scope', '$filter', function($scope, $filter) {

    BaseCtrl.call(this, $scope);

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
        $scope.filterOpened = true;
    };

    /**
     * initialisation function
     */
    (() => {
        setHeadingAndTitle( 'RATE_MANAGER_TITLE' );
        initializeDataModel( );
    })();
}]);