angular.module('sntPay').service('sntShijiGatewaySrv', ['$q', '$http',
    function($q, $http) {
        var service = this;

        service.initiatePayment = function(reservationId, payLoad) {
            return $http.post('api/reservations/' + reservationId + '/submit_payment/', payLoad);
        };

    }
]);