sntRover.service('RVReservationSummarySrv', ['$q', 'RVBaseWebSrv',
    function ($q, RVBaseWebSrv) {
        var that = this;

        this.fetchPaymentMethods = function(){
            var deferred = $q.defer();
            var url = '/staff/payments/addNewPayment.json';
            RVBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            }); 
            return deferred.promise;
        };

    }
]);