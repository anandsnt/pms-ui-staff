angular.module('sntRover').service('jsMappings', ['$q', 'rvBaseWebSrvV2', '$ocLazyLoad',
	function($q, rvBaseWebSrvV2, $ocLazyLoad) {
  
  var mappingList = null;

  /**
	 * [fetchMappingList description]
	 * @return {[type]} [description]
	 */
  this.fetchMappingList = function() {
    var deferred = $q.defer();
    //if you are updating the url, make sure that same in rover's gulp task
    var url = '/assets/asset_list/____generatedStateJsMappings/____generatedrover/____generatedroverStateJsMappings.json';
    rvBaseWebSrvV2.getJSON(url).then(function(data) {
      mappingList = data;
      deferred.resolve(data);
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  /**
  	 * [fetchAssetList description]
  	 * @param  {array} keys               [description]
  	 * @param  {[type]} modules_to_inject [description]
  	 * @return {[type]}                   [description]
  	 */
  this.fetchAssets = function(keys, modules_to_inject) {
    var promises = [], length = keys.length, i = 0;
    if (!!mappingList) {
      for(; i < length; i++) {
        promises.push( $ocLazyLoad.load({ serie: true, files: mappingList[keys[i]] }) );
      }      
      return $q.all(promises).then(function() {
        if (typeof modules_to_inject !== "undefined") {
         $ocLazyLoad.inject(modules_to_inject);
        }
      });
    } else {
      console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
      return;
    };
  };

        /**
         * [loadPaymentModule description]
         * @param  {array} keys               [description]
         * @param  {[type]} modules_to_inject [description]
         * @return {[type]}                   [description]
         *
         */

        this.loadPaymentModule = function (keys) {
            var locMappingFile = "/assets/asset_list/____generatedgatewayJsMappings/____generatedpayment/____generatedpaymentJsMappings.json";

            if (!keys) {
                keys = ['common', 'templates'];
            }

            var deferred = $q.defer();

            rvBaseWebSrvV2.getJSON(locMappingFile).then(function (data) {
                var promises = [], length = keys.length, i = 0;
                if (!!data) {
                    data.templates = ["/assets/payment_templates.js"];
                    for (; i < length; i++) {
                        promises.push($ocLazyLoad.load({serie: true, files: data[keys[i]]}));
                    }
                    return $q.all(promises).then(function () {
                        $ocLazyLoad.inject(['sntPay']);
                        deferred.resolve(true);
                    });

                } else {
                    console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
                    deferred.reject('error');
                }
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

}]);
