/**
 * Created by shahulhameed on 3/10/16.
 */
angular.module('sntRover').controller('rvRateManagerLeftSideFilterCtrl', [
    '$scope',
    '$filter',
    'ngDialog',
    'rvUtilSrv',
    '$rootScope',
    'rvRateManagerOrderByConstants',
    'rvTwoMonthCalendarEventConstants',
    'rvRateManagerZoomLevelConstants',
    'rvRateManagerGroupByConstants',
    'rvRateManagerEventConstants',
    'RMFilterOptionsSrv',
    'RateMngrCalendarSrv',
    '$q',
    function($scope,
             $filter,
             ngDialog,
             util,
             $rootScope,
             rvRateManagerOrderByConstants,
             rvTwoMonthCalendarEventConstants,
             rvRateManagerZoomLevelConstants,
             rvRateManagerGroupByConstants,
             rvRateManagerEventConstants,
             RMFilterOptionsSrv,
             RateMngrCalendarSrv,
             $q) {

      BaseCtrl.call(this, $scope);

      /**
       * toggle filter visibility
       */
      $scope.toggleFilterVisibility = () => {
        $scope.isFilterVisible = !$scope.isFilterVisible;
      };

      /**
       * to referesh the scroller objects
       */
      var refreshScroller = () => {
        $scope.refreshScroller('filter_details');
      };

      /**
       * function for initializing the scrollers
       */
      var setScroller = () => {
        $scope.setScroller('filter_details', {
          tap: true,
          preventDefault: false
        });
      };

      /**
       * to get a date in a format set from hotel admin
       * @param {String/DateObject}
       * @return {String}
       */
      var formatDateForUI = (date_) => {
        return $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
      };

      /**
       * to close filter section from somewhere
       */
      $scope.$on(rvRateManagerEventConstants.CLOSE_FILTER_SECTION, function(event) {
        $scope.isFilterVisible = false; 
      });

      /**
       * on choosing the rate type from list, we will be adding to selected list
       */
      $scope.rateTypeSelected = () => {
        if ($scope.selectedRateTypeID.trim === '') {
          return;
        }

        var conditionToTest = {id: parseInt($scope.selectedRateTypeID)},

          selectedRateType = _.findWhere($scope.rateTypes , conditionToTest),

          alreadyExistInSelectedRateTypeList = (_.findIndex($scope.selectedRateTypes, conditionToTest) > -1);

        if (!!selectedRateType && !alreadyExistInSelectedRateTypeList) {
          $scope.selectedRateTypes.push(selectedRateType);

          //adding the elements will change the height
          refreshScroller();

          //setting the focus to newly added rate type
          scrollTo('#selected-rate-type-list span:last-child');
        }

        clearAllRatesAndAllRoomTypes();
        $scope.deleteAllSelectedCards();
      };

      /**
       * to delete
       * @param  {LongInteger} rateTypeID [selected rate type's id to delete]
       */
      $scope.deleteSelectedRateType = (rateTypeID) => {
        var indexToDelete = _.findIndex($scope.selectedRateTypes , {id: parseInt(rateTypeID)});
        $scope.selectedRateTypes.splice(indexToDelete, 1);

        $scope.selectedRateTypeID = '';
        
        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected rate type in one take
       */
      $scope.deleteAllSelectedRateTypes = () => {
        $scope.selectedRateTypes = [];
        $scope.selectedRateTypeID = '';
        //deleting the nodes will change the height
        refreshScroller();
      };

      /**
       * utility function to clean the ALL RATES/ALL ROOM TYPE radio box
       */
      var clearAllRatesAndAllRoomTypes = () => {
        $scope.showAllRates = false;
        $scope.showAllRoomTypes = false;
      };

      /**
       * utility mehtod to scroll to a node element
       * @param {node} [cssSelector]
       */
      var scrollTo = (cssSelector) => {
        //scrolling to bottom
        var scroller = $scope.getScroller('filter_details');
        setTimeout(function() {
          scroller.scrollToElement(cssSelector, 700);
        }, 301);
      };

      /**
       * on choosing the rate from list, we will be adding to selected list
       */
      $scope.rateSelected = () => {
        if ($scope.selectedRateID.trim !== '') {
          let conditionToTest = {id: parseInt($scope.selectedRateID)},

            selectedRate = _.findWhere($scope.rates , conditionToTest),

            alreadyExistInSelectedRateList = (_.findIndex($scope.selectedRates, conditionToTest) > -1);

          if (!!selectedRate && !alreadyExistInSelectedRateList) {
            $scope.selectedRates.push(selectedRate);

            //adding the elements will change the height
            refreshScroller();

            //setting the focus to newly added rate
            scrollTo('#selected-rate-list span:last-child');
          }

          clearAllRatesAndAllRoomTypes();
          $scope.deleteAllSelectedCards();
        }
      };

      /**
       * to delete
       * @param  {LongInteger} rateID [selected rate's id to delete]
       */
      $scope.deleteSelectedRate = (rateID) => {
        var indexToDelete = _.findIndex($scope.selectedRates , {id: parseInt(rateID)});
        $scope.selectedRates.splice(indexToDelete, 1);

        $scope.selectedRateID = '';

        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected rates in one take
       */
      $scope.deleteAllSelectedRates = () => {
        $scope.selectedRates = [];
        $scope.selectedRateID = '';
        
        //deleting the nodes will change the height
        refreshScroller();
      };

      /**
       * we will show the rates conditionalyy
       * @param  {Object} rate Object
       * @return {Boolean}
       */
      $scope.shouldShowRate = (rate) => {
        //if "'Select Rate Type' choosed from Rate type down choosed"
        if ($scope.selectedRateTypeID === '' && !$scope.selectedRateTypes.length) {
          return true;
        }

        var selectedRateTypeIDs = _.pluck($scope.selectedRateTypes, 'id');
        return (selectedRateTypeIDs.indexOf(rate.rate_type.id) > -1);
      };

      /**
       * on tapping the ALL RATES radio box
       */
      $scope.changedAllRatesSelection = () => {
        if ($scope.showAllRates) {
          $scope.showAllRoomTypes = false;
        }

        //we will clear out all selected from other tab
        $scope.deleteAllSelectedRates();
        $scope.deleteAllSelectedRateTypes();
      };

      /**
       * on tapping the ALL ROOM TYPES radio box
       */
      $scope.changedAllRoomTypes = () => {
        if ($scope.showAllRoomTypes) {
          $scope.showAllRates = false;
        }

        //we will clear out all selected from other tab
        $scope.deleteAllSelectedRates();
        $scope.deleteAllSelectedRateTypes();
        $scope.deleteAllSelectedCards();
      };

      /**
       * when we click the set button from calendar popup, we will get this popup
       */
      $scope.$on(rvTwoMonthCalendarEventConstants.TWO_MONTH_CALENDAR_DATE_UPDATED, function(event, data) {
        $scope.fromDate = data.fromDate;
        $scope.toDate = data.toDate;

        $scope.selectedDateRange = formatDateForUI(data.fromDate) + ' to ' + formatDateForUI(data.toDate);
      });

      /**
       * to switch the tab from left side filter's show all/select rate
       * @param  {[type]} tab [description]
       * @return {[type]}     [description]
       */
      $scope.switchTabAndCorrespondingActions = (tab) => {
        $scope.chosenTab = tab;
        refreshScroller();

        if (tab === 'SHOW_ALL') {
          let selectedRateTypes = $scope.selectedRateTypes,
              selectedRates = $scope.selectedRates;

          //if coming back to show all tab after clearing the all selection from other tab, we have to set default value
          if (!selectedRateTypes.length && !selectedRates.length && !$scope.showAllRates && !$scope.showAllRoomTypes) {
            $scope.showAllRates = true;
          }
        }
        scrollTo('.tabs-nav');
      };

      /**
       * inorder to show the two month calendar on tapping the date range button
       */
      $scope.showCalendar = () => {
        var maxRangeBetweenFromAndToDate = {
          year: 1
        };

        var dataForCalendar = {
          fromDate: new tzIndependentDate($rootScope.businessDate),
          toDate: util.getFirstDayOfNextMonth($rootScope.businessDate),
          maxRange: maxRangeBetweenFromAndToDate
        };

        //if there is already two date choosed
        if ($scope.selectedDateRange !== '') {
          dataForCalendar.fromDate = new tzIndependentDate($scope.fromDate);
          dataForCalendar.toDate = new tzIndependentDate($scope.toDate);         
        }

        ngDialog.open({
          template: '/assets/partials/rateManager_/dateRangeModal/rvDateRangeModal.html',
          controller: 'rvDateRangeModalCtrl',
          className: 'ngdialog-theme-default calendar-modal',
          scope: $scope,
          data: dataForCalendar
        });
      };

      /**
       * utility method to clear all selection from tabs
       */
      const clearAllRatesAllRoomTypesAllRateTypesAllRates = () => {
        clearAllRatesAndAllRoomTypes();
        $scope.deleteAllSelectedRateTypes();
        $scope.deleteAllSelectedRates();
      }

      /**
       * on choosing the card from search result
       */
      $scope.cardSelected = (event, ui) => {
        if (!$scope.selectedCards.length) {
          $scope.selectedCards.push(ui.item);
        } 
        else {
          let selectedCardIDs = _.pluck($scope.selectedCards, 'id');
          if (selectedCardIDs.indexOf(ui.item.id) < 0) {
            $scope.selectedCards.push(ui.item);
          }
        }

        clearAllRatesAllRoomTypesAllRateTypesAllRates();
        
        $scope.showAllRates = true;
        
        $scope.chosenTab = 'SHOW_ALL';

        runDigestCycle();

        //we're adding nodes
        refreshScroller();

        //scrolling to the added position
        scrollTo('#rm-selected-card-list span:last-child');
      };

      /**
       * to delete
       * @param  {LongInteger} rateTypeID [selected rate type's id to delete]
       */
      $scope.deleteSelectedCard = (cardID) => {
        var indexToDelete = _.findIndex($scope.selectedCards , {id: parseInt(cardID)});
        $scope.selectedCards.splice(indexToDelete, 1);

        $scope.cardSearchText = '';

        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected card in one take
       */
      $scope.deleteAllSelectedCards = () => {
        $scope.selectedCards = [];
        $scope.cardSearchText = '';
        //deleting the nodes will change the height
        refreshScroller();
      };

      /**
       * @return {Boolean}
       */
      $scope.shouldDisableShowRateButton = () => {
        return !$scope.fromDate || !$scope.toDate;
      };

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
       * when all api reqd to fill drop down successfully completed
       */
      var successFetchOfFillAndSetRateRateTypesAndSortOptions = () => {
        $scope.$emit('hideLoader');
      };

      /**
       * when something got wrong during the api reqd to fill drop down
       */
      var failedToFillAndSetRateRateTypesAndSortOptions = () => {
        $scope.$emit('hideLoader');
        $scope.$emit('showErrorMessage', ['Sorry, something got wrong while trying to fill the rate, rate type, sorting preference values']);
      };

      /**
       * on success of sort preference api call
       * @param {Object} data
       */
      var successCallBackOfSortPreferenceFetch = (data) => {
        $scope.orderBySelectedValue = data.id;
      };

      /**
       * on success of sort options api call
       * @param {array} data
       */
      var successCallBackOfSortOptionsFetch = (data) => {
        $scope.orderByValues = data;
      };

      /**
       * on success of rate api call
       * @param {array} data
       */
      var successCallBackOfRatesFetch = (data) => {
        $scope.rates = _.sortBy(data.results, 'name');
      };

      /**
       * on success of ratetype list api call
       * @param {array} data
       */
      var successCallBackOfRateTypeFetch = (data) => {
        $scope.rateTypes = _.sortBy(data, 'name');
      };

      /**
       * filling the drop down values from the API
       */
      var fillAndSetRateRateTypesAndSortOptions = () => {
        var promises = [];

        //we are not using our normal API calling since we have multiple API calls needed
        $scope.$emit('showLoader');

        //sort values
        promises.push(
          RateMngrCalendarSrv.fetchSortOptions().then(successCallBackOfSortOptionsFetch)
        );

        //sort preference
        promises.push(
          RateMngrCalendarSrv.fetchSortPreferences().then(successCallBackOfSortPreferenceFetch)
        );

        //rates
        promises.push(
          RMFilterOptionsSrv.fetchAllRates().then(successCallBackOfRatesFetch)
        );

        //rate types
        promises.push(
          RMFilterOptionsSrv.fetchRateTypes().then(successCallBackOfRateTypeFetch)
        );

        //Fire
        $q.all(promises)
          .then(successFetchOfFillAndSetRateRateTypesAndSortOptions, failedToFillAndSetRateRateTypesAndSortOptions);
      };

      /**
       * This method handles on-click of the SHOW RATES BUTTON
       */
      $scope.clickedOnShowRates = () => {
        var valuesChoosed = {
          fromDate: $scope.fromDate,
          toDate: $scope.toDate,

          zoomLevel: $scope.selectedZoomLevelValue,

          orderID: $scope.orderBySelectedValue,

          groupBy: $scope.groupBySelectedValue,

          showAllRates: $scope.showAllRates,
          showAllRoomTypes: $scope.showAllRoomTypes,

          selectedRateTypes: $scope.selectedRateTypes,
          selectedRates: $scope.selectedRates,

          selectedCards: $scope.selectedCards,

          fromLeftFilter: true
        };

        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, valuesChoosed);
      };

      /**
       * data model for UI will be initialized from here
       */
      var initializeDataModelForMe = () => {
        //we have to open the filter on the left side
        $scope.isFilterVisible = true;

        //date range
        $scope.fromDate = null;
        $scope.toDate = null;
        $scope.selectedDateRange = '';

        //zoom level configs
        $scope.selectedZoomLevelValue = '3'; //default value
        $scope.zoomLevelValues = rvRateManagerZoomLevelConstants;

        //order by values
        $scope.orderBySelectedValue = null; //will be assigning to the preferred from the admin
        $scope.orderByValues = []; //will be filled from API
        $scope.orderByValueMappings = rvRateManagerOrderByConstants;

        //group by values
        $scope.groupBySelectedValue = ''; //default unselected
        $scope.groupByValues = rvRateManagerGroupByConstants;

        //tab selection
        $scope.chosenTab = 'SHOW_ALL'; //list of values applicable: 'SHOW_ALL', 'SELECT_RATE'

        $scope.showAllRates = true;
        $scope.showAllRoomTypes = false;

        //rate type related
        $scope.rateTypes = []; //will be filled from API once we get to th = view
        $scope.selectedRateTypes = [];
        $scope.selectedRateTypeID = ''; //ng-model for rate type selection

        //rate related
        $scope.rates = []; //will be filled from API once we get to th = view
        $scope.selectedRates = [];
        $scope.selectedRateID = ''; //ng-model for rate selection

        //card search area
        $scope.selectedCards = [];
        $scope.cardSearchResults = [];
        $scope.cardSearchText = '';
      };

      /**
       * initialisation function
       */
      (() => {

        setScroller();

        initializeDataModelForMe();

        fillAndSetRateRateTypesAndSortOptions();
        
        refreshScroller();

      })();
    }]);
