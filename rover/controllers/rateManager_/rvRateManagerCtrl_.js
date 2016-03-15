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
        var results = response.results,
            dates = _.pluck(results, 'date'),
            ratesWithRestrictions = results[0].rates,
            restrictionList = [],
            dateRateSet = null;

        results = _.object(dates, results);

        //we have lots of alternative ways to form the data model, but we're choosing the bad way since
        //other ways may mess up in the future with data ordering
        //may be this will result in running 365000 times
        ratesWithRestrictions = ratesWithRestrictions.map(function(rate) {
          rate.restrictionList = [];

          dates.map(function(date) {
            dateRateSet = _.findWhere(results[date].rates, {id: rate.id});
            rate.restrictionList.push(dateRateSet.restrictions);
          });

          return _.omit(rate, 'restrictions');
        });

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);

        store.dispatch({
          type: 'RATE_VIEW_CHANGED',
          ratesAndRestrictions: ratesWithRestrictions
        });
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
      var onFetchRoomTypeAndRestrictionsSuccess = (response) => {
        console.log(response);
      };

      /**
       * to fetch the room type & it's restrcitions
       * @param  {Object} params
       */
      var fetchRoomTypeAndRestrictions = (params) => {
        var options = {
          params: params,
          onSuccess: onFetchRoomTypeAndRestrictionsSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchAllRoomTypesInfo, options);
      };

      /**
       * utility method for converting date object into api formated 'string' format
       * @param  {Object} date
       * @return {String}
       */
      var formatDateForAPI = function(date) {
        return $filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI);
      };

      /**
       * to update results
       * @param  {Object} event
       * @param  {Object} newFilterValues)
       */
      $scope.$on(rvRateManagerEventConstants.UPDATE_RESULTS, (event, newFilterValues) => {
        var params = {
          from_date: formatDateForAPI(newFilterValues.fromDate),
          to_date: formatDateForAPI(newFilterValues.toDate),
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

      var initialState = {
        mode: 'NOT_CONFIGURED'
      };
      
      const store = configureStore(initialState)

      const {render} = ReactDOM;
      const {Provider} = ReactRedux;

      /**
       * [description]
       * @param  {[type]} props [description]
       * @param  {String} type  [description]
       * @return {[type]}       [description]
       */
      var renderCalendarView = () => {
        render(
            <Provider store={store} >
              <RateManagerRootComponent/>
            </Provider>,
            document.querySelector('#rate-manager .content')
        );
      };

      /**
       * initialisation function
       */
      (() => {
        setHeadingAndTitle('RATE_MANAGER_TITLE');

        renderCalendarView();
      })();

    }]);
