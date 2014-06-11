sntRover.service('RVReservationSummarySrv', ['$q', 'rvBaseWebSrvV2',
    function ($q, rvBaseWebSrvV2) {
        var that = this;

        this.reservationData = {};
        this.reservationData.demographics = {};
        this.fetchPaymentMethods = function(){
            var deferred = $q.defer();
            var url = '/staff/payments/addNewPayment.json';
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            }); 
            return deferred.promise;
        };


        this.fetchDemographicMarketSegments = function(deferred){
            var url = '/api/market_segments';
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservationData.demographics.markets = data.markets;
            }, function(errorMessage){
                deferred.reject(errorMessage);
            }); 
        };

        this.fetchDemographicSources = function(deferred){
            var url = '/api/sources';  //TODO: Whether we need active list only or all
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservationData.demographics.sources = data.sources;
            }, function(errorMessage){
                deferred.reject(errorMessage);
            });
        };

        this.fetchDemographicOrigins = function(deferred){
            var url = '/api/booking_origins';
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservationData.demographics.origins = data.booking_origins;
            }, function(errorMessage){
                deferred.reject(errorMessage);
            });
        };

        this.fetchDemographicReservationTypes = function(deferred){            
            var url = '/api/reservation_types.json';
            rvBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservationData.demographics.reservationTypes = data.reservation_types;                
                deferred.resolve(that.reservationData);
            }, function(errorMessage){
                deferred.reject(errorMessage);
            });

        }; 

        this.fetchInitialData = function(){
            //Please be care. Only last function should resolve the data
            var deferred = $q.defer();
            that.fetchDemographicMarketSegments(deferred);
            that.fetchDemographicOrigins(deferred);
            that.fetchDemographicSources(deferred);
            that.fetchDemographicReservationTypes(deferred);
            return deferred.promise;
        }

        this.saveReservation = function(data){
            var deferred = $q.defer();
            var url = '/api/reservations';
            rvBaseWebSrvV2.postJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            }); 
            return deferred.promise;
        }
        

    }
]);