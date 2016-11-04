angular.module('sntGuestWeb').config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
        controller: 'checkOutStatusController',
        templateUrl: '/assets/common_templates/partials/MGM/NationalHarbor/gwCheckoutfinal.html',
        title: 'Status - Check-out Now'
    });

}]);