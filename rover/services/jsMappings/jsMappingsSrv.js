angular.module('sntRover').service('jsMappings', ['$q', 'rvBaseWebSrvV2', '$ocLazyLoad', '$timeout',
	function($q, rvBaseWebSrvV2, $ocLazyLoad, $timeout) {

  var mappingList = null;

  var paymentMappingList = undefined;

  /**
	 * [fetchMappingList description]
	 * @return {[type]} [description]
	 */
  this.fetchMappingList = function() {
    var deferred = $q.defer();
    // if you are updating the url, make sure that same in rover's gulp task
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



    this.loadPaymentMapping = function() {
      var locMappingFile,
        deferred = $q.defer();

      if ( !! paymentMappingList ) {
        deferred.resolve(paymentMappingList);
      } else {
        locMappingFile = "/assets/asset_list/____generatedgatewayJsMappings/____generatedpayment/____generatedpaymentTemplateJsMappings.json";

        rvBaseWebSrvV2.getJSON(locMappingFile).then(function(data) {
          paymentMappingList = data;
          deferred.resolve(paymentMappingList);
        }, function() {
          console.error('something wrong, make sure the payment mapping file is in exact place or name is correct');
          deferred.reject('something wrong, make sure the payment mapping file is in exact place or name is correct');
        });
      }

      return deferred.promise;
    }

    /**
     * [loadPaymentModule description]
     * @param  {array} keys               [description]
     * @param  {[type]} modules_to_inject [description]
     * @return {[type]}                   [description]
     */
    this.loadPaymentModule = function (keys) {
      var deferred = $q.defer();
      var promises = [], i, j;

      if ( ! paymentMappingList ) {
        console.error('something wrong, mapping list is not filled yet, please ensure that loadPaymentMapping is called first');
        return;
      } else {
        if ( ! keys ) {
          keys = ['common'];
        }

        for ( i = 0, j = keys.length; i < j; i++ ) {
          promises.push( $ocLazyLoad.load({
            serie: true,
            files: paymentMappingList.js[keys[i]]
          }) );
        }

        $q.all(promises).then(function () {
          return $ocLazyLoad.load({
            serie: true,
            files: paymentMappingList.template,
            rerun: true
          }).then(function() {
            $ocLazyLoad.inject(['sntPayConfig', 'sntPay']);
            deferred.resolve();
          }, function(err) {
             console.log('Error on loading Payment Module', err);
          })

        }, function(err) {
          console.log('Error on loading Payment Module', err);

        });

        return deferred.promise;
      }
    };

}]);
