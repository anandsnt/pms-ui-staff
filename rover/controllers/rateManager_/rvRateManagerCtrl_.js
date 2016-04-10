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
        totalRatesCountForPagination = 0; //for pagination purpose

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
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;
        if(lastSelectedFilterValues[activeFilterIndex].showAllRates) {
            cachedRateAndRestrictionResponseData = [];
        }
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    });


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
            fetchRoomTypes: !cachedRoomTypeList.length
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
     * react callback when scrolled to top
     */
    const allRatesScrollReachedTop = () => {
        //we dont want the infinite scroller functionality in multiple rate selected view
        if(lastSelectedFilterValues[activeFilterIndex].selectedRates.length > 1) {
            return;
        }

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
    const allRatesScrollReachedBottom = () => {
        //we dont want the infinite scroller functionality in multiple rate selected view
        if(lastSelectedFilterValues[activeFilterIndex].selectedRates.length > 1) {
            return;
        }
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.DOWN;

        lastSelectedFilterValues[activeFilterIndex].allRate.currentPage++;
        
        if(Math.ceil(totalRatesCountForPagination / rvRateManagerPaginationConstants.allRate.ratePerPage) < 
            lastSelectedFilterValues[activeFilterIndex].allRate.currentPage) {

            lastSelectedFilterValues[activeFilterIndex].allRate.currentPage = Math.ceil(totalRatesCountForPagination / rvRateManagerPaginationConstants.allRate.ratePerPage);
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
        var rateRestrictions = response.dailyRateAndRestrictions,
            commonRestrictions = response.commonRestrictions;

        //rateList now cached, we will not fetch that again
        cachedRateList = !cachedRateList.length ? response.rates : cachedRateList;

        //for topbar
        var dates = _.pluck(rateRestrictions, 'date');
        showAndformDataForTopBar(dates);

        var ratesWithRestrictions = formRenderingDataModelForAllRates(dates, rateRestrictions, commonRestrictions, cachedRateList);
        
        updateAllRatesView(ratesWithRestrictions, dates);

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

        //dispatching to redux
        store.dispatch(reduxActionForAllRateView);
    };

    /**
     * to form the rendering data model (for react) against all rates
     * @param  {array} dates
     * @param  {array} rateRestrictions
     * * @param  {array} commonRestrictions
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
            rate.restrictionList = [];
            rate = {...rate, ...rateObjectBasedOnID[rate.id]};
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
    const showAndformDataForTopBar = (dates) => {
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
            let dates = _.pluck(response.dailyRateAndRestrictions, 'date');
            cachedRateAndRestrictionResponseData.push({
                fromDate: dates[0],
                toDate: dates[dates.length - 1],
                page: lastSelectedFilterValues[activeFilterIndex].allRate.currentPage,
                response: response
            });

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
    var fillBottomWithNewResponse = (newResponse) => {
        var filterValues        = lastSelectedFilterValues[activeFilterIndex],
            pagintionConst      = rvRateManagerPaginationConstants.allRate,
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

        var indexForPickingUp = pagintionConst.maxNumberOfRateRowsDisplay - pagintionConst.ratePerPage,
            newResponseRateLength = newResponse.dailyRateAndRestrictions[0].rates.length,
            slicedRates = [];

        dataSetToReturn.dailyRateAndRestrictions = dataSetToReturn.dailyRateAndRestrictions
            .map((dailyRateAndRestriction) => {
                dailyRateAndRestriction = {...dailyRateAndRestriction};
                
                //if we have less data coming from the api side, usually end of the page.
                if(newResponseRateLength < pagintionConst.ratePerPage) {
                    indexForPickingUp = pagintionConst.ratePerPage - newResponseRateLength;
                    slicedRates = dailyRateAndRestriction.rates.slice( 0, indexForPickingUp );
                }
                else {
                    slicedRates = dailyRateAndRestriction.rates.slice( indexForPickingUp );
                }

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
    var fillTopWithNewResponse = (newResponse) => {
        var filterValues        = lastSelectedFilterValues[activeFilterIndex],
            pagintionConst      = rvRateManagerPaginationConstants.allRate,
            dataSetJustAfterCurrentOne = _.findWhere(cachedRateAndRestrictionResponseData,
                {
                    fromDate    : formatDateForAPI(filterValues.fromDate),
                    toDate      : formatDateForAPI(filterValues.toDate),
                    page        : (filterValues.allRate.currentPage + 1)
                });

        //we will modify this with new response's rates
        var dataSetToReturn = {
            ...dataSetJustAfterCurrentOne.response
        };

        var indexForPickingUp = pagintionConst.maxNumberOfRateRowsDisplay - pagintionConst.ratePerPage;

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
                dataSetToReturn = fillBottomWithNewResponse(cachedResponse);
                break;

            case rvRateManagerPaginationConstants.scroll.UP:
                dataSetToReturn = fillTopWithNewResponse(cachedResponse);
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
     * @param  {array} room types
     * @return {array}
     */
    var formRenderingDataModelForAllRoomTypes = (dates, roomTypeRestrictions, roomTypes) => {
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
                return roomTypeRestrictionWithDateAsKey[date].all_room_type_restrictions;
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
            zoomLevel           : lastSelectedFilterValues[activeFilterIndex].zoomLevel,
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
        var roomTypeRestrictions = response.roomTypeAndRestrictions;

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList;

        //for topbar
        var dates = _.pluck(roomTypeRestrictions, 'date');
        showAndformDataForTopBar(dates);

        var roomTypeWithRestrictions = formRenderingDataModelForAllRoomTypes(dates, roomTypeRestrictions, cachedRoomTypeList);

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

        var params = {
            from_date: formatDateForAPI(filterValues.fromDate),
            to_date: formatDateForAPI(filterValues.toDate),
            order_id: filterValues.orderID,
            'name_card_ids[]': _.pluck(filterValues.selectedCards, 'id'),
            group_by: filterValues.groupBySelectedValue,
            fetchRates: !cachedRateList.length
        };

        if (filterValues.selectedRateTypes.length) {
            params['rate_type_ids[]'] = _.pluck(filterValues.selectedRateTypes, 'id');
        }

        if (filterValues.selectedRates.length) {
            params['rate_ids[]'] = _.pluck(filterValues.selectedRates, 'id');
        }

        params['page'] = filterValues.allRate.currentPage;
        params['per_page'] = rvRateManagerPaginationConstants.allRate.ratePerPage;

        var options = {
            params: params,
            onSuccess: onFetchDailyRatesSuccess
        };
        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
    };

    /**
     * when the daily rates success
     * @param  {Object}
     */
    var onFetchRoomTypeAndRestrictionsSuccess = (response) => {
        var roomTypeRestrictions = response.roomTypeAndRestrictions,
            roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            dates = _.pluck(roomTypeRestrictions, 'date'),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeWithRestrictions = roomTypeRestrictions[0].room_types,
            roomTypeObjectBasedOnID = {},
            dateRoomTypeSet = null;

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

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
                dateRoomTypeSet = _.findWhere(roomTypeRestrictions[date].room_types, {id: roomType.id});
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
     * on api call success against rate cell click
     * @param  {Object} response
     * @param  {Object} successCallBackParameters
     */
    var onFetchMultipleRateRestrictionDetailsForRateCell = (response, successCallBackParameters) => {
        var restrictionData = response.dailyRateAndRestrictions,
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
            date: successCallBackParameters.date
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
            to_date: date
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
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE,
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            restrictionData,
            restrictionTypes,
            date: successCallBackParameters.date
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
            fetchRates: !cachedRateList.length
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
            mode: rvRateManagerPopUpConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE,
            roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
            restrictionData,
            restrictionTypes,
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
    var onfetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess = (response, successCallBackParameters) => {
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
            mode: rvRateManagerPopUpConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE,
            restrictionData,
            restrictionTypes,
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
            fetchRoomTypes: !cachedRoomTypeList.length
        };
        var options = {
            params,
            onSuccess: onfetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess,
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
            roomTypePricesAndRestrictions,
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
            roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            rates: cachedRateList,
            restrictionTypes,
            date: successCallBackParameters.date
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
            roomTypePricesAndRestrictions = response.roomTypeAndRestrictions[0];

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        //rateList is now cached
        cachedRateList = rates;

        var data = {
            roomTypePricesAndRestrictions,
            mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
            rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
            rates: cachedRateList,
            restrictionTypes,
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
            fetchRates: !cachedRateList.length
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
     * when single rate details api call success
     * @param  {Object} response
     */
    var onFetchSingleRateDetailsAndRestrictions = (response) => {


        var roomTypeRestrictions = response.roomTypeAndRestrictions,
            roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
            dates = _.pluck(roomTypeRestrictions, 'date'),
            roomTypeIDs = _.pluck(roomTypes, 'id'),
            roomTypeWithRestrictions = roomTypeRestrictions[0].room_types,
            roomTypeObjectBasedOnID = {},
            dateRoomTypeSet = null;

        //roomTypeList is now cached, we will not fetch that again
        cachedRoomTypeList = roomTypes;

        if(roomTypeRestrictions[0].room_types.length === 0) {
            hideAndClearDataForTopBar();
            showNoResultsPage();
            return;            
        };

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
                dateRoomTypeSet = _.findWhere(roomTypeRestrictions[date].room_types, {id: roomType.id});
                roomType.restrictionList.push(dateRoomTypeSet.restrictions);
                roomType.rateDetails.push(_.omit(dateRoomTypeSet, 
                        'restrictions',
                        'id',
                        'rateDetails',
                        'restrictionList'));
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
            rate_id: filterValues.selectedRates[0].id,
            'name_card_ids[]': _.pluck(filterValues.selectedCards, 'id'),
            fetchRoomTypes: !cachedRoomTypeList.length,
            fetchRates: !cachedRateList.length
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
                var allRate = {
                    currentPage: 1
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
    })();

}]);
