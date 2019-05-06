admin.service('adComtrolRevenueCenterSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'adIFCSrv', function($http, $q, ADBaseWebSrvV2, adIFCSrv) {
  var service = this;

  /**
   *
   * @returns {deferred.promise|{then, catch, finally}}
   */
  service.fetch = function() {
    return adIFCSrv.get('comtrol', 'list_revenue_centers');
  };

  /**
   *
   * @param newRevCenter
   * @returns {deferred.promise|{then, catch, finally}}
   */
  service.create = function(newRevCenter) {
    return adIFCSrv.post('comtrol', 'create_revenue_center', newRevCenter);
  };

  /**
   *
   * @param id
   * @returns {deferred.promise|{then, catch, finally}}
   */
  service.delete = function(id) {
    return adIFCSrv.delete('comtrol', 'delete_revenue_center', { id: id });
  };

  /**
   *
   * @param revCenter
   * @returns {deferred.promise|{then, catch, finally}}
   */
  service.update = function(revCenter) {
    return adIFCSrv.put('comtrol', 'update_revenue_center', {
      id: revCenter.id,
      name: revCenter.name,
      code: revCenter.code
    });
  };
}]);
