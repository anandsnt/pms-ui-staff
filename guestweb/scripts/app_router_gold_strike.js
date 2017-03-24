angular.module('sntGuestWeb').config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
        controller: 'checkOutStatusController',
        templateUrl: '/assets/common_templates/partials/MGM/GoldStrike/gwCheckoutfinal.html',
        title: 'Status - Check-out Now'
    });

}]);