sntRover.service('RVReservationBaseSearchSrv', ['$q', 'rvBaseWebSrvV2',
    function ($q, RVBaseWebSrvV2) {
        var that = this;
        
        this.fetchHotelDetails = function(){
            var deferred = $q.defer();
            
            that.fetchRoomTypes = function(){
                var url = 'api/room_types.json';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.roomTypes = data.results;
                    deferred.resolve(that.reservation);
                },function(errorMessage){
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };      
            
            var url = '/api/hotel_settings/show_hotel_reservation_settings';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservation = {};
                that.reservation.settings = data;
                that.fetchRoomTypes();
            },function(errorMessage){
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchCompanyCard = function(data){
            var deferred = $q.defer();      
            var url =  '/api/accounts/search_account';  
            RVBaseWebSrvV2.postJSON(url,data).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;        
        };
    }
]);