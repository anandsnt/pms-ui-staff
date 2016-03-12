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
    'RMFilterOptionsSrv',
    function($scope,
             $filter,
             ngDialog,
             util,
             $rootScope,
             rvRateManagerOrderByConstants,
             rvTwoMonthCalendarEventConstants,
             RMFilterOptionsSrv) {

      BaseCtrl.call(this, $scope);

      /**
       * This method handles on-click of the SHOW RATES BUTTON
       */
      $scope.onClickShowRates = () => {
        // Find out the view selected by the user
        /**
         * NOTE The possible views are
         *  1. Multiple Rates
         *  2. All Room Types
         *  3. Single Rate
         */
        let filter = $scope.rateManagerDataModel.filterOptions;
        if (filter.viewTypeSelection.showAllRoomTypes) {
        //    All Room Types
        }else if (filter.viewTypeSelection.selectedRates.length === 1) {
        //    Single Rate
        }else {
          //    Multiple Rates View
        }
      };

      /**
       * to switch the tab from left side filter's show all/select rate
       * @param  {[type]} tab [description]
       * @return {[type]}     [description]
       */
      $scope.switchTabAndCorrespondingActions = (tab) => {
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.chosenTab = tab;
        refreshScroller();

        if (tab === 'SHOW_ALL') {
          let viewSelection = $scope.rateManagerDataModel.filterOptions.viewTypeSelection,
              selectedRateTypes = viewSelection.selectedRateTypes,
              selectedRates = viewSelection.selectedRates;

          //if coming back to show all tab after clearing the all selection from other tab, we have to set default value
          if (!selectedRateTypes.length && !selectedRates.length && !viewSelection.showAllRates && !viewSelection.showAllRoomTypes) {
            $scope.rateManagerDataModel.filterOptions.viewTypeSelection.showAllRates = true;
          }
        }
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
        $scope.setScroller('filter_details', {});
      };

      /**
       * we want to display date in what format set from hotel admin
       * @param {String/DateObject}
       * @return {String}
       */
      var formatDateForUI = (date_) => {
        var type_ = typeof date_,
            returnString = '';
        switch (type_) {
            //if date string passed
          case 'string':
            returnString = $filter('date')(new tzIndependentDate(date_), $rootScope.dateFormat);
            break;

        //if date object passed
          case 'object':
            returnString = $filter('date')(date_, $rootScope.dateFormat);
            break;
        }
        return (returnString);
      };

      /**
       * on choosing the rate type from list, we will be adding to selected list
       */
      $scope.rateTypeSelected = () => {
        if ($scope.selectedRateTypeID.trim !== '') {
          let rateTypeList = $scope.rateManagerDataModel.filterOptions.viewTypeSelection.rateTypes,

            selectedRateTypeList = $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes,

            conditionToTest = {id: parseInt($scope.selectedRateTypeID)},

            selectedRateType = _.findWhere(rateTypeList , conditionToTest),

            alreadyExistInSelectedRateTypeList = (_.findIndex(selectedRateTypeList, conditionToTest) > -1);

          if (!!selectedRateType && !alreadyExistInSelectedRateTypeList) {
            $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes.push(selectedRateType);

            //adding the elements will change the height
            refreshScroller();
          }

          clearAllRatesAndAllRoomTypes();
        }
      };

      /**
       * to delete
       * @param  {LongInteger} rateTypeID [selected rate type's id to delete]
       */
      $scope.deleteSelectedRateType = (rateTypeID) => {
        var indexToDelete = _.findIndex($scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes , {id: parseInt(rateTypeID)});
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes.splice(indexToDelete, 1);

        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected rate type in one take
       */
      $scope.deleteAllSelectedRateTypes = () => {
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes = [];

        //deleting the nodes will change the height
        refreshScroller();
      };

      /**
       * utility function to clean the ALL RATES/ALL ROOM TYPE radio box
       */
      var clearAllRatesAndAllRoomTypes = () => {
        Object.assign($scope.rateManagerDataModel.filterOptions.viewTypeSelection, {
          showAllRates: false,
          showAllRoomTypes: false
        });
      };

      /**
       * on choosing the rate from list, we will be adding to selected list
       */
      $scope.rateSelected = () => {
        if ($scope.selectedRateID.trim !== '') {
          let rateList = $scope.rateManagerDataModel.filterOptions.viewTypeSelection.rates,

            selectedRateList = $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRates,

            conditionToTest = {id: parseInt($scope.selectedRateID)},

            selectedRate = _.findWhere(rateList , conditionToTest),

            alreadyExistInSelectedRateList = (_.findIndex(selectedRateList, conditionToTest) > -1);

          if (!!selectedRate && !alreadyExistInSelectedRateList) {
            $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRates.push(selectedRate);

            //adding the elements will change the height
            refreshScroller();
          }

          clearAllRatesAndAllRoomTypes();
        }
      };

      /**
       * to delete
       * @param  {LongInteger} rateID [selected rate's id to delete]
       */
      $scope.deleteSelectedRate = (rateID) => {
        var indexToDelete = _.findIndex($scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRates , {id: parseInt(rateID)});
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRates.splice(indexToDelete, 1);

        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected rates in one take
       */
      $scope.deleteAllSelectedRates = () => {
        $scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRates = [];

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
        if ($scope.selectedRateTypeID === '') {
          return true;
        }

        var selectedRateTypeIDs = _.pluck($scope.rateManagerDataModel.filterOptions.viewTypeSelection.selectedRateTypes, 'id');
        return (selectedRateTypeIDs.indexOf(rate.rate_type.id) > -1);
      };

      /**
       * on tapping the ALL RATES radio box
       */
      $scope.changedAllRatesSelection = () => {
        if ($scope.rateManagerDataModel.filterOptions.viewTypeSelection.showAllRates) {
          $scope.rateManagerDataModel.filterOptions.viewTypeSelection.showAllRoomTypes = false;
        }

        //we will clear out all selected from other tab
        $scope.deleteAllSelectedRates();
        $scope.deleteAllSelectedRateTypes();
      };

      /**
       * on tapping the ALL ROOM TYPES radio box
       */
      $scope.changedAllRoomTypes = () => {
        if ($scope.rateManagerDataModel.filterOptions.viewTypeSelection.showAllRoomTypes) {
          $scope.rateManagerDataModel.filterOptions.viewTypeSelection.showAllRates = false;
        }

        //we will clear out all selected from other tab
        $scope.deleteAllSelectedRates();
        $scope.deleteAllSelectedRateTypes();
      };

      /**
       * when we click the set button from calendar popup, we will get this popup
       */
      $scope.$on(rvTwoMonthCalendarEventConstants.TWO_MONTH_CALENDAR_DATE_UPDATED, function(event, data) {
        $scope.rateManagerDataModel.filterOptions.dateRange.from = data.fromDate;
        $scope.rateManagerDataModel.filterOptions.dateRange.to = data.toDate;

        $scope.selectedDateRange = formatDateForUI(data.fromDate) + ' to ' + formatDateForUI(data.toDate);
      });

      /**
       * inorder to show the two month calendar on tapping the date range button
       */
      $scope.showCalendar = () => {
        ngDialog.open({
          template: '/assets/partials/rateManager_/dateRangeModal/rvDateRangeModal.html',
          controller: 'rvDateRangeModalCtrl',
          className: 'ngdialog-theme-default calendar-modal',
          scope: $scope,
          data: {
            fromDate: new tzIndependentDate($rootScope.businessDate),
            toDate: util.getFirstDayOfNextMonth($rootScope.businessDate)
          }
        });
      };

      /**
       * on choosing the card from search result
       */
      $scope.cardSelected = (event, ui) => {
        var selectedCards = $scope.rateManagerDataModel.filterOptions.selectedCards,
            selectedCardIDs = _.pluck(selectedCards, "id");

        if (!selectedCards.length) {
            $scope.rateManagerDataModel.filterOptions.selectedCards.push(ui.item);
        }
        else if (selectedCardIDs.indexOf(ui.item.id) < 0) {
            $scope.rateManagerDataModel.filterOptions.selectedCards.push(ui.item);
        }
        runDigestCycle();

        //we're adding nodes
        refreshScroller();

        //scrolling to bottom
        var scroller = $scope.getScroller('filter_details');
        setTimeout(function(){
          scroller.scrollTo(0, scroller.maxScrollY, 1000);
        }, 350);
      };

      /**
       * to delete
       * @param  {LongInteger} rateTypeID [selected rate type's id to delete]
       */
      $scope.deleteSelectedCard = (cardID) => {
        var indexToDelete = _.findIndex($scope.rateManagerDataModel.filterOptions.selectedCards , {id: parseInt(cardID)});
        $scope.rateManagerDataModel.filterOptions.selectedCards.splice(indexToDelete, 1);

        //deleting the node will change the height
        refreshScroller();
      };

      /**
       * to remove all selected card in one take
       */
      $scope.deleteAllSelectedCards = () => {
        $scope.rateManagerDataModel.filterOptions.selectedCards = [];

        //deleting the nodes will change the height
        refreshScroller();
      };

      /**
       * to run angular digest loop,
       * will check if it is not running
       * return - None
       */
      var runDigestCycle = () => {
        if (!$scope.$$phase) {
          $scope.$digest();
        }
      };

      /**
       * data model for UI will be initialized from here
       */
      var initializeDataModelForMe = () => {
        $scope.selectedDateRange = '';

        $scope.orderByValueMappings = rvRateManagerOrderByConstants;

        //we have to open the filter on the left side
        $scope.rateManagerDataModel.filterOptions.isVisible = true;

        //ng-model for rate type selection
        $scope.selectedRateTypeID = '';

        //ng-model for rate selection
        $scope.selectedRateID = '';

        //card search area
        $scope.cardSearchResults = [];
        $scope.cardSearchText = '';
      };

      /**
       * initialisation function
       */
      (() => {
        setScroller();
        initializeDataModelForMe();
      })();
    }]);
