sntRover.service('RMFilterOptionsSrv',['$q', 'BaseWebSrvV2', function( $q, RVBaseWebSrv){
    
    /*
    * To fetch filter options
    * @return {object} filter options
    */
    this.fetchRates = function(){
            var deferred = $q.defer();
            var url =  '/api/rates?per_page=100';    
            RVBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;
    };
    this.fetchRateTypes = function(){
            var deferred = $q.defer();
            var url =  '/api/rate_types/active';    
            RVBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            },function(data){
                deferred.reject(data);
            });
            return deferred.promise;
    };

    this.fetchCompanyCard = function(data){
        var deferred = $q.defer();      
        var url =  '/api/accounts/search_account';  
        RVBaseWebSrv.postJSON(url,data).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;        
    };


}]);