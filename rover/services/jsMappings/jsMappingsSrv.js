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
  	 * @param  {[type]} key               [description]
  	 * @param  {[type]} modules_to_inject [description]
  	 * @return {[type]}                   [description]
  	 */
  this.fetchAssets = function(key, modules_to_inject) {
    if (!!mappingList) {
      return $ocLazyLoad.load({ serie: true, files: mappingList[key] }).then(function() {
         $ocLazyLoad.inject(modules_to_inject);
      });
    } else {
      console.error('something wrong, mapping list is not filled yet, please ensure that flow/variables are correct');
      return;
    };
  };

}]);
