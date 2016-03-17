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
       * to keep track of last filter choosed
       * will be using in setting zoom level or coming back from graph view to this
       */
      var lastSelectedFilterValues = null;

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
        var rateRestrictions = response.dailyRateAndRestrictions,
            rates = response.rates,
            dates = _.pluck(rateRestrictions, 'date'),
            rateIDs = _.pluck(response.rates, 'id'),
            ratesWithRestrictions = rateRestrictions[0].rates,
            rateObjectBasedOnID = {},
            dateRateSet = null;

        rateRestrictions = _.object(dates, rateRestrictions);
        rateObjectBasedOnID = _.object(rateIDs, response.rates);
        
        //we have lots of alternative ways, those depends on javascript array order
        //which is buggy from browser to browser, so choosing this bad way
        //may be this will result in running 365000 times
        ratesWithRestrictions = ratesWithRestrictions.map(function(rate) {
          rate.restrictionList = [];
          //rate.name = rateObjectBasedOnID[rate.id].name;
          rate = _.extend(rate, _.omit(rateObjectBasedOnID[rate.id], 'id'));
          dates.map(function(date) {
            dateRateSet = _.findWhere(rateRestrictions[date].rates, {id: rate.id});
            rate.restrictionList.push(dateRateSet.restrictions);
          });

          return _.omit(rate, 'restrictions');
        });

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);

        store.dispatch({
          type: 'RATE_VIEW_CHANGED',
          data: [...ratesWithRestrictions],
          dates,
          zoomLevel: lastSelectedFilterValues.zoomLevel
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
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
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

        //Storing for further reference
        lastSelectedFilterValues = { ...newFilterValues }; //ES7

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
      var renderGridView = () => {
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

        renderGridView();
      })();

    }]);
