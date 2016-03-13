angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    '$rootScope',
    function($scope,
             $filter,
             $rootScope) {

      BaseCtrl.call(this, $scope);

      /**
       * to set the heading and title
       * @param nonTranslatedTitle {String}
       */
      var setHeadingAndTitle = (nonTranslatedTitle) => {
        var title = $filter('translate')(nonTranslatedTitle);
        $scope.setTitle(title);
        $scope.heading = title;
      };

      /**
       * to set initial data model
       */
      var initializeDataModel = () => {

      };

      /**
       * to have animation while opening & closing
       */
      $rootScope.$on('ngDialog.opened', function(e, $dialog) {
        setTimeout(function() {
          $dialog.addClass('modal-show');
        },100);
      });

      /**
       * initialisation function
       */
      (() => {
        setHeadingAndTitle('RATE_MANAGER_TITLE');

        initializeDataModel();

        const {render} = ReactDOM;
        render(
            <RateManagerRoot/>,
            document.querySelector('#rate-manager .content')
        );

      })();

    }]);
