admin.controller('ADRulesRestrictionCtrl', [
  '$scope',
  '$state',
  'ADRulesRestrictionSrv',
  function($scope, $state, ADRulesRestrictionSrv) {

    $scope.init = function(){
      BaseCtrl.call(this, $scope);
      $scope.ruleList = {};
    }

    $scope.init();

    /**
    * To fetch hotel likes
    */
    $scope.fetchRulesRestrictions = function() {
      var fetchHotelLikesSuccessCallback = function(data) {
        $scope.$emit('hideLoader');

        $scope.ruleList = data.results;
        $scope.total = data.total_count;
      };

      $scope.invokeApi(ADRulesRestrictionSrv.fetch, {}, fetchHotelLikesSuccessCallback);
    };

    $scope.fetchRulesRestrictions();

    /*
    * To handle switch
    */
    $scope.switchClicked = function(index){

      //on success
      var toggleSwitchLikesSuccessCallback = function(data) {
        $scope.ruleList[index].activated = $scope.ruleList[index].activated ? false : true;
        $scope.$emit('hideLoader');
      };

      var data = {
        'id': $scope.ruleList[index].id,
        'status': $scope.ruleList[index].activated ? false : true
      }

      $scope.invokeApi(ADRulesRestrictionSrv.toggleSwitch, data, toggleSwitchLikesSuccessCallback);
    }

  }]);	