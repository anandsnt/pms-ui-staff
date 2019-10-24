admin.directive('adToggleButton', function() {
  return {
    restrict: 'E',
    replace: 'true',
      scope: {
      negativeLogic: '=?', // This flag can be used in cases where the negated value is stored in the server
      label: '@label',
      isChecked: '=isChecked',
      divClass: '@divClass',
      buttonClass: '@buttonClass',
      isDisabled: '=isDisabled',
      isHide: '=isHide',
      description: '@description',
      onUpdate: '=',
      params: '='
    },

    templateUrl: '/assets/directives/toggle/adToggleButton.html',
    controller: function($scope) {
      $scope.handler = function () {
          if (typeof $scope.onUpdate === 'function') {
              $scope.onUpdate($scope.params, $scope.isChecked);
          }
      };
    }
  };
});
