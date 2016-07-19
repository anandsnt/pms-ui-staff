// specifically written for this application
// adding an OWS check Interceptor here and bussiness date change
// but should be moved to higher up above in root level

angular.module('sharedHttpInterceptor', []).factory('sharedHttpInterceptor', [
  '$rootScope',
  '$q',
  '$window', function ($rootScope, $q, $window) {

  return {
    request: function (config) {
      return config;
    },
    response: function (response) {
        // if manual bussiness date change is in progress alert user.
        if(response.data.is_eod_in_progress && !$rootScope.isCurrentUserChangingBussinessDate){          
          $rootScope.$emit('bussinessDateChangeInProgress');
        };
        if(response.data.hasOwnProperty('is_eod_in_progress')){
          $rootScope.isEodRunning = response.data.is_eod_in_progress;
        };
        if(response.data.hasOwnProperty('is_eod_failed')){
          $rootScope.isEodProcessFailed = response.data.is_eod_failed;
        };
        if(response.data.hasOwnProperty('is_eod_process_running')){   
        $rootScope.isEodProcessRunning = response.data.is_eod_process_running;
        }
       
        return response || $q.when(response);
    },
    responseError: function(rejection) {
      if(rejection.status === 401){ // 401- Unauthorized
        // so lets redirect to login page
        $window.location.href = '/logout' ;
      }
      if(rejection.status === 430){
         $rootScope.showBussinessDateChangedPopup && $rootScope.showBussinessDateChangedPopup(rejection.data.errors[0]);
      }
      if(rejection.status === 520 && rejection.config.url !== '/admin/test_pms_connection') {
        $rootScope.showOWSError && $rootScope.showOWSError();
      }
      /** as per CICO-9089 **/
      if(rejection.status === 503){
        $window.location.href = '/500';
      }
      if(rejection.status === 502){
        $rootScope.showOWSError && $rootScope.showOWSError();
        return;
      }
      if(rejection.status === 504){
        $rootScope.showOWSError && $rootScope.showTimeoutError();
        return;
      }
      /*
      we can't handle 500, 501 since we need to show custom error messages on that scope.

      **/
      return $q.reject(rejection);
    }
  };
  }]);
