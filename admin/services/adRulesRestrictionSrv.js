admin.service('ADRulesRestrictionSrv',
  [
    '$q',
    'ADBaseWebSrvV2',
    function($q, ADBaseWebSrvV2) {
    
      /*
      * To fetch rules list
      * 
      * @param {object} contains page and per_page params
      * @return {object} defer promise
      */	
      this.fetch = function(params) {
        var deferred = $q.defer(),
            url      = '/api/restriction_types',
            params   = params || {};

        ADBaseWebSrvV2.getJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };


      /*
      * To handle switch toggle
      * 
      * @param {object} contains rule id and status
      * @return {object} defer promise
      */
      this.toggleSwitch = function(data) {
        var deferred = $q.defer(),
            id       = data.id,
            data     = { 'status': data.status },
            url      = '/api/restriction_types/' + id + '/activate';

        ADBaseWebSrvV2.postJSON(url, data)
          .then(function(data) {
            deferred.resolve(data);
          },function(data){
            deferred.reject(data);
          });

        return deferred.promise;
      };

      /*
      * To fetch rules list
      * 
      * @param {object} contains page and per_page params
      * @return {object} defer promise
      */  
      this.fetchPolicy = function(params) {
        var deferred = $q.defer(),
            url      = '/api/policies';

        ADBaseWebSrvV2.getJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };

      /*
      * To fetch rules list
      * 
      * @param {object} contains page and per_page params
      * @return {object} defer promise
      */  
      this.postPolicy = function(params) {
        var deferred = $q.defer(),
            url      = '/api/policies';

        ADBaseWebSrvV2.postJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };

      /*
      * To delete a particular rule
      * 
      * @param {object} contains page and per_page params
      * @return {object} defer promise
      */  
      this.delPolicy = function(params) {
        var deferred = $q.defer(),
            url      = '/api/policies/' + params.id;

        ADBaseWebSrvV2.deleteJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };

}]);