angular.module('sntRover').controller('rvRateManagerCtrl_', [
    '$scope',
    '$filter',
    '$rootScope',
    'rvRateManagerCoreSrv',
    'rvRateManagerEventConstants',
    'restrictionTypes',
    'rvRateManagerPopUpConstants',
    'ngDialog',
    '$timeout',
    'rvRateManagerPaginationConstants',
    function($scope,
             $filter,
             $rootScope,
             rvRateManagerCoreSrv,
             rvRateManagerEventConstants,
             restrictionTypes,
             rvRateManagerPopUpConstants,
             ngDialog,
             $timeout,
             rvRateManagerPaginationConstants) {

    BaseCtrl.call(this, $scope);

    /**
     * to keep track of last filter choosed
     * will be using in setting zoom level or coming back from graph view to this
     */
    var lastSelectedFilterValues = [],
        activeFilterIndex = 0;

    var cachedRateList = [], cachedRoomTypeList = [],
        cachedRateAndRestrictionResponseData = [],
        totalRatesCountForPagination = 0,
        paginationRatePerPage = 0,
        paginationRateMaxRowsDisplay = 0; //for pagination purpose

    //data passed to react, will be used in scrolling related area to find positions
    var showingData = {
        headerData: [],
        bottomData: []
    };

    /**
     * utility method for converting date object into api formated 'string' format
     * @param  {Object} date
     * @return {String}
     */
    var formatDateForAPI = (date) => $filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI);

    /**
     * to set the heading and title
     * @param {String} nonTranslatedTitle
     */
    var setHeadingAndTitle = (nonTranslatedTitle) => {
        var title = $filter('translate')(nonTranslatedTitle);
        $scope.setTitle(title);
        $scope.heading = title;

        //updating the left side menu
        $scope.$emit("updateRoverLeftMenu", "rateManager");
    };

    /**
     * to have animation while opening & closing
     */
    $rootScope.$on('ngDialog.opened', (e, $dialog) => {
        setTimeout(() => {
            $dialog.addClass('modal-show');
        },100);
    });

    /**
     * to reload the present mode
     */
    $scope.$on(rvRateManagerEventConstants.RELOAD_RESULTS, (event, data) => {
        var isFromEditingPopup = _.has(data, 'isFromPopup');

        if(isFromEditingPopup) {
            return handleTheReloadRequestFromPopup(data);
        }
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    });

    /**
     * [description]
     * @return {[type]} [description]
     */
    var handleTheReloadRequestFromPopup = (data) => {
        var dialogData = data.dialogData;
        switch(dialogData.mode) {
            //the mode against the click of a restriciton cell on rate view mode
            case rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
                handleTheReloadRequestFromPopupForSingleRateRestrictionMode(dialogData);
                break;

            case rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
                handleTheReloadRequestFromPopupForMultipleRateRestrictionMode(dialogData);
                break;

            dafault:
                break;
        }
    };

    /**
     * [description]
     * @param  {[type]} dialogData [description]
     * @return {[type]}            [description]
     */
    var handleTheReloadRequestFromPopupForMultipleRateRestrictionMode = (dialogData) => {
        //looping through cached response to find the page
        //checking for the date corresponds one
        for(let i = 0; i < cachedRateAndRestrictionResponseData.length; i++ ) {

            let currentDailyRateAndRestrictionList = cachedRateAndRestrictionResponseData[i].response.dailyRateAndRestrictions;
            
            //finding the scroll position
            let date = tzIndependentDate(dialogData.date),
                fromDateOfCurrentOne = tzIndependentDate(cachedRateAndRestrictionResponseData[i].fromDate),
                toDateOfCurrentOne = tzIndependentDate(cachedRateAndRestrictionResponseData[i].toDate);

            if(fromDateOfCurrentOne <= date && date <= toDateOfCurrentOne) {
                lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = {
                    row: 1, //css selector index is not starting from zero
                    offsetX: true,

                    col: _.findIndex(currentDailyRateAndRestrictionList, { date: dialogData.date }) + 1, //index is starting from zero
                    offsetY: true
                }
            } 
        }
        //clearing all, because the update from popup may impact other days as well
        cachedRateAndRestrictionResponseData = [];
    };

    /**
     * [description]
     * @param  {[type]} dialogData [description]
     * @return {[type]}            [description]
     */
    var handleTheReloadRequestFromPopupForSingleRateRestrictionMode = (dialogData) => {
        var rateID = dialogData.rate.id,
            foundCachedRateAndRestrictionIndexes = [];
                
        //looping through cached response to find the page
        //checking for the rate Id existance
        for(let i = 0; i < cachedRateAndRestrictionResponseData.length; i++ ) {
            let currentDailyRateAndRestrictionList = cachedRateAndRestrictionResponseData[i].response.dailyRateAndRestrictions;
            let listOfRatesFoundInRateRestriction = currentDailyRateAndRestrictionList[0].rates;
            
            let rateSetFoundIndexInList = _.findIndex(listOfRatesFoundInRateRestriction, { id: rateID });

            //if we've rate set, we're good and found the corresponding page ;)
            if(rateSetFoundIndexInList !== -1) {
                lastSelectedFilterValues[activeFilterIndex].allRate.currentPage = cachedRateAndRestrictionResponseData[i].page;

                foundCachedRateAndRestrictionIndexes.push(i);

                //finding the scroll position
                let date = tzIndependentDate(dialogData.date),
                    fromDateOfCurrentOne = tzIndependentDate(cachedRateAndRestrictionResponseData[i].fromDate),
                    toDateOfCurrentOne = tzIndependentDate(cachedRateAndRestrictionResponseData[i].toDate);

                if(fromDateOfCurrentOne <= date && date <= toDateOfCurrentOne) {
                    lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = {
                        row: rateSetFoundIndexInList + 1, //css selector index is not starting from zero
                        offsetX: true,

                        col: _.findIndex(currentDailyRateAndRestrictionList, { date: dialogData.date }) + 1, //index is starting from zero
                        offsetY: true
                    }
                }
            }
        };

        //if something found in list
        if(foundCachedRateAndRestrictionIndexes.length) {
            let fromDates = _.pluck(cachedRateAndRestrictionResponseData, 'fromDate').map(fromDate => tzIndependentDate(fromDate)),
                toDates = _.pluck(cachedRateAndRestrictionResponseData, 'toDate').map(toDate => tzIndependentDate(toDate)),
                minFromDate = formatDateForAPI(_.min(fromDates)), //date in cache data store is in api format
                minToDate = formatDateForAPI(_.min(toDates));  //date in cache data store is in api format
            
            //we may changed a rate detail against particular column or rate columns across a particular row
            getSingleRateRowDetailsAndUpdateCachedDataModel(rateID, minFromDate, minToDate);

            //clearing the cached to perform fresh request
            foundCachedRateAndRestrictionIndexes.map(indexToDelete => 
                cachedRateAndRestrictionResponseData.splice(indexToDelete, 1));
            
            //clearing the common restriction array to get the latest after updating the 
            cachedRateAndRestrictionResponseData.map(cachedRateAndRestrictionResponse => {
                cachedRateAndRestrictionResponse.response.commonRestrictions = [];
            });    
        }
    };


    var onFetchGetSingleRateRowDetailsAndUpdateCachedDataModel = (response, successCallBackParameters) => {
        var dailyRateAndRestrictions = response.dailyRateAndRestrictions,
            commonRestrictions = response.commonRestrictions,
            fromDate = tzIndependentDate(successCallBackParameters.fromDate),
            toDate = tzIndependentDate(successCallBackParameters.toDate),
            rateID = successCallBackParameters.rateID;

        var dateBasedRateDetailsReponse = _.indexBy(dailyRateAndRestrictions, 'date'),
            dateBasedCommonRestrictions = _.indexBy(commonRestrictions, 'date');

        //looping through cached response to find the page
        //checking for the rate Id existance
        cachedRateAndRestrictionResponseData.map(cachedRateAndRestriction => {
            //date wise rate restrictions & amount
            cachedRateAndRestriction.response.dailyRateAndRestrictions.map(dailyRateAndRestriction => {
                let rateFoundIndex = _.findIndex(dailyRateAndRestriction.rates, { id: rateID});
                
                let date = tzIndependentDate(dailyRateAndRestriction.date);
                let isDateBetweenMinAndMax = (fromDate >= date && date <= toDate);
                
                if(rateFoundIndex !== -1 && isDateBetweenMinAndMax) {
                    dailyRateAndRestriction.rates[rateFoundIndex] = dateBasedRateDetailsReponse[dailyRateAndRestriction.date].rates;
                }
            });

            //common restricitons
            cachedRateAndRestriction.response.commonRestrictions.map(commonRestriction => {
                let date = tzIndependentDate(commonRestriction.date);
                let isDateBetweenMinAndMax = (fromDate >= date && date <= toDate);
                if(isDateBetweenMinAndMax) {
                   commonRestriction.restrictions = dateBasedCommonRestrictions[commonRestriction.date].restrictions
                }
            });

        });

        //everything set, update the view
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    };

    var getSingleRateRowDetailsAndUpdateCachedDataModel = (rateID, fromDate, toDate) => {
        var params = {
            from_date: fromDate,
            to_date: toDate,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions: true,
            'rate_ids[]': [rateID]
        };

        var options = {
            params: params,
            onSuccess: onFetchGetSingleRateRowDetailsAndUpdateCachedDataModel,
            successCallBackParameters: {
                rateID, fromDate, toDate
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);       
    };

    /**
     * to fetch the room type & it's restrcitions
     * @param  {Object} filterValues
     */
    var fetchRoomTypeAndRestrictions = (filterValues) => {
        var params = {
            from_date: formatDateForAPI(filterValues.fromDate),
            to_date: formatDateForAPI(filterValues.toDate),
            order_id: filterValues.orderBySelectedValue,
            'name_card_ids[]': _.pluck(filterValues.selectedCards, 'id'),
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchCommonRestrictions: true
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
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
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
    var onCloseAllRestrictionsForSingleRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /**
     * react callback to close all restriction
     * @param  {Object} params
     */
    var closeAllRestrictionsForSingleRateView = (params) => {
        params.rate_id = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForSingleRateViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /**
     * react callback to close all restriction
     * @param  {Object} params
     */
    var closeAllRestrictionsForRateView = (params) => {
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForRateViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /**
     * react callback to open all restriction
     * @param  {Object} params
     */
    var openAllRestrictionsForRateView = (params) => {
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForRateViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /**
     * react callback to close all restriction
     * @param  {Object} params
     */
    var closeAllRestrictionsForRateView = (params) => {
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForRateViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /**
     * react callback to open all restriction
     * @param  {Object} params
     */
    var openAllRestrictionsForRateView = (params) => {
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForRateViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForRoomTypeViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /**
     * react callback to close all restriction
     * @param  {Object} params
     */
    var closeAllRestrictionsForRoomTypeView = (params) => {
        var options = {
            params: params,
            onSuccess: onCloseAllRestrictionsForRoomTypeViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForRoomTypeViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /**
     * react callback to open all restriction
     * @param  {Object} params
     */
    var openAllRestrictionsForRoomTypeView = (params) => {
        var options = {
            params: params,
            onSuccess: onOpenAllRestrictionsForRoomTypeViewSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /**
     * on taping the back button from the top bar (NOT from the HEADER)
     */
    $scope.clickedOnBackButton = () => {
        activeFilterIndex = activeFilterIndex - 1;
        lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;
        
        //setting the current scroll position as STILL
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;

        //clearing the cached to perform fresh request
        cachedRateAndRestrictionResponseData = [];

        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
        $scope.showBackButton = false;
    };

    /**
     * [description]
     * @param  {[type]} options.roomTypeIDs [description]
     * @param  {[type]} options.date        [description]
     * @return {[type]}                     [description]
     */
    const clickedOnRoomTypeAndAmountCell = ({ roomTypeIDs, date }) => {
        var rateID = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;
        return roomTypeIDs.length === 0 ? 
            fetchMultipleRoomTypeRestrictionsAndAmountDetailsForPopup(rateID, date) :
            fetchSingleRoomTypeRestrictionAndAmountDetailsForPopup(rateID, roomTypeIDs[0], date); 
    };

    /**
     * utility method to pass callbacks from
     * @return {Object} with callbacks
     */
    const getTheCallbacksFromAngularToReact = () => {
        return {
            singleRateViewCallback: fetchSingleRateDetailsFromReact,
            openAllCallbackForSingleRateView: openAllRestrictionsForSingleRateView,
            closeAllCallbackForSingleRateView: closeAllRestrictionsForSingleRateView,
            closeAllRestrictionsForRateView,
            openAllRestrictionsForRateView,
            closeAllRestrictionsForRoomTypeView,
            openAllRestrictionsForRoomTypeView,
            clickedOnRateViewCell,
            clickedOnRoomTypeViewCell,
            clickedOnRoomTypeAndAmountCell,
            allRatesScrollReachedBottom,
            allRatesScrollReachedTop
        }
    };

    /**
     * to show the restriction popup
     * @param  {Oject} data
     */
    var showRateRestrictionPopup = (data) => {
        ngDialog.open({
            template: '/assets/partials/rateManager_/popup/rvRateManagerRateRestrictionPopup.html',
            scope: $scope,
            className: 'ngdialog-theme-default',
            data: data,
            controller: 'rvRateManagerRestrictionAndAmountPopupCtrl'
        });
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
     * to catch the error messages emitting from child controllerss
     * @param  {Object} event
     * @param  {array} errorMessage
     */
    $scope.$on('showErrorMessage', (event, errorMessage) => {
        $scope.errorMessage = errorMessage;
        runDigestCycle();
    });

    /**
     * [description]
     * @param  {[type]} headerData [description]
     * @param  {[type]} bottomData [description]
     * @return {[type]}            [description]
     */
    var updateShowingData = (headerData, bottomData) => {
        showingData = {
            headerData: headerData,
            bottomData: bottomData
        }
    };

    /**
     * to identify and set column position to focus when rerendered with new data
     * @param  {integer} scrollWidth
     * @param  {integer} xScrollPosition
     */
    var setScrollColForAllRates = (scrollWidth, xScrollPosition) => {

        //identifying the column to focus soon after rerenderng with new data
        var abs = Math.abs,
            numberOfDates = showingData.headerData.length,
            eachColWidth = abs(scrollWidth) / numberOfDates,
            col = Math.ceil( abs(xScrollPosition) / eachColWidth );
        
        col = col !== 0 ? col : 1; //css selector index starting from one

        lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = { 
            col: col,
            offsetY: (abs(xScrollPosition) % eachColWidth)
        };
    };

    /**
     * react callback when scrolled to top
     */
    const allRatesScrollReachedTop = (xScrollPosition, scrollWidth, yScrollPosition, scrollHeight) => {
        //we dont want the infinite scroller functionality in multiple rate selected view
        if(lastSelectedFilterValues[activeFilterIndex].selectedRates.length > 1) {
            return;
        }

        //setting the scroll col position to focus after rendering
        setScrollColForAllRates(scrollWidth, xScrollPosition);

        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.UP;

        lastSelectedFilterValues[activeFilterIndex].allRate.currentPage--;
        if(lastSelectedFilterValues[activeFilterIndex].allRate.currentPage === 0){
           lastSelectedFilterValues[activeFilterIndex].allRate.currentPage = 1;
           return;
        }
        lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;
        
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /**
     * react callback when scrolled to bottom
     */
    const allRatesScrollReachedBottom = (xScrollPosition, scrollWidth, yScrollPosition, scrollHeight) => {
        //we dont want the infinite scroller functionality in multiple rate selected view
        if(lastSelectedFilterValues[activeFilterIndex].selectedRates.length > 1) {
            return;
        }

        //setting the scroll col position to focus after rendering
        setScrollColForAllRates(scrollWidth, xScrollPosition);

        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.DOWN;
        lastSelectedFilterValues[activeFilterIndex].allRate.currentPage++;
        
        var lastPage = Math.ceil(totalRatesCountForPagination / paginationRatePerPage);

        //reached last page
        if( lastSelectedFilterValues[activeFilterIndex].allRate.currentPage > lastPage ) {
            lastSelectedFilterValues[activeFilterIndex].allRate.currentPage = lastPage;
            return;
        }

        lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;
        
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /**
     * handle method to porcess the response for 'All Rates mode'
     * @param  {Object} response
     */
    var processForAllRates = (response) => {
        var rateRestrictions = [...response.dailyRateAndRestrictions],
            commonRestrictions = response.commonRestrictions;

        //rateList now cached, we will not fetch that again
        cachedRateList = !cachedRateList.length ? response.rates : cachedRateList;

        //for topbar
        var dates = _.pluck(rateRestrictions, 'date');
        showAndFormDataForTopBar(dates);

        var ratesWithRestrictions = formRenderingDataModelForAllRates(dates, rateRestrictions, commonRestrictions, cachedRateList);
        
        updateAllRatesView(ratesWithRestrictions, dates);

        //we need to keep track what we're showing the react part for determining the scrolling position & other things later. so,
        updateShowingData(dates, ratesWithRestrictions);

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
    };

    /**
     * to update all rates views
     * @param  {array} ratesWithRestrictions
     * @param  {array} dates
     */
    const updateAllRatesView = (ratesWithRestrictions, dates) => {
        var reduxActionForAllRateView = {
            type                : RM_RX_CONST.RATE_VIEW_CHANGED,
            rateRestrictionData : [...ratesWithRestrictions],
            zoomLevel           : lastSelectedFilterValues[activeFilterIndex].zoomLevel,
            businessDate        : tzIndependentDate($rootScope.businessDate),
            callbacksFromAngular: getTheCallbacksFromAngularToReact(),
            dates,
            restrictionTypes,
        };

        //we will attach scrollTo if attached filter from somewhere
        if(_.has(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo')) {
            reduxActionForAllRateView.scrollTo = lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo;

            //dropping scrollTo from
            lastSelectedFilterValues[activeFilterIndex].allRate = 
                _.omit(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo');
        }

        //dispatching to redux
        store.dispatch(reduxActionForAllRateView);
    };

    /**
     * to form the rendering data model (for react) against all rates
     * @param  {array} dates
     * @param  {array} rateRestrictions
     * @param  {array} commonRestrictions
     * @param  {array} rates
     * @return {array}
     */
    const formRenderingDataModelForAllRates = (dates, rateRestrictions, commonRestrictions, rates) => {
        var dateRateSet = null,
            rateRestrictionWithDateAsKey = _.object(dates, rateRestrictions),
            rateIDs = _.pluck(rates, 'id'),
            rateObjectBasedOnID = _.object(rateIDs, rates);

        //rate & restrictions -> 2nd row onwards
        var ratesWithRestrictions = rateRestrictions[0].rates.map((rate) => {
            rate = {...rate, ...rateObjectBasedOnID[rate.id]};
            rate.restrictionList = [];
            dates.map((date) => {
                    dateRateSet = _.findWhere(rateRestrictionWithDateAsKey[date].rates, { id: rate.id });
                    rate.restrictionList.push(dateRateSet.restrictions);
                }
            );
            return _.omit(rate, 'restrictions');
        });

        //forming the top row (All rates) with common restrictions
        ratesWithRestrictions.unshift({
            restrictionList: dates.map((date) => {
                return _.findWhere(commonRestrictions, { date: date }).restrictions;
            })
        });
        return ratesWithRestrictions;
    };

    /**
     * to show & form the data required for topbar
     * @param  {array} dates [description]
     */
    const showAndFormDataForTopBar = (dates) => {
        $scope.fromDate = dates[0];
        $scope.toDate = dates[dates.length - 1];
        $scope.showTopBar = true;
        $scope.selectedCardNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedCards, 'account_name');
        $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');
    };

    /**
     * when the daily rates success
     * @param  {Object}
     * @param  {Object}
     */
    var onFetchDailyRatesSuccess = (response) => {
        /* 
            TWO CASES
            1. if the response has more than one rate, will redirect to all rates view
            2. if the response has only one rate, will redirect to single rate's expandable view if the request got initiated from 'Left side filter'
        */
        var numberOfRates = response.dailyRateAndRestrictions[0].rates.length;
        if(numberOfRates === 1 && 
            _.has(lastSelectedFilterValues[activeFilterIndex], 'fromLeftFilter') && lastSelectedFilterValues[activeFilterIndex].fromLeftFilter) {
            
            let rates = !cachedRateList.length ? response.rates : cachedRateList;
            
            //rateList now cached, we will not fetch that again
            cachedRateList = rates;     
            
            lastSelectedFilterValues[activeFilterIndex].selectedRates = _.where(rates, { id:response.dailyRateAndRestrictions[0].rates[0].id });

            fetchSingleRateDetailsAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
        }
        else if(numberOfRates === 0) {
            hideAndClearDataForTopBar();
            showNoResultsPage();
        }
        else{
            let dates = _.pluck(response.dailyRateAndRestrictions, 'date'),
                dateParams = {
                    fromDate: dates[0],
                    toDate: dates[dates.length - 1] 
                };

            //if we haven't fetched common restriction, we've to use the cached response's common restriction
            if(!_.has(response, 'commonRestrictions')) {
                let cachedData = _.findWhere(cachedRateAndRestrictionResponseData, dateParams);
                if(cachedData && _.has(cachedData, 'response')) {
                    response.commonRestrictions = cachedData.response.commonRestrictions;
                }
                else {
                    console.error('response key or caching is missing from cachedRateAndRestrictionResponseData');
                }
            }
            //if common restrictions in new response,
            else {
                let cachedDataSpansInDate = _.where(cachedRateAndRestrictionResponseData, dateParams);
                cachedDataSpansInDate.map(cachedData => {
                    cachedData.response.commonRestrictions = response.commonRestrictions;
                });
            }
            cachedRateAndRestrictionResponseData.push({
                ...dateParams,
                page: lastSelectedFilterValues[activeFilterIndex].allRate.currentPage,
                response: response
            });
console.log(cachedRateAndRestrictionResponseData);
            //using this variable we will be limiting the api call
            totalRatesCountForPagination = response.totalCount;

            return handleAddingAllRateNewResponse(response);
        }
        
    };

    /**
     * to fill the bottom with new response
     * @param  {Array} newResponse
     * @return {Array}             [description]
     */
    var fillAllRatesBottomWithNewResponseAndAdjustScrollerPosition = (newResponse) => {
        var filterValues        = lastSelectedFilterValues[activeFilterIndex],
            dataSetJustBeforeCurrentOne = _.findWhere(cachedRateAndRestrictionResponseData,
                {
                    fromDate    : formatDateForAPI(filterValues.fromDate),
                    toDate      : formatDateForAPI(filterValues.toDate),
                    page        : (filterValues.allRate.currentPage - 1)
                });

        //we will modify this with new response's rates
        var dataSetToReturn = {
            ...dataSetJustBeforeCurrentOne.response
        };

        var numberOfRatesToShowFromPrevious = rvRateManagerPaginationConstants.allRate.additionalRowsToPickFromPrevious,
            newResponseRateLength = newResponse.dailyRateAndRestrictions[0].rates.length,
            oldResponseRatelength = dataSetToReturn.dailyRateAndRestrictions[0].rates.length,
            ratesIndexForSlicing = oldResponseRatelength - numberOfRatesToShowFromPrevious;


        //setting the row to focus soon after rendering
        //column should be assigned from 'allRatesScrollReachedBottom'
        lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo.row = numberOfRatesToShowFromPrevious;

        //if we have less data coming from the api side, usually end of the page.
        if(newResponseRateLength < paginationRatePerPage) {
            ratesIndexForSlicing = newResponseRateLength;
            lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo.row = oldResponseRatelength - newResponseRateLength;
        }
        
        var slicedRates = [];

        dataSetToReturn.dailyRateAndRestrictions = dataSetToReturn.dailyRateAndRestrictions
            .map((dailyRateAndRestriction) => {
                dailyRateAndRestriction = {...dailyRateAndRestriction};

                slicedRates = dailyRateAndRestriction.rates.slice( ratesIndexForSlicing );
                
                dailyRateAndRestriction.rates = [
                    ...slicedRates,
                    ..._.findWhere(newResponse.dailyRateAndRestrictions, { date: dailyRateAndRestriction.date }).rates
                ]
                return dailyRateAndRestriction;
            });
        
        return dataSetToReturn;
    };

    /**
     * to fill the top with new response
     * @param  {Array} newResponse
     * @return {Array}             [description]
     */
    var fillAllRatesTopWithNewResponseAndAdjustScrollerPosition = (newResponse) => {
        var filterValues        = lastSelectedFilterValues[activeFilterIndex],
            dataSetJustAfterCurrentOne = _.findWhere(cachedRateAndRestrictionResponseData,
                {
                    fromDate    : formatDateForAPI(filterValues.fromDate),
                    toDate      : formatDateForAPI(filterValues.toDate),
                    page        : (filterValues.allRate.currentPage + 1)
                });

        //we will modify this with new response's 
        var dataSetToReturn = {
            ...dataSetJustAfterCurrentOne.response
        };

        var indexForPickingUp = paginationRateMaxRowsDisplay - paginationRatePerPage;

        //setting the row to focus soon after rendering
        //column should be assigned from 'allRatesScrollReachedBottom'
        var numberOfRatesInNewResponse = newResponse.dailyRateAndRestrictions[0].rates.length;
        lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo.row = numberOfRatesInNewResponse - indexForPickingUp * 2;

        dataSetToReturn.dailyRateAndRestrictions = dataSetToReturn.dailyRateAndRestrictions
            .map((dailyRateAndRestriction) => {
                dailyRateAndRestriction = {...dailyRateAndRestriction}; //for fixing the issue of 
                dailyRateAndRestriction.rates = [
                    ..._.findWhere(newResponse.dailyRateAndRestrictions, { date: dailyRateAndRestriction.date }).rates,
                    ...dailyRateAndRestriction.rates.slice( 0, indexForPickingUp )
                ]
                return dailyRateAndRestriction;
            });
        
        return dataSetToReturn;
    };

    /**
     * to handle the pagintion data
     * will parse and form a data set from cachec response data and previous/next data response
     * @param  {Object} dataFoundInCachedResponse
     */
    var handleAddingAllRateNewResponse = (cachedResponse) => {
        var dataSetToReturn = [];

        switch(lastSelectedFilterValues[activeFilterIndex].scrollDirection) {
            
            case rvRateManagerPaginationConstants.scroll.DOWN:
                dataSetToReturn = fillAllRatesBottomWithNewResponseAndAdjustScrollerPosition(cachedResponse);
                break;

            case rvRateManagerPaginationConstants.scroll.UP:
                dataSetToReturn = fillAllRatesTopWithNewResponseAndAdjustScrollerPosition(cachedResponse);
                break;

            case rvRateManagerPaginationConstants.scroll.STILL:
                dataSetToReturn = cachedResponse;
                break;                                 
        }
        processForAllRates(dataSetToReturn);
    };

    /**
     * to form the rendering data model (for react) against all rates
     * @param  {array} dates
     * @param  {array} roomTypeRestrictions
     * @param  {array} commonRestrictions
     * @param  {array} room types
     * @return {array}
     */
    var formRenderingDataModelForAllRoomTypes = (dates, roomTypeRestrictions, commonRestrictions, roomTypes) => {
        var dateRoomTypeSet = null,
            roomTypeRestrictionWithDateAsKey = _.object(dates, roomTypeRestrictions),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeObjectBasedOnID = _.object(roomTypeIDs, roomTypes);

        //rate & restrictions -> 2nd row onwards
        var roomTypeWithRestrictions = roomTypeRestrictions[0].room_types.map((roomType) => {
            roomType.restrictionList = [];

            roomType = {...roomType, ...roomTypeObjectBasedOnID[roomType.id]};

            dates.map((date) => {
                dateRoomTypeSet = _.findWhere(roomTypeRestrictionWithDateAsKey[date].room_types, {id: roomType.id});
                roomType.restrictionList.push(dateRoomTypeSet.restrictions);
            });

            return _.omit(roomType, 'restrictions');
        });

        //forming the top row (All rates) with common restrictions
        roomTypeWithRestrictions.unshift({
            restrictionList: dates.map((date) => {
                return _.findWhere(commonRestrictions, { date: date }).restrictions;
            })
        });

        return roomTypeWithRestrictions;
    };

    /**
     * to update all room types view with latest data
     * updating the store by dispatching the action
     * @param  {array} roomTypeWithRestrictions
     * @param  {array} dates
     */
    var updateAllRoomTypesView = (roomTypeWithRestrictions, dates) => {
        var reduxActionForAllRoomTypesView = {
            type                : RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED,
            roomTypeRestrictionData : [...roomTypeWithRestrictions],
            businessDate        : tzIndependentDate($rootScope.businessDate),
            callbacksFromAngular: getTheCallbacksFromAngularToReact(),
            dates,
            restrictionTypes,
        };

        //dispatching to redux
        store.dispatch(reduxActionForAllRoomTypesView);
    };

    /**
     * method to process the response for 'All Room types'
     * @param  {Object} response
     */
    var processRoomTypesAndRestrictionForAllRoomType = (response) => {
        var roomTypeRestrictions = response.roomTypeAndRestrictions,
            commonRestrictions = response.commonRestrictions;

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList;

        //for topbar
        var dates = _.pluck(roomTypeRestrictions, 'date');
        showAndFormDataForTopBar(dates);

        var roomTypeWithRestrictions = formRenderingDataModelForAllRoomTypes(dates, roomTypeRestrictions, commonRestrictions, cachedRoomTypeList);

        //updating the view with results
        updateAllRoomTypesView(roomTypeWithRestrictions, dates);

        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);        
    };

    /**
     * when the daily rates success
     * @param  {Object}
     */
    var onFetchRoomTypeAndRestrictionsSuccess = (response) => {
        var numberOfRoomTypes = response.roomTypeAndRestrictions[0].room_types;
        if(numberOfRoomTypes === 0) {
            hideAndClearDataForTopBar();
            showNoResultsPage();            
        }
        else {
            processRoomTypesAndRestrictionForAllRoomType(response);
        }
    };

    /**
     * to fetch the daily rates
     * @param  {Object} filter values
     */
    var fetchDailyRates = (filterValues) => {
        var dataFoundInCachedResponse = _.findWhere(cachedRateAndRestrictionResponseData,
            {
                fromDate: formatDateForAPI(filterValues.fromDate),
                toDate: formatDateForAPI(filterValues.toDate),
                page: lastSelectedFilterValues[activeFilterIndex].allRate.currentPage
            });
        //if data already in cache
        if(dataFoundInCachedResponse) {
            return handleAddingAllRateNewResponse(dataFoundInCachedResponse.response)
        }

        let fetchCommonRestrictions = true;

        var cachedRateAndRestrictionOfFromDateAndToDate = _.where(cachedRateAndRestrictionResponseData,
            {
                fromDate: formatDateForAPI(filterValues.fromDate),
                toDate: formatDateForAPI(filterValues.toDate)   
            });

        cachedRateAndRestrictionOfFromDateAndToDate.map(cachedRateAndRestriction => {
            if(cachedRateAndRestriction.response.commonRestrictions.length) {
                fetchCommonRestrictions = false;
            }
        });


        var params = {
            from_date: formatDateForAPI(filterValues.fromDate),
            to_date: formatDateForAPI(filterValues.toDate),
            order_id: filterValues.orderID,
            'name_card_ids[]': _.pluck(filterValues.selectedCards, 'id'),
            group_by: filterValues.groupBySelectedValue,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions
        };

        if (filterValues.selectedRateTypes.length) {
            params['rate_type_ids[]'] = _.pluck(filterValues.selectedRateTypes, 'id');
        }

        if (filterValues.selectedRates.length) {
            params['rate_ids[]'] = _.pluck(filterValues.selectedRates, 'id');
        }

        params['page'] = filterValues.allRate.currentPage;
        params['per_page'] = paginationRatePerPage;

        var options = {
            params: params,
            onSuccess: onFetchDailyRatesSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
    };



    /**
     * on api call success against rate cell click
     * @param  {Object} response
     * @param  {Object} successCallBackParameters
     */
    var onFetchMultipleRateRestrictionDetailsForRateCell = (response, successCallBackParameters) => {
        var restrictionData = response.dailyRateAndRestrictions,
            commonRestrictions = response.commonRestrictions[0].restrictions,
            rates = !cachedRateList.length ? response.rates : cachedRateList,
            rateIDs = successCallBackParameters.rateIDs,
            rates = rates.filter(rate => (rateIDs.indexOf(rate.id) > -1 ? rate : false));

        //caching the rate list
        cachedRateList = rates;

        var data = {
            rates,
            mode: rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE,
            restrictionData,
            restrictionTypes,
            date: successCallBackParameters.date,
            commonRestrictions
        };
        showRateRestrictionPopup(data);
    };

    /**
     * [description]
     * @param  {[type]} rateIDs [description]
     * @param  {[type]} date    [description]
     * @return {[type]}         [description]
     */
    var fetchMultipleRateRestrictionsDetailsForPopup = (rateIDs, date) => {
        //calling the API to get the details
        var params = {
            'rate_ids[]': rateIDs,
            from_date: date,
            to_date: date,
            fetchCommonRestrictions: true
        };
        var options = {
            params,
            onSuccess: onFetchMultipleRateRestrictionDetailsForRateCell,
            successCallBackParameters: {
                rateIDs,
                date
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
    };

    /**
     * [description]
     * @param  {[type]} response                  [description]
     * @param  {[type]} successCallBackParameters [description]
     * @return {[type]}                           [description]
     */
    var onFetchSingleRateRestrictionModeDetailsForPopup = (response, successCallBackParameters) => {
        var restrictionData = response.roomTypeAndRestrictions,
            roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            commonRestrictions = response.commonRestrictions[0].restrictions,
            roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                .room_types.map(roomType =>
                    ({
                        ...roomType,
                        ..._.findWhere(roomTypes, {id: roomType.id})
                    }));

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        var data = {
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE,
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            date: successCallBackParameters.date,
            roomTypesAndPrices,
            restrictionData,
            restrictionTypes,
            commonRestrictions
        };
        showRateRestrictionPopup(data);
    };

    /**
    * [description]
    * @param  {[type]} options.rateID [description]
    * @param  {[type]} options.date   [description]
    * @return {[type]}                [description]
    */
    var fetchSingleRateRestrictionModeDetailsForPopup = (rateID, date) => {
        var params = {
            from_date: date,
            to_date: date,
            rate_id: rateID,
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions: true
        };
        var options = {
            params,
            onSuccess: onFetchSingleRateRestrictionModeDetailsForPopup,
            successCallBackParameters: {
                rateID,
                date
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndRoomTypes, options);
    };

    /**
     * callback from react when clicked on a cell in rate view
     */
    var clickedOnRateViewCell = ({rateIDs, date}) => {
        return rateIDs.length > 1 ?
            fetchMultipleRateRestrictionsDetailsForPopup(rateIDs, date) :
            fetchSingleRateRestrictionModeDetailsForPopup(rateIDs[0], date);
    };

    /**
     * when api call for fetching the room type restriction details's popup
     * @param  {Object} response
     */
    var onFetchSingleRoomTypeRestrictionDetailsForPopupSuccess = (response, successCallBackParameters) => {
        var restrictionData = response.roomTypeAndRestrictions,
            roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                .room_types.map(roomType =>
                    ({
                        ...roomType,
                        ..._.findWhere(roomTypes, {id: roomType.id})
                    }));

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        var data = {
            roomTypesAndPrices,
            restrictionData,
            restrictionTypes,
            mode: rvRateManagerPopUpConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE,
            roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
            date: successCallBackParameters.date
        };
        showRateRestrictionPopup(data);
    };

    /**
     * to fetch the restriction data for 
     * @param  {Integer} roomTypeID
     * @param  {String} date          
     */
    var fetchSingleRoomTypeRestrictionDetailsForPopup = (roomTypeID, date) => {
        var params = {
            from_date: date,
            to_date: date,
            room_type_id: roomTypeID,
            fetchRoomTypes: !cachedRoomTypeList.length
        };
        var options = {
            params: params,
            onSuccess: onFetchSingleRoomTypeRestrictionDetailsForPopupSuccess,
            successCallBackParameters: {
                roomTypeID,
                date
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndRoomTypes, options);
    };

    /**
    * on api call success against header room type cell click
    * @param  {Object} response
    */
    var onFetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess = (response, successCallBackParameters) => {
        var restrictionData = response.roomTypeAndRestrictions,
            commonRestrictions = response.commonRestrictions[0].restrictions,
            roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                .room_types.map(roomType =>
                    ({
                        ...roomType,
                        ..._.findWhere(roomTypes, {id: roomType.id})
                    }));

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        var data = {
            roomTypesAndPrices,
            commonRestrictions,
            restrictionData,
            restrictionTypes,
            mode: rvRateManagerPopUpConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE,
            date: successCallBackParameters.date
        };
        showRateRestrictionPopup(data);
    };

    /**
    * to fetch a day room type common restriction details
    */
    var fetchMultipleRoomTypeRestrictionsDetailsForPopup = (date) => {
        //calling the API to get the details
        var params = {
            from_date: date,
            to_date: date,
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchCommonRestrictions: true
        };
        var options = {
            params,
            onSuccess: onFetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess,
            successCallBackParameters: {
                date
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndRoomTypes, options);
    };

    /**
     * callback from react when clicked on a cell in roomtype view
     */
    var clickedOnRoomTypeViewCell = ({roomTypeIDs, date}) => {
        return roomTypeIDs.length === 0 ? 
            fetchMultipleRoomTypeRestrictionsDetailsForPopup(date) :
            fetchSingleRoomTypeRestrictionDetailsForPopup(roomTypeIDs[0], date);
    };

    /**
     * when api call for fetching the room type restriction details's popup
     * @param  {Object} response
     */
    var onFetchSingleRoomTypeRestrictionAndAmountDetailsForPopupSuccess = (response, successCallBackParameters) => {
        var roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            rates = !cachedRateList.length ? response.rates : cachedRateList,
            roomTypePricesAndRestrictions = response.roomTypeAndRestrictions[0];

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        //rateList is now cached
        cachedRateList = rates;

        var data = {
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
            roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            rates: cachedRateList,
            date: successCallBackParameters.date,
            restrictionTypes,
            roomTypePricesAndRestrictions
        };
        showRateRestrictionPopup(data);
    };

    /**
     * to fetch the restriction data for 
     * @param  {Integer} roomTypeID
     * @param  {String} date          
     */
    var fetchSingleRoomTypeRestrictionAndAmountDetailsForPopup = (rateID, roomTypeID, date) => {
        var params = {
            from_date: date,
            to_date: date,
            room_type_id: roomTypeID,
            rate_id: rateID,
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchRates: !cachedRateList.length
        };
        var options = {
            params: params,
            onSuccess: onFetchSingleRoomTypeRestrictionAndAmountDetailsForPopupSuccess,
            successCallBackParameters: {
                roomTypeID,
                date,
                rateID
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndRoomTypes, options);
    };

    /**
     * when api call for fetching the room type restriction details's popup
     * @param  {Object} response
     */
    var onFetchMultipleRoomTypeRestrictionsAndAmountDetailsForPopup = (response, successCallBackParameters) => {
        var roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            rates = !cachedRateList.length ? response.rates : cachedRateList,
            commonRestrictions = response.commonRestrictions[0].restrictions,
            roomTypePricesAndRestrictions = response.roomTypeAndRestrictions[0];

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        //rateList is now cached
        cachedRateList = rates;

        var data = {
            roomTypePricesAndRestrictions,
            commonRestrictions,
            restrictionTypes,
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            rates: cachedRateList,
            date: successCallBackParameters.date
        };
        showRateRestrictionPopup(data);
    };

    /**
     * to fetch the restriction data for 
     * @param  {Integer} roomTypeID
     * @param  {String} date          
     */
    var fetchMultipleRoomTypeRestrictionsAndAmountDetailsForPopup = (rateID, date) => {
        var params = {
            from_date: date,
            to_date: date,
            rate_id: rateID,
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions: true
        };
        var options = {
            params: params,
            onSuccess: onFetchMultipleRoomTypeRestrictionsAndAmountDetailsForPopup,
            successCallBackParameters: {
                date,
                rateID
            }
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndRoomTypes, options);
    };

    /**
     * to form the data model for single rate view
     * @type {array} dates
     * @type {array} roomTypeAmountAndRestrictions
     * @type {array} commonRestrictions
     * @type {array} roomTypes
     * @return {array}
     */
    var formRenderingDataModelForSingleRateDetailsAndRestrictions = 
        (dates, roomTypeAmountAndRestrictions, commonRestrictions, roomTypes) => {
        
        var dateRoomTypeSet = null,
            roomTypeRestrictionWithDateAsKey = _.object(dates, roomTypeAmountAndRestrictions),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeObjectBasedOnID = _.object(roomTypeIDs, roomTypes);

        //2nd row onwards
        var roomTypeWithRestrictions = roomTypeAmountAndRestrictions[0].room_types
            .map(roomType => {
                
                roomType = {
                    ...roomType, 
                    ...roomTypeObjectBasedOnID[roomType.id]
                };

                roomType = _.pick(roomType, 'id', 'name', 'restrictions');
                roomType.restrictionList = [];
                roomType.rateDetails = [];

                dates.map( date => {
                    dateRoomTypeSet = _.findWhere( roomTypeRestrictionWithDateAsKey[date].room_types, { id: roomType.id } );
                    
                    roomType.restrictionList.push(dateRoomTypeSet.restrictions);
                    roomType.rateDetails.push(_.omit(dateRoomTypeSet, 
                            'restrictions',
                            'id',
                            'rateDetails',
                            'restrictionList'));
                });
                return _.omit(roomType, 'restrictions');
            }
        );

        //first row
        roomTypeWithRestrictions.unshift({
            rateDetails: [],
            restrictionList: dates.map((date) => {
                return _.findWhere(commonRestrictions, {date: date}).restrictions;
            })
        });

        return roomTypeWithRestrictions;
    }; 

    /**
     * to update single rate type view with latest data
     * updating the store by dispatching the action
     * @param  {array} roomTypeWithAmountAndRestrictions
     * @param  {array} dates
     */
    var updateSingleRatesView = (roomTypeWithAmountAndRestrictions, dates) => {
        store.dispatch({
            type                        : RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED,
            singleRateRestrictionData   : [...roomTypeWithAmountAndRestrictions],
            zoomLevel                   : lastSelectedFilterValues[activeFilterIndex].zoomLevel,
            businessDate                : tzIndependentDate($rootScope.businessDate),
            callbacksFromAngular        : getTheCallbacksFromAngularToReact(),
            restrictionTypes,
            dates,
        });
    };

    /**
     * when single rate details api call success
     * @param  {Object} response
     */
    var onFetchSingleRateDetailsAndRestrictions = (response) => {
        var roomTypeAmountAndRestrictions = response.roomTypeAndRestrictions,
            commonRestrictions = response.commonRestrictions;

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList;

        //we will be showing 'No Results' page, if returned result contain zero room types
        var totalRoomTypesToShow = roomTypeAmountAndRestrictions[0].room_types.length;
        if(totalRoomTypesToShow === 0) {
            hideAndClearDataForTopBar();
            showNoResultsPage();
            return;
        };

        //topbar
        var dates = _.pluck(roomTypeAmountAndRestrictions, 'date');
        showAndFormDataForTopBar(dates);

        //grid view data model
        var roomTypeWithAmountAndRestrictions = formRenderingDataModelForSingleRateDetailsAndRestrictions
            (dates, roomTypeAmountAndRestrictions, commonRestrictions, cachedRoomTypeList);
        
        //let's view results ;)
        updateSingleRatesView(roomTypeWithAmountAndRestrictions, dates);
        
        //closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
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
        $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');

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
            rate_id: filterValues.selectedRates[0].id,
            'name_card_ids[]': _.pluck(filterValues.selectedCards, 'id'),
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions: true
        };
        var options = {
            params: params,
            onSuccess: onFetchSingleRateDetailsAndRestrictions
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndRoomTypes, options);
    };


    /**
     * to hide & clear the data required for topbar
     */
    const hideAndClearDataForTopBar = () => {
        $scope.showTopBar = false;
        $scope.selectedCardNames = [];
        $scope.selectedRateNames = [];
    };

    /**
     * to show no results page
     */
    const showNoResultsPage = () => {
        store.dispatch({
            type: RM_RX_CONST.SHOW_NO_RESULTS
        });
    };
    
    /**
     * [description]
     * @return {[type]} [description]
     */
    const initializePaginationValues = () => {
        var totalHeightOfContainer = angular.element('.rate-manager-content')[0].offsetHeight;
        var ratePagination = rvRateManagerPaginationConstants.allRate;

        paginationRatePerPage = 
            Math.ceil(totalHeightOfContainer/ratePagination.rowHeight) + 3;

        paginationRateMaxRowsDisplay = paginationRatePerPage + ratePagination.additionalRowsToPickFromPrevious;
    };

    /**
     * to update results
     * @param  {Object} event
     * @param  {Object} newFilterValues)
     */
    $scope.$on(rvRateManagerEventConstants.UPDATE_RESULTS, (event, newFilterValues) => {
        //Storing for further reference
        if (_.has(newFilterValues, 'fromLeftFilter') && newFilterValues.fromLeftFilter) {
            
            //setting the current scroll position as STILL
            newFilterValues.scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;

            lastSelectedFilterValues = [{...newFilterValues}]; //ES7
            activeFilterIndex = 0;
            $scope.showBackButton = false;
            totalRatesCountForPagination = 0;
        }

        if (newFilterValues.showAllRates) {
            if (_.has(newFilterValues, 'fromLeftFilter') && newFilterValues.fromLeftFilter) {
                let allRate = {
                    ...lastSelectedFilterValues[activeFilterIndex].allRate,
                    currentPage: 1
                };

                lastSelectedFilterValues[activeFilterIndex].allRate = allRate;
                newFilterValues.allRate = allRate;

                cachedRateAndRestrictionResponseData = [];
            }

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
            if (newFilterValues.selectedRates.length === 1 && !newFilterValues.selectedRateTypes.length)  {
                fetchSingleRateDetailsAndRestrictions(newFilterValues);
            }
            //multiple rate view
            else if (newFilterValues.selectedRates.length > 1 || newFilterValues.selectedRateTypes.length > 0) {
                //calling the api
                let allRate = {
                    ...lastSelectedFilterValues[activeFilterIndex].allRate,
                    currentPage:  1
                };

                lastSelectedFilterValues[activeFilterIndex].allRate = allRate;
                newFilterValues.allRate = allRate;

                cachedRateAndRestrictionResponseData = [];
                totalRatesCountForPagination = 0;
                fetchDailyRates(newFilterValues);
            }
        }

    });


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

    var initialState = {
        mode: RM_RX_CONST.NOT_CONFIGURED_MODE
    };

    const store = configureStore(initialState);

    const {render} = ReactDOM;
    const {Provider} = ReactRedux;

    /**
     * to render the grid view
     */
    var renderGridView = () => render(
        <Provider store={store}>
            <RateManagerRootComponent/>
        </Provider>,
        document.querySelector('#rate-manager .rate-manager-content')
    );

    /**
     * initialisation function
     */
    (() => {
        setHeadingAndTitle('RATE_MANAGER_TITLE');
        initializeDataModel();
        renderGridView();

        //initialize pagination values
        initializePaginationValues();
    })();

}]);
