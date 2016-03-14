angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    '$rootScope',
    'rvRateManagerCoreSrv',
    'rvRateManagerEventConstants',
    function($scope,
             $filter,
             $rootScope,
             rvRateManagerCoreSrv,
             rvRateManagerEventConstants) {

      BaseCtrl.call(this, $scope);

      /**
       * to set the heading and title
       * @param {String} nonTranslatedTitle
       */
      var setHeadingAndTitle = (nonTranslatedTitle) => {
        var title = $filter('translate')(nonTranslatedTitle);
        $scope.setTitle(title);
        $scope.heading = title;
      };

      /**
       * to have animation while opening & closing
       */
      $rootScope.$on('ngDialog.opened', (e, $dialog) => {
        setTimeout(function() {
          $dialog.addClass('modal-show');
        },100);
      });

      /**
       * when the daily rates success
       * @param  {Object}
       */
      var onfetchDailyRatesSuccess = (response) => {
        console.log(response);
      };

      /**
       * to fetch the daily rates
       * @param  {Object} params
       */
      var fetchDailyRates = (params) => {
        var options = {
          params: params,
          onSuccess: onfetchDailyRatesSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchMultipleRateInfo, options);
      };

      /**
       * when the daily rates success
       * @param  {Object}
       */
      var fetchRoomTypeAndRestrictions = (response) => {
        console.log(response);
      };

      /**
       * to fetch the room type & it's restrcitions
       * @param  {Object} params
       */
      var fetchRoomTypeAndRestrictions = (params) => {
        var options = {
          params: params,
          onSuccess: fetchRoomTypeAndRestrictions
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchAllRoomTypesInfo, options);
      };

      /**
       * to update results
       * @param  {Object} event
       * @param  {Object} newFilterValues)
       */
      $scope.$on(rvRateManagerEventConstants.UPDATE_RESULTS, (event, newFilterValues) => {
        var params = {
          from_date: newFilterValues.fromDate,
          to_date: newFilterValues.toDate,
          order_id: newFilterValues.orderBySelectedValue
        };

        if (newFilterValues.showAllRates) {
          params.name_card_ids = newFilterValues.selectedCards;
          params.group_by = newFilterValues.groupBySelectedValue;

          //calling the api
          fetchDailyRates(params);

        } else if (newFilterValues.showAllRoomTypes) {
          fetchRoomTypeAndRestrictions(params);
        }
      });

      /**
       * to run angular digest loop,
       * will check if it is not running
       */
      var runDigestCycle = () => {
        if (!$scope.$$phase) {
          $scope.$digest();
        }
      };

      /**
       * to catch the error messages emitting from child controllerss
       * @param  {Object} event
       * @param  {array} errorMessage
       */
      $scope.$on('showErrorMessage', function(event, errorMessage) {
        $scope.errorMessage = errorMessage;
        runDigestCycle();
      });

      /**
       * initialisation function
       */
      (() => {
        setHeadingAndTitle('RATE_MANAGER_TITLE');

        const {render} = ReactDOM;
        render(
            <RateManagerRoot/>,
            document.querySelector('#rate-manager .content')
        );

      })();

    }]);
