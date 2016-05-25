sntGuestWeb.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('checkOutStatus', {
        url: '/checkOutStatus',
        controller: 'checkOutStatusController',
        templateUrl: '/assets/common_templates/partials/MGM/Aria/gwCheckoutfinal.html',
        title: 'Status - Check-out Now'
    }).state('roomNotToSell', {
        url: '/roomNotToSell',
        templateUrl: '/assets/checkin/partials/MGM/roomNotToSell.html',
        controller: 'roomNotToSellController',
        title: 'Room Assign Failed'
    });
}]);
