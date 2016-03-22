angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    '$rootScope',
    'rvRateManagerCoreSrv',
    'rvRateManagerEventConstants',
    'restrictionTypes',
    function($scope,
             $filter,
             $rootScope,
             rvRateManagerCoreSrv,
             rvRateManagerEventConstants,
             restrictionTypes) {

      BaseCtrl.call(this, $scope);

      /**
       * to keep track of last filter choosed
       * will be using in setting zoom level or coming back from graph view to this
       */
      var lastSelectedFilterValues = [],
        activeFilterIndex = 0;

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

        //for topbar
        $scope.fromDate = dates[0];
        $scope.toDate = dates[dates.length - 1];
        $scope.showTopBar = true;
        $scope.selectedCardNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedCards, 'account_name');
        $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');

        rateRestrictions = _.object(dates, rateRestrictions);
        rateObjectBasedOnID = _.object(rateIDs, response.rates);
        
        //we have lots of alternative ways, those depends on javascript array order
        //which is buggy from browser to browser, so choosing this bad way
        //may be this will result in running 365000 times
        ratesWithRestrictions = ratesWithRestrictions.map((rate) => {
          rate.restrictionList = [];

          rate = {...rate, ...rateObjectBasedOnID[rate.id]};
          
          dates.map((date) => {
            dateRateSet = _.findWhere(rateRestrictions[date].rates, { id: rate.id });
            rate.restrictionList.push(dateRateSet.restrictions);
          });

          return _.omit(rate, 'restrictions');
        });

        //for the first row with common restrictions among the rates
        //for now there will not be any id, we have to use certain things to identify (later) TODO
        
        ratesWithRestrictions.unshift({
          restrictionList: dates.map((date) => {
            return rateRestrictions[date].all_rate_restrictions;
          })
        });

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
        console.log('Strted: ', new Date().getTime());
        store.dispatch({
          type: RM_RX_CONST.RATE_VIEW_CHANGED,
          rateRestrictionData: [...ratesWithRestrictions],
          dates,
          zoomLevel: lastSelectedFilterValues[activeFilterIndex].zoomLevel,
          businessDate: tzIndependentDate($rootScope.businessDate),
          restrictionTypes,
          callbacksFromAngular: getTheCallbacksFromAngularToReact(),
        });
      };

      /**
       * to fetch the daily rates
       * @param  {Object} filter values
       */
      var fetchDailyRates = (filterValues) => {
        var params = {
          from_date: formatDateForAPI(filterValues.fromDate),
          to_date: formatDateForAPI(filterValues.toDate),
          order_id: filterValues.orderBySelectedValue,
          name_card_ids: filterValues.selectedCards,
          group_by: filterValues.groupBySelectedValue                
        };

        if(filterValues.selectedRateTypes.length) {
          params["rate_type_ids[]"] = _.pluck(filterValues.selectedRateTypes, 'id');
        }

        if(filterValues.selectedRates.length) {
          params["rate_ids[]"] = _.pluck(filterValues.selectedRates, 'id');
        }

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
        var roomTypeRestrictions = response.roomTypeAndRestrictions,
            roomTypes = response.roomTypes,
            dates = _.pluck(roomTypeRestrictions, 'date'),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeWithRestrictions = roomTypeRestrictions[0].room_types,
            roomTypeObjectBasedOnID = {},
            dateRoomTypeSet = null;

        //topbar
        $scope.fromDate = dates[0];
        $scope.toDate = dates[dates.length - 1];
        $scope.showTopBar = true;
        $scope.selectedCardNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedCards, 'account_name');
        $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');

        roomTypeRestrictions = _.object(dates, roomTypeRestrictions);
        roomTypeObjectBasedOnID = _.object(roomTypeIDs, roomTypes);
        
        //we have lots of alternative ways, those depends on javascript array order
        //which is buggy from browser to browser, so choosing this bad way
        //may be this will result in running 365000 times
        roomTypeWithRestrictions = roomTypeWithRestrictions.map((roomType) => {
          roomType.restrictionList = [];

          roomType = {...roomType, ...roomTypeObjectBasedOnID[roomType.id]};
          
          dates.map((date) => {
            dateRoomTypeSet = _.findWhere(roomTypeRestrictions[date].room_types, { id: roomType.id });
            roomType.restrictionList.push(dateRoomTypeSet.restrictions);
          });

          return _.omit(roomType, 'restrictions');
        });

        //for the first row with common restrictions among the rates
        //for now there will not be any id, we have to use certain things to identify (later) TODO
        
        roomTypeWithRestrictions.unshift({
          restrictionList: dates.map((date) => {
            return roomTypeRestrictions[date].all_room_type_restrictions;
          })
        });

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
        console.log('Strted: ', new Date().getTime());
        store.dispatch({
          type: RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED,
          roomTypeRestrictionData: [...roomTypeWithRestrictions],
          dates,
          zoomLevel: lastSelectedFilterValues[activeFilterIndex].zoomLevel,
          businessDate: tzIndependentDate($rootScope.businessDate),
          restrictionTypes,
          callbacksFromAngular: getTheCallbacksFromAngularToReact(),
        });
      };

      /**
       * to fetch the room type & it's restrcitions
       * @param  {Object} filterValues
       */
      var fetchRoomTypeAndRestrictions = (filterValues) => {
        var params = {
          from_date: formatDateForAPI(filterValues.fromDate),
          to_date: formatDateForAPI(filterValues.toDate),
          order_id: filterValues.orderBySelectedValue               
        };        
        var options = {
          params: params,
          onSuccess: onFetchRoomTypeAndRestrictionsSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndRoomTypes, options);
      };

      /**
       * when open all restrcition we need to refresh the view
       * @param  {Object} response [api response]
       */
      var onOpenAllRestrictionsSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
      };

      /**
       * react callback to open all restriction
       * @param  {Object} params
       */
      var openAllRestrictionsForSingleRateView = (params) => {
        params.rate_id = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;
        var options = {
          params: params,
          onSuccess: onOpenAllRestrictionsSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);        
      };

      /**
       * when close all restrcition we need to refresh the view
       * @param  {Object} response [api response]
       */
      var onCloseAllRestrictionsSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
      };

      /**
       * react callback to close all restriction
       * @param  {Object} params
       */
      var closeAllRestrictionsForSingleRateView = (params) => {
        params.rate_id = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;
        var options = {
          params: params,
          onSuccess: onCloseAllRestrictionsSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);        
      };

      /**
       * utility method to pass callbacks from
       * @return {Object} with callbacks
       */
      var getTheCallbacksFromAngularToReact = () => {
        return {
          singleRateViewCallback: fetchSingleRateDetailsFromReact,
          openAllCallbackForSingleRateView: openAllRestrictionsForSingleRateView,
          closeAllCallbackForSingleRateView: closeAllRestrictionsForSingleRateView
        }
      };

      /**
       * when single rate details api call success
       * @param  {Object} response
       */
      var onFetchSingleRateDetailsAndRestrictions = (response) => {
        var roomTypeRestrictions = response.roomTypeAndRestrictions,
            roomTypes = response.roomTypes,
            dates = _.pluck(roomTypeRestrictions, 'date'),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeWithRestrictions = roomTypeRestrictions[0].room_types,
            roomTypeObjectBasedOnID = {},
            dateRoomTypeSet = null;

        //topbar
        $scope.fromDate = dates[0];
        $scope.toDate = dates[dates.length - 1];
        $scope.showTopBar = true;
        $scope.selectedCardNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedCards, 'account_name');
        $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');

        roomTypeRestrictions = _.object(dates, roomTypeRestrictions);
        roomTypeObjectBasedOnID = _.object(roomTypeIDs, roomTypes);
        
        //we have lots of alternative ways, those depends on javascript array order
        //which is buggy from browser to browser, so choosing this bad way
        //may be this will result in running 365000 times
        roomTypeWithRestrictions = roomTypeWithRestrictions.map((roomType) => {
          roomType = {...roomType, ...roomTypeObjectBasedOnID[roomType.id]};
          roomType = _.pick(roomType, 'id', 'name', 'restrictions');
          roomType.restrictionList = [];
          roomType.rateDetails = [];
          
          dates.map((date) => {
            dateRoomTypeSet = _.findWhere(roomTypeRestrictions[date].room_types, { id: roomType.id });
            roomType.restrictionList.push(dateRoomTypeSet.restrictions);
            roomType.rateDetails.push(_.omit(dateRoomTypeSet, 'restrictions', 'id', 'rateDetails', 'restrictionList'));
          });
          return _.omit(roomType, 'restrictions');
        });

        //for the first row with common restrictions among the rates
        //for now there will not be any id, we have to use certain things to identify (later) TODO
        
        roomTypeWithRestrictions.unshift({
          rateDetails: [],
          restrictionList: dates.map((date) => {
            return roomTypeRestrictions[date].rate_restrictions;
          })
        });

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);

        store.dispatch({
          type: RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED,
          singleRateRestrictionData: [...roomTypeWithRestrictions],
          dates,
          zoomLevel: lastSelectedFilterValues[activeFilterIndex].zoomLevel,
          businessDate: tzIndependentDate($rootScope.businessDate),
          restrictionTypes,
          callbacksFromAngular: getTheCallbacksFromAngularToReact(),
        });        
      };

      /**
       * on taping the back button from the top bar (NOT from the HEADER)
       */
      $scope.clickedOnBackButton = () => {
        activeFilterIndex = activeFilterIndex - 1;
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
        $scope.showBackButton = false;
      };

      /**
       * callback from react, when clicked on rate
       * @param  {Object} filterValues
       */
      var fetchSingleRateDetailsFromReact = (filterValues) => {
        lastSelectedFilterValues.push({
          ...lastSelectedFilterValues[activeFilterIndex],
          ...filterValues,
          showAllRates: false,
          showAllRoomTypes: false,
          selectedRateTypes: [],
          fromLeftFilter: false
        });

        activeFilterIndex = activeFilterIndex + 1;

        $scope.selectedRateNames = lastSelectedFilterValues[activeFilterIndex].selectedRates;
        
        $scope.showBackButton = true;

        fetchSingleRateDetailsAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
      };

      /**
       * to fetch the single rate details 
       * @param  {Object} filterValues
       */
      var fetchSingleRateDetailsAndRestrictions = (filterValues) => {
        var params = {
          from_date: formatDateForAPI(filterValues.fromDate),
          to_date: formatDateForAPI(filterValues.toDate),
          order_id: filterValues.orderBySelectedValue,
          rate_id: filterValues.selectedRates[0].id          
        };        
        var options = {
          params: params,
          onSuccess: onFetchSingleRateDetailsAndRestrictions
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndRoomTypes, options);        
      };

      /**
       * utility method for converting date object into api formated 'string' format
       * @param  {Object} date
       * @return {String}
       */
      var formatDateForAPI = (date) => (
        $filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI)
      );

      /**
       * to update results
       * @param  {Object} event
       * @param  {Object} newFilterValues)
       */
      $scope.$on(rvRateManagerEventConstants.UPDATE_RESULTS, (event, newFilterValues) => {
        //Storing for further reference
        if( _.has(newFilterValues, 'fromLeftFilter') && newFilterValues.fromLeftFilter){
          lastSelectedFilterValues = [{ ...newFilterValues }]; //ES7
          activeFilterIndex = 0;
        }
        
        if (newFilterValues.showAllRates) {
          //calling the api
          fetchDailyRates(newFilterValues);
        }
        else if (newFilterValues.showAllRoomTypes) {
          fetchRoomTypeAndRestrictions(newFilterValues);
        }
        else { 
          /* 
            In this case we have two modes (single rate view & multiple rates view)
            -------------------
            single rate view
            -------------------
            if we choose single rate, this mode will become active. In this mode,
            we will be getting room type view with it's rate amount 
            (we can view all occupancy amount by clicking on the expand button) & 
            restriction list against each room type
            -------------------
            multiple rate view
            -------------------
            if we choose multiple rate or multiple rate type,
            the very same mode newFilterValues.showAllRates (check the lines above) will become active
          */
          
          //single rate view
          if(newFilterValues.selectedRates.length === 1 && !newFilterValues.selectedRateTypes.length)  {
            fetchSingleRateDetailsAndRestrictions(newFilterValues)
          }
          //multiple rate view
          else if(newFilterValues.selectedRates.length > 1 || newFilterValues.selectedRateTypes.length > 0) {
            //calling the api
            fetchDailyRates(newFilterValues);
          }
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
      $scope.$on('showErrorMessage', (event, errorMessage) => {
        $scope.errorMessage = errorMessage;
        runDigestCycle();
      });

      var initialState = {
        mode: RM_RX_CONST.NOT_CONFIGURED_MODE
      };
      
      const store = configureStore(initialState)

      const {render} = ReactDOM;
      const {Provider} = ReactRedux;

      /**
       * to render the grid view
       */
      var renderGridView = () => {
        render(
            <Provider store={store}>
              <RateManagerRootComponent/>
            </Provider>,
            document.querySelector('#rate-manager .content')
        );
      };

      /**
       * to initialize data model for rate manager
       */
      var initializeDataModel = () => {
        //for top bar
        $scope.showTopBar = false;
        $scope.showBackButton = false;
        $scope.selectedCardNames = [];
        $scope.selectedRateNames = [];
        $scope.fromDate = null;
        $scope.toDate = null;

        //mode
        $scope.viewingScreen = RM_RX_CONST.GRID_VIEW;
      };

      /**
       * initialisation function
       */
      (() => {
        setHeadingAndTitle('RATE_MANAGER_TITLE');
        initializeDataModel();
        renderGridView();
      })();

    }]);
