admin.service('ADRulesRestrictionSrv', [
    '$q',
    'ADBaseWebSrvV2','ADBaseWebSrv',
    function($q, ADBaseWebSrvV2,ADBaseWebSrv) {
    
        /*
        * To fetch post types reference values
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.fetchRefVales = function(params) {
            var deferred = $q.defer(),
                url      = '/api/reference_values';

            ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
        * To fetch hotel setting - currency
        *
        * @return {object} defer promise
        */
        this.fetchHotelCurrency = function(params) {
            var deferred = $q.defer(),
                url      = '/api/hotel_settings';

            ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

        /*
        * To fetch restrictions list
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.fetchRestrictions = function(params) {
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
        * To activate or deactivate a restriction
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
        * To fetch rules list for a particular restriction
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.fetchCancellationRules = function(params) {
            var deferred = $q.defer(),
                url      = '/api/cancellation_policies';

            ADBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };
        /*
        * To fetch rules list for a particular restriction
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.fetchDepositeRules = function() {
            var deferred = $q.defer(),
                url      = '/api/deposit_policies';

            ADBaseWebSrvV2.getJSON(url)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };


        /*
        * Save a newly created rule under a particular restriction
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.saveRule = function(params) {
            var deferred = $q.defer(),
                url      = '/api/cancellation_policies';

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };
        /*
        * Save a newly created rule under a particular restriction
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.saveDepositeRule = function(params) {
            var deferred = $q.defer(),
                url      = '/api/deposit_policies';

            ADBaseWebSrvV2.postJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };


        /*
        * update a existing rule under a particular restriction
        *
        * @param {object} contains page and per_page params
        * @return {object} defer promise
        */
        this.updateRule = function(dataWith) {
            var deferred = $q.defer(),
                url      = '/api/cancellation_policies/' + dataWith.id,
                data     = _.omit(dataWith, 'id');

            ADBaseWebSrvV2.putJSON(url, data)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };


        this.updateDepositeRule = function(dataWith) {
            var deferred = $q.defer(),
                url      = '/api/deposit_policies/' + dataWith.id,
                data     = _.omit(dataWith, 'id');

            ADBaseWebSrvV2.putJSON(url, data)
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
      this.deleteRule = function(params) {
        var deferred = $q.defer(),
            url      = '/api/cancellation_policies/' + params.id;

        ADBaseWebSrvV2.deleteJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };


      this.deleteDepositeRule = function(params) {
        var deferred = $q.defer(),
            url      = '/api/deposit_policies/' + params.id;

        ADBaseWebSrvV2.deleteJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };

      /*
      * get details of a particular rule
      *
      * @param {object} contains page and per_page params
      * @return {object} defer promise
      */
      this.fetchCancellationSingleRule = function(params) {
        var deferred = $q.defer(),
            url      = '/api/cancellation_policies/' + params.id;

        ADBaseWebSrvV2.getJSON(url, params)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };


      this.fetchSingleDepositeRule = function(params) {
        var deferred = $q.defer(),
            url      = '/api/deposit_policies/' + params.id;

        ADBaseWebSrvV2.getJSON(url)
          .then(function(data) {
            deferred.resolve(data);
          }, function(errorMessage) {
            deferred.reject(errorMessage);
          });

        return deferred.promise;
      };

    /**
    *   A getter method to return the charge codes list
    */
    this.fetchChargeCodes = function(){
        var deferred = $q.defer();
        var url = '/admin/charge_codes/minimal_list.json';
        
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

}]);