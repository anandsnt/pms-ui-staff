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

    /*
     * to keep track of last filter choosed
     * coming back from graph view to this
     */
    var lastSelectedFilterValues = [],
        activeFilterIndex = 0;

    /*
     * for pagination purpose
     * @type {Array}
     */
    var cachedRateList = [],
        cachedRoomTypeList = [],
        cachedRateTypeList = [],
        cachedRateAndRestrictionResponseData = [],
        chosenTab = '';

    /**
     * for pagination purpose
     * @type {Integer}
     */
    var totalRatesCountForPagination = 0,
        totalRateTypesCountForPagination = 0,
        paginationRatePerPage = 0,
        paginationRateMaxRowsDisplay = 0; // for pagination purpose

    /**
     * data passed to react, will be used in scrolling related area to find positions
     * @type {Array}
     */
    var showingData = [];

    /*
     * utility method for converting date object into api formated 'string' format
     * @param  {Object} date
     * @return {String}
     */
    var formatDateForAPI = (date) => $filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI);

    /*
     * to set the heading and title
     * @param {String} nonTranslatedTitle
     */
    var setHeadingAndTitle = (nonTranslatedTitle) => {
        var title = $filter('translate')(nonTranslatedTitle);

        $scope.setTitle(title);
        $scope.heading = title;

        // updating the left side menu
        $scope.$emit("updateRoverLeftMenu", "rateManager");
    };

    /*
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

    /*
     * to run angular digest loop,
     * will check if it is not running
     */
    var runDigestCycle = () => {
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    };

    /*
     * to hide & clear the data required for topbar
     */
    const hideAndClearDataForTopBar = () => {
        $scope.showTopBar = false;
        $scope.selectedCardNames = [];
        $scope.selectedRateNames = [];
        $scope.selectedRateTypeNames = [];
        $scope.selectedAccountName = [];
        $scope.selectedAddress = [];
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

    /*
     * we're storing the data model passed to react just for some purpose like
     * identifying scroller position and etc..
     * @param  {array} headerData
     * @param  {array} bottomData
     * @param  {String} actionType
     */
    var addToShowingDataArray = (headerData, bottomData, actionType) => {
        showingData.push({
            headerData,
            bottomData,
            actionType
        });
    };

    /**
     * to have animation while opening & closing
     */
    $rootScope.$on('ngDialog.opened', (e, $dialog) => {
        setTimeout(() => {
            $dialog.addClass('modal-show');
        }, 100);
    });

    /*
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForSingleRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /*
     * react callback to open all restriction
     * @param  {Object} params
     */
    var openAllRestrictionsForSingleRateView = (params) => {
        params.rate_id = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;
        var options = {
            params: params,
            onSuccess: onOpenAllRestrictionsForSingleRateViewSuccess
        };

        $scope.callAPI(rvRateManagerCoreSrv.applyAllRestrictions, options);
    };

    /*
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForSingleRateViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /*
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

    /*
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForRateViewSuccess = response => {
        // we're here at the top and we are going to clean the cache, so setting the scroll position as STILL
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;

        // section of last page & handling the case of not enough data for scroller
        handleTheLastPageAllRatesCase();

        // clearing all, this update will invalidate every cached data
        cachedRateAndRestrictionResponseData = [];

        // this is most likely fresh start, so clearing the rate list as well
        cachedRateList = [];

        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /*
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

    /*
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForRateViewSuccess = response => {

        // we're here at the top and we are going to clean the cache, so setting the scroll position as STILL
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;

        // section of last page & handling the case of not enough data for scroller
        handleTheLastPageAllRatesCase();

        // clearing all, this update will invalidate every cached data
        cachedRateAndRestrictionResponseData = [];

        // this is most likely fresh start, so clearing the rate list as well
        cachedRateList = [];

        $scope.$emit(rvRateManagerEventConstants.RELOAD_RESULTS);
    };

    /*
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

    /*
     * when close all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onCloseAllRestrictionsForRoomTypeViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /*
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

    /*
     * when open all restrcition we need to refresh the view
     * @param  {Object} response [api response]
     */
    var onOpenAllRestrictionsForRoomTypeViewSuccess = response => {
        $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]);
    };

    /*
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

    /*
     * to reload the present mode
     */
    $scope.$on(rvRateManagerEventConstants.RELOAD_RESULTS, (event, data) => {
        var isFromEditingPopup = _.has(data, 'isFromPopup');

        if (isFromEditingPopup) {
            return handleTheReloadRequestFromPopup(data);
        }
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    });

    /*
     * to process the reload request from popup
     * @param {Object} popup data
     */
    var handleTheReloadRequestFromPopup = (data) => {
        var dialogData = data.dialogData;

        switch (dialogData.mode) {
        // the mode against the click of a restriciton cell on rate view mode
        case rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE:
            handleTheReloadRequestFromPopupForSingleRateRestrictionMode(dialogData);
            break;

        case rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE:
            handleTheReloadRequestFromPopupForMultipleRateRestrictionMode(dialogData);
            break;

        case rvRateManagerPopUpConstants.RM_SINGLE_RATE_TYPE_RESTRICTION_MODE:
            handleTheReloadRequestFromPopupForSingleRateTypeRestrictionMode(dialogData);
            break;

        case rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_TYPE_RESTRICTION_MODE:
            handleTheReloadRequestFromPopupForMultipleRateTypeRestrictionMode();
            break;

        case rvRateManagerPopUpConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE:
            $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
            break;

        case rvRateManagerPopUpConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE:
            $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
            break;

        case rvRateManagerPopUpConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
            handleTheReloadRequestFromPopupForSingleRateSingleRoomTypeRestrictionMode();
            break;

        case rvRateManagerPopUpConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE:
            handleTheReloadRequestFromPopupForSingleRateMultipleRoomTypeRestrictionMode();
            break;

        default:
            break;
        }
    };

    /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE'
     */
    var handleTheReloadRequestFromPopupForSingleRateSingleRoomTypeRestrictionMode = () => {
        fetchSingleRateDetailsAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
    };

    /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE'
     */
    var handleTheReloadRequestFromPopupForSingleRateMultipleRoomTypeRestrictionMode = () => {
        fetchSingleRateDetailsAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
    };

    /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE'
     * @param  {Object} dialogData [popup data]
     */
    var handleTheReloadRequestFromPopupForMultipleRateRestrictionMode = (dialogData) => {
        // we're here at the top and we are going to clean the cache, so setting the scroll position as STILL
        lastSelectedFilterValues[activeFilterIndex].scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;

        // section of last page & handling the case of not enough data for scroller
        handleTheLastPageAllRatesCase();

        // clearing all, because the update from popup may impact other days as well
        cachedRateAndRestrictionResponseData = [];

        // this is most likely fresh start, so clearing the rate list as well
        cachedRateList = [];

        // everything set, update the view
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    };

    /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE'
     * @param  {Object} dialogData [popup data]
     */
    var handleTheReloadRequestFromPopupForSingleRateRestrictionMode = (dialogData) => {
        var rateID = dialogData.rate.id;

        // we may changed a rate detail against particular column or rate columns across a particular row
        getSingleRateRowDetailsAndUpdateCachedDataModel(rateID);
    };

     /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_SINGLE_RATE_TYPE_RESTRICTION_MODE'
     * @param  {Object} dialogData [popup data]
     */
    var handleTheReloadRequestFromPopupForSingleRateTypeRestrictionMode = (dialogData) => {
        var rateTypeID = dialogData.rateType.id;

        // we may changed a rate detail against particular column or rate columns across a particular row
        // getSingleRateTypeRowDetailsAndUpdateCachedDataModel(rateTypeID);
        getSingleRateTypeRowDetailsAndUpdateCachedDataModel(rateTypeID);
    };

    /*
     * to handle the reload request from popup against mode 'rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_TYPE_RESTRICTION_MODE'
     */
    var handleTheReloadRequestFromPopupForMultipleRateTypeRestrictionMode = () => {
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    };

    /*
     * All rates - handle the last page case
     * mainly used to ensure that we should be able to see the vertical scrollbar
     */
    var handleTheLastPageAllRatesCase = () => {
        var lastPage = Math.ceil(totalRatesCountForPagination / paginationRatePerPage),
            currentPage = lastSelectedFilterValues[activeFilterIndex].allRate.currentPage;

        var currentPageCachedResponse = _.findWhere(cachedRateAndRestrictionResponseData, {
            page: lastSelectedFilterValues[activeFilterIndex].allRate.currentPage
        });

        var currentPageCachedResponseRateLength = currentPageCachedResponse.response.dailyRateAndRestrictions[0].rates.length;

        var isLastPage = ( currentPage === lastPage ),
            notEnoughDataToShowScroller = ( currentPageCachedResponseRateLength < paginationRatePerPage );

        // section of last page & handling the case of not enough data for scroller
        if ( isLastPage && notEnoughDataToShowScroller)  {

            lastSelectedFilterValues[activeFilterIndex].allRate.currentPage--;

            if (lastSelectedFilterValues[activeFilterIndex].allRate.currentPage <= 0) {
                lastSelectedFilterValues[activeFilterIndex].allRate.currentPage = 1;
            }
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

        // looping through cached response to find the page
        // checking for the rate Id existance
        cachedRateAndRestrictionResponseData.map(cachedRateAndRestriction => {
            // date wise rate restrictions & amount
            cachedRateAndRestriction.response.dailyRateAndRestrictions.map(dailyRateAndRestriction => {
                let rateFoundIndex = _.findIndex(dailyRateAndRestriction.rates, { id: rateID });

                let date = tzIndependentDate(dailyRateAndRestriction.date);
                let isDateBetweenMinAndMax = (fromDate <= date && date <= toDate);

                if (rateFoundIndex !== -1 && isDateBetweenMinAndMax) {
                    dailyRateAndRestriction.rates[rateFoundIndex] = dateBasedRateDetailsReponse[dailyRateAndRestriction.date].rates[0];
                }
            });

            // common restricitons
            cachedRateAndRestriction.response.commonRestrictions.map(commonRestriction => {
                let date = tzIndependentDate(commonRestriction.date);
                let isDateBetweenMinAndMax = (fromDate <= date && date <= toDate);

                if (isDateBetweenMinAndMax) {
                   commonRestriction.restrictions = dateBasedCommonRestrictions[commonRestriction.date].restrictions
                }
            });

        });

        // everything set, update the view
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    };

    var onFetchGetSingleRateTypeRowDetailsAndUpdateCachedDataModel = (response, successCallBackParameters) => {
        var dailyRateAndRestrictions = response.dailyRateAndRestrictions,
            commonRestrictions = response.commonRestrictions,
            fromDate = tzIndependentDate(successCallBackParameters.fromDate),
            toDate = tzIndependentDate(successCallBackParameters.toDate);
            // rateTypeID = successCallBackParameters.rateTypeID;

        var dateBasedRateDetailsReponse = _.indexBy(dailyRateAndRestrictions, 'date'),
            dateBasedCommonRestrictions = _.indexBy(commonRestrictions, 'date');

        // looping through cached response to find the page
        // checking for the rate Id existance
        cachedRateAndRestrictionResponseData.map(cachedRateAndRestriction => {
            // date wise rate restrictions & amount
            cachedRateAndRestriction.response.dailyRateAndRestrictions.map(dailyRateAndRestriction => {
                let rateFoundIndex = _.findIndex(dailyRateAndRestriction.rates, { id: rateID });

                let date = tzIndependentDate(dailyRateAndRestriction.date);
                let isDateBetweenMinAndMax = (fromDate <= date && date <= toDate);

                if (rateFoundIndex !== -1 && isDateBetweenMinAndMax) {
                    dailyRateAndRestriction.rates[rateFoundIndex] = dateBasedRateDetailsReponse[dailyRateAndRestriction.date].rates[0];
                }
            });

            // common restricitons
            cachedRateAndRestriction.response.commonRestrictions.map(commonRestriction => {
                let date = tzIndependentDate(commonRestriction.date);
                let isDateBetweenMinAndMax = (fromDate <= date && date <= toDate);

                if (isDateBetweenMinAndMax) {
                   commonRestriction.restrictions = dateBasedCommonRestrictions[commonRestriction.date].restrictions
                }
            });

        });

        // everything set, update the view
        $timeout(() => $scope.$emit(rvRateManagerEventConstants.UPDATE_RESULTS, lastSelectedFilterValues[activeFilterIndex]), 0);
    };

    var getSingleRateRowDetailsAndUpdateCachedDataModel = (rateID) => {
        var fromDates = _.pluck(cachedRateAndRestrictionResponseData, 'fromDate').map(fromDate => tzIndependentDate(fromDate)),
            toDates = _.pluck(cachedRateAndRestrictionResponseData, 'toDate').map(toDate => tzIndependentDate(toDate)),
            fromDate = formatDateForAPI(_.min(fromDates)), // date in cache data store is in api format
            toDate = formatDateForAPI(_.max(toDates));  // date in cache data store is in api format

        var params = {
            from_date: fromDate,
            to_date: toDate,
            fetchRates: !cachedRateList.length,
            fetchCommonRestrictions: true,
            'rate_ids[]': [rateID]
        };

        // if they selected rate type from left filter
        var rateTypeIDs = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRateTypes, "id");

        if (rateTypeIDs.length) {
            params['rate_type_ids[]'] = rateTypeIDs;
        }

        var options = {
            params: params,
            onSuccess: onFetchGetSingleRateRowDetailsAndUpdateCachedDataModel,
            successCallBackParameters: {
                rateID,
                fromDate,
                toDate
            }
        };

        $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
    };

    var getSingleRateTypeRowDetailsAndUpdateCachedDataModel = (rateTypeID) => {
        var fromDates = _.pluck(lastSelectedFilterValues, 'fromDate').map(fromDate => tzIndependentDate(fromDate)),
            toDates = _.pluck(lastSelectedFilterValues, 'toDate').map(toDate => tzIndependentDate(toDate)),
            fromDate = formatDateForAPI(_.min(fromDates)), // date in cache data store is in api format
            toDate = formatDateForAPI(_.max(toDates));  // date in cache data store is in api format

        var params = {
            from_date: fromDate,
            to_date: toDate,
            fetchRateTypes: !cachedRateTypeList.length,
            fetchCommonRestrictions: true,
            'rate_type_ids[]': [rateTypeID]
        };

        var options = {
            params: params,
            onSuccess: onFetchGetSingleRateTypeRowDetailsAndUpdateCachedDataModel,
            successCallBackParameters: {
                rateTypeID,
                fromDate,
                toDate
            }
        };

        $scope.callAPI(rvRateManagerCoreSrv.fetchRateTypes, options);
    };

    /*
     * to fetch the rate type & it's restrictions
     * @param  {Object} filterValues
     */
    var fetchRateTypeAndRestrictions = (filterValues) => {
        var params = {
            from_date: formatDateForAPI(filterValues.fromDate),
            to_date: formatDateForAPI(filterValues.toDate),
            order_id: filterValues.orderBySelectedValue,
            fetchRateTypes: !cachedRateTypeList.length,
            fetchCommonRestrictions: true
        };

        params['page'] = filterValues.allRateTypes.currentPage;
        params['per_page'] = paginationRatePerPage;

        // if they selected rate type from left filter
        var rateTypeIDs = _.pluck(filterValues.selectedRateTypes, 'id');

        if (rateTypeIDs.length) {
            params['rate_type_ids[]'] = rateTypeIDs;
        }

        var options = {
            params: params,
            onSuccess: onFetchRateTypeAndRestrictionsSuccess
        };

        $scope.callAPI(rvRateManagerCoreSrv.fetchRateTypes, options);
    };

    /*
     * when the rate type success
     * @param  {Object}
     */
    var onFetchRateTypeAndRestrictionsSuccess = (response) => {
        var numberOfRateTypes = response.rateTypeAndRestrictions[0].rate_types.length;

        totalRateTypesCountForPagination = response.totalCount;
        if (numberOfRateTypes === 0) {
            hideAndClearDataForTopBar();
            showNoResultsPage();
        }
        else {
            processRateTypesAndRestrictionForAllRateType(response);
        }
    };

    /*
     * method to process the response for 'All rate types'
     * @param  {Object} response
     */
    var processRateTypesAndRestrictionForAllRateType = (response) => {
        var rateTypeRestrictions = response.rateTypeAndRestrictions,
                commonRestrictions = response.commonRestrictions;

        // rateTypeList is now cached, we will not fetch that again
        cachedRateTypeList = !cachedRateTypeList.length ? response.rateTypes : cachedRateTypeList;

        // for topbar
        var dates = _.pluck(rateTypeRestrictions, 'date');

        showAndFormDataForTopBar(dates);

        var renderableData = formRenderingDataModelForAllRateTypes(dates, rateTypeRestrictions, commonRestrictions, cachedRateTypeList);

        var rateTypeWithRestrictions = renderableData.rateTypeWithRestrictions;

        // // updating the view with results
        updateAllRateTypesView(rateTypeWithRestrictions, dates, renderableData.restrictionSummary);

        // we need to keep track what we're showing the react part for determining the scrolling position & other things later. so,
        addToShowingDataArray(dates, rateTypeWithRestrictions, RM_RX_CONST.RATE_TYPE_VIEW_CHANGED);

        // // closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
    };

    /*
     * to form the rendering data model (for react) against all rates
     * @param  {array} dates
     * @param  {array} rateTypeRestrictions
     * @return {array}
     */
    var formRenderingDataModelForAllRateTypes = (dates, rateTypeRestrictions, commonRestrictions, rateTypes) => {
        var dateRateTypeSet = null,
            rateTypeRestrictionWithDateAsKey = _.object(dates, rateTypeRestrictions),
            rateTypeIDs = _.pluck(rateTypes, 'id'),
            rateTypeObjectBasedOnID = _.object(rateTypeIDs, rateTypes);

        // rate & restrictions -> 2nd row onwards
        var rateTypeWithRestrictions = rateTypeRestrictions[0].rate_types.map((rateType) => {
            rateType.restrictionList = [];
            rateType.amountList = [];

            rateType = {...rateType, ...rateTypeObjectBasedOnID[rateType.id]};

            dates.map((date) => {
                dateRateTypeSet = _.findWhere(rateTypeRestrictionWithDateAsKey[date].rate_types, {id: rateType.id});
                rateType.restrictionList.push(dateRateTypeSet.restrictions);
                rateType.amountList.push(dateRateTypeSet.amount);
            });

            return _.omit(rateType, 'restrictions');
        });

        /**
         * Summary information holds the first row - this is rendered in the header of the grid
         * @type {Array}
         */
        var restrictionSummary = [{
            restrictionList: dates.map((date) => {
                return _.findWhere(commonRestrictions, { date: date }).restrictions;
            })
        }];

        return {
            rateTypeWithRestrictions : rateTypeWithRestrictions,
            restrictionSummary: restrictionSummary
        };
    };

    /*
     * to update all rate types view with latest data
     * updating the store by dispatching the action
     * @param  {array} rateTypeWithRestrictions
     * @param  {array} dates
     */
    var updateAllRateTypesView = (rateTypeWithRestrictions, dates, restrictionSummary) => {
        var reduxActionForAllRateTypesView = {
            type                : RM_RX_CONST.RATE_TYPE_VIEW_CHANGED,
            restrictionSummaryData : [...restrictionSummary],
            rateTypeRestrictionData : [...rateTypeWithRestrictions],
            businessDate        : tzIndependentDate($rootScope.businessDate),
            callbacksFromAngular: getTheCallbacksFromAngularToReact(),
            paginationStateData: {
                totalRows: totalRateTypesCountForPagination,
                perPage: paginationRatePerPage,
                page: lastSelectedFilterValues[activeFilterIndex].allRateTypes.currentPage
            },
            dates,
            restrictionTypes,
        };

        // dispatching to redux
        store.dispatch(reduxActionForAllRateTypesView);
        document.getElementById("rate-manager").scrollTop = 0;
    };

    /*
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

    /*
     * on taping the back button from the top bar (NOT from the HEADER)
     */
    $scope.clickedOnBackButton = () => {
        var allRatesShowingData;

        lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;
        $scope.showContractDetailsChecked = false;
        if (chosenTab === 'RATES') {
            $scope.isRateView = true;
            $scope.isRateTypeView = false;
            $scope.isRoomTypeView = false;

            // right nw the navigation is only from All Rates' single rate to it's details
            var rateID = lastSelectedFilterValues[activeFilterIndex].selectedRates[0].id;

            lastSelectedFilterValues.splice(activeFilterIndex, 1);
            activeFilterIndex = activeFilterIndex - 1;

            showingData.splice(showingData.length - 1, 1);

            getSingleRateRowDetailsAndUpdateCachedDataModel(rateID);

            $scope.showBackButton = false;

            // scroll focus
            allRatesShowingData = _.where(showingData, { actionType: RM_RX_CONST.RATE_VIEW_CHANGED});
            // we will attach scrollTo if attached filter from somewhere
            if(_.has(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo')) {
               reduxActionForAllRateView.scrollTo = lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo;

               // dropping scrollTo from
               lastSelectedFilterValues[activeFilterIndex].allRate =
                   _.omit(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo');
            }
        }
        else if (chosenTab === 'RATE_TYPES' && $scope.isRateView) {
            $scope.isRateView = false;
            $scope.isRateTypeView = true;
            $scope.isRoomTypeView = false;

            cachedRateList = [];
            cachedRateAndRestrictionResponseData = [];

            lastSelectedFilterValues.splice(activeFilterIndex, 1);
            activeFilterIndex = activeFilterIndex - 1;

            showingData.splice(showingData.length - 1, 1);

            fetchRateTypeAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);

            $scope.showContractDetailsChecked = false;

            $scope.showBackButton = false;

            // scroll focus
            var allRateTypesShowingData = _.where(showingData, { actionType: RM_RX_CONST.RATE_TYPE_VIEW_CHANGED});
            // we will attach scrollTo if attached filter from somewhere

            if(_.has(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo')) {
               reduxActionForAllRateTypeView.scrollTo = lastSelectedFilterValues[activeFilterIndex].allRateTypes.scrollTo;

               // dropping scrollTo from
               lastSelectedFilterValues[activeFilterIndex].allRateTypes =
                   _.omit(lastSelectedFilterValues[activeFilterIndex].allRateTypes, 'scrollTo');
            }
        }
        else if (chosenTab === 'RATE_TYPES' && $scope.isRoomTypeView) {
            $scope.isRateView = true;
            $scope.isRateTypeView = false;
            $scope.isRoomTypeView = false;
            $scope.backButtonText = 'RATE TYPES';

            lastSelectedFilterValues.splice(activeFilterIndex, 1);
            activeFilterIndex = activeFilterIndex - 1;

            showingData.splice(showingData.length - 1, 1);

            fetchDailyRates(lastSelectedFilterValues[activeFilterIndex]);

            $scope.showBackButton = true;

            // scroll focus
            allRatesShowingData = _.where(showingData, { actionType: RM_RX_CONST.RATE_VIEW_CHANGED});
            // we will attach scrollTo if attached filter from somewhere
            if(_.has(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo')) {
               reduxActionForAllRateView.scrollTo = lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo;

               // dropping scrollTo from
               lastSelectedFilterValues[activeFilterIndex].allRate =
                   _.omit(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo');
            }
        }
    };

    /*
     * on clicking the checkbox for show-contract-details in topbar.
     */
    $scope.clickedOnShowContractDetails = function(e) {
        $scope.showContractDetailsChecked = !$scope.showContractDetailsChecked;
        var dispatchData = {
            type: RM_RX_CONST.RATE_VIEW_WITH_ADDRESS,
            flags: {
                showRateDetail: $scope.showContractDetailsChecked
            }
        };

        e.preventDefault();
        store.dispatch(dispatchData);
    };

    /*
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
                singleRateTypeViewCallback: fetchSingleRateTypeDetailsFromReact,
                openAllCallbackForSingleRateView: openAllRestrictionsForSingleRateView,
                closeAllCallbackForSingleRateView: closeAllRestrictionsForSingleRateView,
                closeAllRestrictionsForRateView,
                openAllRestrictionsForRateView,
                closeAllRestrictionsForRoomTypeView,
                openAllRestrictionsForRoomTypeView,
                clickedOnRateViewCell,
                clickedOnRoomTypeViewCell,
                clickedOnRoomTypeAndAmountCell,
                clickedOnRateTypeViewCell,
                goToPrevPage,
                goToNextPage
            };
        };

        /*
         * to identify and set column position to focus when rerendered with new data
         * @param  {integer} scrollWidth
         * @param  {integer} xScrollPosition
         */
        var setScrollColForAllRates = (scrollWidth, xScrollPosition) => {

            // identifying the column to focus soon after rerenderng with new data
            var abs = Math.abs,
                numberOfDates = _.last(showingData).headerData.length,
                eachColWidth = abs(scrollWidth) / numberOfDates,
                col = Math.ceil( abs(xScrollPosition) / eachColWidth );

            col = col !== 0 ? col : 1; // css selector index starting from one

            lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = {
                col: col,
                offsetX: (abs(xScrollPosition) % eachColWidth)
            };
        };

     /*
     * handle method to porcess the response for 'All Rates mode'
     * @param  {Object} response
     */
    var processForAllRates = (response) => {
        var rateRestrictions = [...response.dailyRateAndRestrictions],
            commonRestrictions = response.commonRestrictions;

        // rateList now cached, we will not fetch that again
        cachedRateList = !cachedRateList.length ? response.rates : cachedRateList;

        // for topbar
        var dates = _.pluck(rateRestrictions, 'date');

        showAndFormDataForTopBar(dates);

        var renderableData = formRenderingDataModelForAllRates(dates, rateRestrictions, commonRestrictions, cachedRateList);

        var ratesWithRestrictions = renderableData.ratesWithRestrictions;

        updateAllRatesView(ratesWithRestrictions, dates, renderableData.restrictionSummary);

        // we need to keep track what we're showing the react part for determining the scrolling position & other things later. so,
        addToShowingDataArray(dates, ratesWithRestrictions, RM_RX_CONST.RATE_VIEW_CHANGED);

        // closing the left side filter section
        $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
    };

        /*
         * to update all rates views
         * @param  {array} ratesWithRestrictions
         * @param  {array} dates
         */
        const updateAllRatesView = (ratesWithRestrictions, dates, restrictionSummary) => {
            var reduxActionForAllRateView = {
                type                : RM_RX_CONST.RATE_VIEW_CHANGED,
                rateRestrictionData : [...ratesWithRestrictions],
                restrictionSummaryData: [...restrictionSummary],
                businessDate        : tzIndependentDate($rootScope.businessDate),
                callbacksFromAngular: getTheCallbacksFromAngularToReact(),
                paginationStateData : {
                                            totalRows : totalRatesCountForPagination,
                                            perPage: paginationRatePerPage,
                                            page: lastSelectedFilterValues[activeFilterIndex].allRate.currentPage
                                       },
                dates,
                restrictionTypes
            };

            // we will attach scrollTo if attached filter from somewhere
            if (_.has(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo')) {
                reduxActionForAllRateView.scrollTo = lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo;

                // dropping scrollTo from
                lastSelectedFilterValues[activeFilterIndex].allRate =
                    _.omit(lastSelectedFilterValues[activeFilterIndex].allRate, 'scrollTo');
            }

            // dispatching to redux
            store.dispatch(reduxActionForAllRateView);
        };

        /*
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

            // rate & restrictions -> 2nd row onwards
            var ratesWithRestrictions = rateRestrictions[0].rates.map((rate) => {
                rate = {...rate, ...rateObjectBasedOnID[rate.id]};
                rate.restrictionList = [];
                rate.amountList = [];

                dates.map((date) => {
                    dateRateSet = _.findWhere(rateRestrictionWithDateAsKey[date].rates, { id: rate.id });
                    rate.restrictionList.push(dateRateSet.restrictions);
                    rate.amountList.push(dateRateSet.amount);
                }
                );
                return _.omit(rate, 'restrictions');
            });

            /*
             * Summary information holds the first row - this is rendered in the header of the grid
             * @type {Array}
             */
            var restrictionSummary = [{
                restrictionList: dates.map((date) => {
                    return _.findWhere(commonRestrictions, { date: date }).restrictions;
                })
            }];

            return {
                ratesWithRestrictions : ratesWithRestrictions,
                restrictionSummary: restrictionSummary
            };
        };
        /*
         * close rates from diff mode.
         */

        $scope.closeAll = function(){
            var stateProps  = store.getState();
            var closedRestriction = _.findWhere(stateProps.restrictionTypes, { value: RM_RX_CONST.CLOSED_RESTRICTION_VALUE });
            let paramsForClosingRestriction = {
                details: [{
                    from_date: stateProps.dates[0],
                    to_date: stateProps.dates[stateProps.dates.length - 1],
                    restrictions: [{
                        action: 'add',
                        restriction_type_id: closedRestriction.id
                    }]
                }]
            };

            if (stateProps.mode ===  RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
                openAllRestrictionsForSingleRateView(paramsForClosingRestriction);
            }
            else if (stateProps.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
                closeAllRestrictionsForRoomTypeView(paramsForClosingRestriction);
            }
            else if (stateProps.mode ===  RM_RX_CONST.RATE_VIEW_MODE) {
                paramsForClosingRestriction.rate_ids = _.pluck(stateProps.list.slice(0), 'id');
                closeAllRestrictionsForRateView(paramsForClosingRestriction);
            }
        };
        /*
         * open rates from diff mode.
         */
        $scope.openAll = function() {
            var stateProps  = store.getState();
            var closedRestriction = _.findWhere(stateProps.restrictionTypes, { value: RM_RX_CONST.CLOSED_RESTRICTION_VALUE });
            let paramsForOpeningRestriction = {
                details: [{
                    from_date: stateProps.dates[0],
                    to_date: stateProps.dates[stateProps.dates.length - 1],
                    restrictions: [{
                        action: 'remove',
                        restriction_type_id: closedRestriction.id
                    }]
                }]
            };

            if (stateProps.mode ===  RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_MODE) {
                // rate_id: will be adding from the controller (openAllRestrictionsForSingleRateView)
                openAllRestrictionsForSingleRateView(paramsForOpeningRestriction);
            }
            else if (stateProps.mode ===  RM_RX_CONST.ROOM_TYPE_VIEW_MODE) {
                openAllRestrictionsForRoomTypeView(paramsForOpeningRestriction);
            }
            else if (stateProps.mode ===  RM_RX_CONST.RATE_VIEW_MODE) {
                paramsForOpeningRestriction.rate_ids = _.pluck(stateProps.list.slice(0), 'id');
                openAllRestrictionsForRateView(paramsForOpeningRestriction);
            }
        };

        /*
         * to show & form the data required for topbar
         * @param  {array} dates [description]
         */
        const showAndFormDataForTopBar = (dates) => {
            var cards = [],
                index = 0;

            $scope.fromDate = dates[0];
            $scope.toDate = dates[dates.length - 1];
            $scope.showTopBar = true;
            $scope.selectedCardNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedCards, 'account_name');
            $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');
            $scope.selectedRateTypeNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRateTypes, 'name');
            $scope.selectedAccountName = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'accountName');
            $scope.selectedAddress = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'address');

            if ($scope.selectedAccountName[0] === undefined) {
                cards = lastSelectedFilterValues[activeFilterIndex].selectedCards;
                $scope.selectedCardNames = [];
                for (index = 0; index < cards.length; index++ ) {
                    if (cards[index].current_contracts.length !== 0) {
                       $scope.selectedCardNames.push(cards[index].account_name);
                    }
                }
            }

            runDigestCycle();

        };

        /*
         * when the daily rates success
         * @param  {Object}
         * @param  {Object}
         */
        var onFetchDailyRatesSuccess = (response) => {
            /*
                TWO CASES
                1. if the response has more than one rate, will redirect to all rates view
                2. if the response has only one rate, will redirect to single rate's expandable view
                if the request got initiated from 'Left side filter'
            */
            var numberOfRates = response.dailyRateAndRestrictions[0].rates.length;

            if (numberOfRates === 1 &&
                _.has(lastSelectedFilterValues[activeFilterIndex], 'fromLeftFilter') && lastSelectedFilterValues[activeFilterIndex].fromLeftFilter) {

                let rates = !cachedRateList.length ? response.rates : cachedRateList;

                // rateList now cached, we will not fetch that again
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

                // if we haven't fetched common restriction, we've to use the cached response's common restriction
                if (!_.has(response, 'commonRestrictions')) {
                    let cachedData = _.findWhere(cachedRateAndRestrictionResponseData, dateParams);

                    if (cachedData && _.has(cachedData, 'response')) {
                        response.commonRestrictions = cachedData.response.commonRestrictions;
                    }
                    else {
                        console.error('response key or caching is missing from cachedRateAndRestrictionResponseData');
                    }
                }
                // if common restrictions in new response,
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

                // using this variable we will be limiting the api call
                totalRatesCountForPagination = response.totalCount;

                return processForAllRates(response);
            }

        };

        /*
         * to fill the bottom with new response
         * @param  {Array} newResponse
         * @return {Array}             [description]
         */
        var fillAllRatesBottomWithNewResponseAndAdjustScrollerPosition = (newResponse) => {
            var filterValues  = lastSelectedFilterValues[activeFilterIndex],
                pageBefore = (filterValues.allRate.currentPage - 1),
                pageBefore = pageBefore === 0 ? 1 : pageBefore,
                dataSetJustBeforeCurrentOne = _.findWhere(cachedRateAndRestrictionResponseData,
                    {
                        fromDate    : formatDateForAPI(filterValues.fromDate),
                        toDate      : formatDateForAPI(filterValues.toDate),
                        page        : filterValues.allRate.currentPage > 1 ? filterValues.allRate.currentPage - 1 : 1
                    });

            // we will modify this with new response's rates
            var dataSetToReturn = {
                ...dataSetJustBeforeCurrentOne.response
            };

            var numberOfRatesToShowFromPrevious = rvRateManagerPaginationConstants.allRate.additionalRowsToPickFromPrevious,
                newResponseRateLength = newResponse.dailyRateAndRestrictions[0].rates.length,
                oldResponseRatelength = dataSetToReturn.dailyRateAndRestrictions[0].rates.length,
                ratesIndexForSlicing = oldResponseRatelength - numberOfRatesToShowFromPrevious;

            // if we have less data coming from the api side, usually end of the page.
            if (newResponseRateLength < paginationRatePerPage) {
                ratesIndexForSlicing = newResponseRateLength;
                if (_.isUndefined(lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo)) {
                    lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = {};
                }
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
                    ];
                    return dailyRateAndRestriction;
                });

            return dataSetToReturn;
        };

        /*
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

            // we will modify this with new response's
            var dataSetToReturn = {
                ...dataSetJustAfterCurrentOne.response
            };

            var indexForPickingUp = paginationRateMaxRowsDisplay - paginationRatePerPage;

            // setting the row to focus soon after rendering
            // column should be assigned from 'allRatesScrollReachedTop'
            var numberOfRatesInNewResponse = newResponse.dailyRateAndRestrictions[0].rates.length;

            if (_.isUndefined(lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo)) {
                    lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo = {};
            }
            lastSelectedFilterValues[activeFilterIndex].allRate.scrollTo.row = numberOfRatesInNewResponse - indexForPickingUp * 2;

            dataSetToReturn.dailyRateAndRestrictions = dataSetToReturn.dailyRateAndRestrictions
                .map((dailyRateAndRestriction) => {
                    dailyRateAndRestriction = {...dailyRateAndRestriction}; // for fixing the issue of
                    dailyRateAndRestriction.rates = [
                        ..._.findWhere(newResponse.dailyRateAndRestrictions, { date: dailyRateAndRestriction.date }).rates,
                        ...dailyRateAndRestriction.rates.slice( 0, indexForPickingUp )
                    ];
                    return dailyRateAndRestriction;
                });

            return dataSetToReturn;
        };

        /*
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

            // rate & restrictions -> 2nd row onwards
            var roomTypeWithRestrictions = roomTypeRestrictions[0].room_types.map((roomType) => {
                roomType.restrictionList = [];
                roomType.amountList = [];

                roomType = {...roomType, ...roomTypeObjectBasedOnID[roomType.id]};

                dates.map((date) => {
                    dateRoomTypeSet = _.findWhere(roomTypeRestrictionWithDateAsKey[date].room_types, {id: roomType.id});
                    roomType.restrictionList.push(dateRoomTypeSet.restrictions);
                    roomType.amountList.push(dateRoomTypeSet.amount);
                });

                return _.omit(roomType, 'restrictions');
            });

            /**
             * Summary information holds the first row - this is rendered in the header of the grid
             * @type {Array}
             */
            var restrictionSummary = [{
                restrictionList: dates.map((date) => {
                    return _.findWhere(commonRestrictions, { date: date }).restrictions;
                })
            }];

            return {
                roomTypeWithRestrictions : roomTypeWithRestrictions,
                restrictionSummary: restrictionSummary
            };
        };

        /*
         * to update all room types view with latest data
         * updating the store by dispatching the action
         * @param  {array} roomTypeWithRestrictions
         * @param  {array} dates
         */
        var updateAllRoomTypesView = (roomTypeWithRestrictions, dates, restrictionSummary) => {
            var reduxActionForAllRoomTypesView = {
                type                : RM_RX_CONST.ROOM_TYPE_VIEW_CHANGED,
                restrictionSummaryData : [...restrictionSummary],
                roomTypeRestrictionData : [...roomTypeWithRestrictions],
                businessDate        : tzIndependentDate($rootScope.businessDate),
                callbacksFromAngular: getTheCallbacksFromAngularToReact(),
                dates,
                restrictionTypes,
            };

            // dispatching to redux
            store.dispatch(reduxActionForAllRoomTypesView);
        };

        /*
         * method to process the response for 'All Room types'
         * @param  {Object} response
         */
        var processRoomTypesAndRestrictionForAllRoomType = (response) => {
            var roomTypeRestrictions = response.roomTypeAndRestrictions,
                commonRestrictions = response.commonRestrictions;

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList;

            // for topbar
            var dates = _.pluck(roomTypeRestrictions, 'date');

            showAndFormDataForTopBar(dates);

            var renderableData = formRenderingDataModelForAllRoomTypes(dates, roomTypeRestrictions, commonRestrictions, cachedRoomTypeList);

            var roomTypeWithRestrictions = renderableData.roomTypeWithRestrictions;

            // updating the view with results
            updateAllRoomTypesView(roomTypeWithRestrictions, dates, renderableData.restrictionSummary);

            // closing the left side filter section
            $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
        };

        /*
         * when the daily rates success
         * @param  {Object}
         */
        var onFetchRoomTypeAndRestrictionsSuccess = (response) => {
            var numberOfRoomTypes = response.roomTypeAndRestrictions[0].room_types;

            if (numberOfRoomTypes === 0) {
                hideAndClearDataForTopBar();
                showNoResultsPage();
            }
            else {
                processRoomTypesAndRestrictionForAllRoomType(response);
            }
        };

        /*
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
            // if data already in cache

            if (dataFoundInCachedResponse) {
                return processForAllRates(dataFoundInCachedResponse.response)
            }

            let fetchCommonRestrictions = true;

            var cachedRateAndRestrictionOfFromDateAndToDate = _.where(cachedRateAndRestrictionResponseData,
                {
                    fromDate: formatDateForAPI(filterValues.fromDate),
                    toDate: formatDateForAPI(filterValues.toDate)
                });

            cachedRateAndRestrictionOfFromDateAndToDate.map(cachedRateAndRestriction => {
                if (cachedRateAndRestriction.response.commonRestrictions.length) {
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
                if (fetchCommonRestrictions) {
                    params['considerRateIDsInCommonRestriction'] = true;
                }
            }

            params['page'] = filterValues.allRate.currentPage;
            params['per_page'] = paginationRatePerPage;

            var options = {
                params: params,
                onSuccess: onFetchDailyRatesSuccess
            };

            $scope.callAPI(rvRateManagerCoreSrv.fetchRatesAndDailyRates, options);
        };

        /*
         * on api call success against rate cell click
         * @param  {Object} response
         * @param  {Object} successCallBackParameters
         */
        var onFetchMultipleRateRestrictionDetailsForRateCell = (response, successCallBackParameters) => {
            var restrictionData = response.dailyRateAndRestrictions,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                rates = !cachedRateList.length ? response.rates : cachedRateList,
                rateTypes = [];

            // caching the rate list
            cachedRateList = [...rates];

            var rateIDs = successCallBackParameters.rateIDs;

            rates = rates.filter(rate => (rateIDs.indexOf(rate.id) > -1 ? rate : false));

            // if there is no rate selected we need to check the rate type list
            if (!rates.length && lastSelectedFilterValues[activeFilterIndex].selectedRateTypes.length) {
                rateTypes = lastSelectedFilterValues[activeFilterIndex].selectedRateTypes;
            }
            var data = {
                rates,
                rateTypes,
                mode: rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_RESTRICTION_MODE,
                restrictionData,
                restrictionTypes,
                date: successCallBackParameters.date,
                variedAndCommonRestrictions,
                'isMultiple': true
            };

            showRateRestrictionPopup(data);
        };

        /*
         * fetch the rate restriction details for a day
         * @param  {Array} rateIDs
         * @param  {Array} rateIDs
         * @param  {String]} date
         * @return {undefined}
         */
        var fetchMultipleRateRestrictionsDetailsForPopup = (rateTypeIDs, rateIDs, date) => {
            // calling the API to get the details
            var params = {
                'rate_ids[]': rateIDs,
                'rate_type_ids[]': rateTypeIDs,
                from_date: date,
                to_date: date,
                considerRateIDsInAllRestrictionStatusFetch: rateIDs.length > 0
            };
            var options = {
                params,
                onSuccess: onFetchMultipleRateRestrictionDetailsForRateCell,
                successCallBackParameters: {
                    rateIDs,
                    date,
                    rateTypeIDs
                }
            };

            $scope.callAPI(rvRateManagerCoreSrv.fetchRateRestrictionDetailsAndCommonRestrictions, options);
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
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                    .room_types.map(roomType =>
                        ({
                            ...roomType,
                            ..._.findWhere(roomTypes, {id: roomType.id})
                        }));

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = roomTypes;

            var data = {
                mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_RESTRICTION_MODE,
                rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
                date: successCallBackParameters.date,
                roomTypesAndPrices,
                restrictionData,
                restrictionTypes,
                variedAndCommonRestrictions,
                'isMultiple': false
            };

            showRateRestrictionPopup(data);
        };

        /**
         * [description]
         * @param  {[type]} response                  [description]
         * @param  {[type]} successCallBackParameters [description]
         * @return {[type]}                           [description]
         */
        var onFetchSingleRateTypeRestrictionModeDetailsForPopup = (response, successCallBackParameters) => {
            var restrictionData = response.roomTypeAndRestrictions,
                // roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                rates = !cachedRateList.length ? response.rates : cachedRateList,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                rateAndRestrictions = response.rateAndRestrictions[0]
                    .rates.map(rate =>
                        ({
                            ...rate,
                            ..._.findWhere(rates, {id: rate.id})
                        }));

            // roomTypeList is now cached, we will not fetch that again
            // cachedRoomTypeList = roomTypes;

            var data = {
                mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_TYPE_RESTRICTION_MODE,
                rateType: _.findWhere(cachedRateTypeList, { id: successCallBackParameters.rateTypeID }),
                date: successCallBackParameters.date,
                rateAndRestrictions,
                restrictionData,
                restrictionTypes,
                variedAndCommonRestrictions,
                'isMultiple': false
            };

            showRateRestrictionPopup(data);
        };

        /**
         * [description]
         * @param  {[type]} response                  [description]
         * @param  {[type]} successCallBackParameters [description]
         * @return {[type]}                           [description]
         */
        var onFetchMultipleRateTypeRestrictionModeDetailsForPopup = (response, successCallBackParameters) => {
            var restrictionData = response.roomTypeAndRestrictions,
                // roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                rates = !cachedRateList.length ? response.rates : cachedRateList,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                rateAndRestrictions = response.rateAndRestrictions[0]
                    .rates.map(rate =>
                        ({
                            ...rate,
                            ..._.findWhere(rates, {id: rate.id})
                        }));

            // roomTypeList is now cached, we will not fetch that again
            // cachedRoomTypeList = roomTypes;

            var data = {
                mode: rvRateManagerPopUpConstants.RM_MULTIPLE_RATE_TYPE_RESTRICTION_MODE,
                rateType: lastSelectedFilterValues[activeFilterIndex].selectedRateTypes,
                date: successCallBackParameters.date,
                rateAndRestrictions,
                restrictionData,
                restrictionTypes,
                variedAndCommonRestrictions,
                'isMultiple': true
            };

            showRateRestrictionPopup(data);
        };

        /*
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

            $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateDetailsAndCommonRestrictions, options);
        };

        /*
        * [description]
        * @param  {[type]} options.rateID [description]
        * @param  {[type]} options.date   [description]
        * @return {[type]}                [description]
        */
        var fetchSingleRateTypeRestrictionModeDetailsForPopup = (rateTypeID, date) => {
            var params = {
                from_date: date,
                to_date: date,
                rate_type_id: rateTypeID,
                fetchRoomTypes: !cachedRoomTypeList.length,
                fetchRates: !cachedRateList.length
            };

            var options = {
                params,
                onSuccess: onFetchSingleRateTypeRestrictionModeDetailsForPopup,
                successCallBackParameters: {
                    rateTypeID,
                    date
                }
            };

             $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateTypeDetailsAndCommonRestrictions, options);
        };

        var fetchMultipleRateTypeRestrictionModeDetailsForPopup = (rateTypeID, date) => {
            var params = {
                from_date: date,
                to_date: date,
                fetchRoomTypes: !cachedRoomTypeList.length,
                fetchRates: !cachedRateList.length
            };

            var options = {
                params,
                onSuccess: onFetchMultipleRateTypeRestrictionModeDetailsForPopup,
                successCallBackParameters: {
                    date
                }
            };

            $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateTypeDetailsAndCommonRestrictions, options);

        };

        var clickedOnRateTypeViewCell = ({rateTypeIDs, date} ) => {

            if (rateTypeIDs.length === 0) {
                fetchMultipleRateTypeRestrictionModeDetailsForPopup([], date);
            } else {
                fetchSingleRateTypeRestrictionModeDetailsForPopup(rateTypeIDs[0], date);
            }

        };

        /*
         * callback from react when clicked on a cell in rate view
         */
        var clickedOnRateViewCell = ({ rateIDs, date }) => {
            var rateTypeIDs = [];

            // This method is invoked with rateIDs as an empty array IFF the ALL RATES / ALL ROOM TYPES row's cell is clicked
            if (rateIDs.length === 0) {
                // in pagination context we've to fetch all the visible/invisible rate's details
                let leftSideFilterSelectedRates = lastSelectedFilterValues[activeFilterIndex].selectedRates;

                // In case no rates are specifically selected in the filter proceed with empty arrays else, populate array with all selected rate IDs
                if (!leftSideFilterSelectedRates.length) {
                    rateIDs = [];
                } else {
                    rateIDs = _.pluck(leftSideFilterSelectedRates, "id");
                }

                // if there is no rate selected
                if (rateIDs.length === 0) {
                    rateTypeIDs = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRateTypes, "id");
                }

                fetchMultipleRateRestrictionsDetailsForPopup(rateTypeIDs, rateIDs, date);
            }
            else {
                fetchSingleRateRestrictionModeDetailsForPopup(rateIDs[0], date);
            }
        };

        /*
         * when api call for fetching the room type restriction details's popup
         * @param  {Object} response
         */
        var onFetchSingleRoomTypeRestrictionDetailsForPopupSuccess = (response, successCallBackParameters) => {
            var restrictionData = response.roomTypeAndRestrictions,
                roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                    .room_types.map(roomType =>
                        ({
                            ...roomType,
                            ..._.findWhere(roomTypes, {id: roomType.id})
                        }));

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = roomTypes;

            var data = {
                roomTypesAndPrices,
                restrictionData,
                restrictionTypes,
                mode: rvRateManagerPopUpConstants.RM_SINGLE_ROOMTYPE_RESTRICTION_MODE,
                roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
                date: successCallBackParameters.date,
                variedAndCommonRestrictions,
                'isMultiple': false
            };

            showRateRestrictionPopup(data);
        };

        /*
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

            $scope.callAPI(rvRateManagerCoreSrv.fetchRoomTypeWithRestrictionStatus, options);
        };

        /*
        * on api call success against header room type cell click
        * @param  {Object} response
        */
        var onFetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess = (response, successCallBackParameters) => {
            var restrictionData = response.roomTypeAndRestrictions,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                roomTypesAndPrices = response.roomTypeAndRestrictions[0]
                    .room_types.map(roomType =>
                        ({
                            ...roomType,
                            ..._.findWhere(roomTypes, {id: roomType.id})
                        }));

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = roomTypes;

            var data = {
                roomTypesAndPrices,
                variedAndCommonRestrictions,
                restrictionData,
                restrictionTypes,
                mode: rvRateManagerPopUpConstants.RM_MULTIPLE_ROOMTYPE_RESTRICTION_MODE,
                date: successCallBackParameters.date,
                'isMultiple': true
            };

            showRateRestrictionPopup(data);
        };

        var goToPrevPage = ()=>{
            lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;
            if ($scope.isRateView) {
                lastSelectedFilterValues[activeFilterIndex].allRate.currentPage--;
                fetchDailyRates(lastSelectedFilterValues[activeFilterIndex]);
            } else if ($scope.isRateTypeView) {
                lastSelectedFilterValues[activeFilterIndex].allRateTypes.currentPage--;
                fetchRateTypeAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
            }
        };

        var goToNextPage = ()=>{
            lastSelectedFilterValues[activeFilterIndex].fromLeftFilter = false;

            if ($scope.isRateView) {
                lastSelectedFilterValues[activeFilterIndex].allRate.currentPage++;
                fetchDailyRates(lastSelectedFilterValues[activeFilterIndex]);
            }
            else if ($scope.isRateTypeView) {
                lastSelectedFilterValues[activeFilterIndex].allRateTypes.currentPage++;
                fetchRateTypeAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
            }
        };

        /*
        * to fetch a day room type common restriction details
        */
        var fetchMultipleRoomTypeRestrictionsDetailsForPopup = (date) => {
            // calling the API to get the details
            var params = {
                from_date: date,
                to_date: date,
                fetchRoomTypes: !cachedRoomTypeList.length,
            };
            var options = {
                params,
                onSuccess: onFetchMultipleRoomTypeRestrictionsDetailsForPopupSuccess,
                successCallBackParameters: {
                    date
                }
            };

            $scope.callAPI(rvRateManagerCoreSrv.fetchRoomTypeWithRestrictionStatus, options);
        };

        /*
         * callback from react when clicked on a cell in roomtype view
         */
        var clickedOnRoomTypeViewCell = ({roomTypeIDs, date}) => {
            return roomTypeIDs.length === 0 ?
                fetchMultipleRoomTypeRestrictionsDetailsForPopup(date) :
                fetchSingleRoomTypeRestrictionDetailsForPopup(roomTypeIDs[0], date);
        };

        /*
         * when api call for fetching the room type restriction details's popup
         * @param  {Object} response
         */
        var onFetchSingleRoomTypeRestrictionAndAmountDetailsForPopupSuccess = (response, successCallBackParameters) => {
            var roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                rates = !cachedRateList.length ? response.rates : cachedRateList,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                roomTypePricesAndRestrictions = response.roomTypeAndRestrictions[0];

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = roomTypes;

            // rateList is now cached
            cachedRateList = rates;

            var data = {
                mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_SINGLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
                roomType: _.findWhere(cachedRoomTypeList, { id: successCallBackParameters.roomTypeID }),
                rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
                rates: cachedRateList,
                date: successCallBackParameters.date,
                restrictionTypes,
                roomTypePricesAndRestrictions,
                variedAndCommonRestrictions,
                'isMultiple': false
            };

            showRateRestrictionPopup(data);
        };

        /*
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

            $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateRestrictionsAndAmountsDetails, options);
        };

        /*
         * when api call for fetching the room type restriction details's popup
         * @param  {Object} response
         */
        var onFetchMultipleRoomTypeRestrictionsAndAmountDetailsForPopup = (response, successCallBackParameters) => {
            var roomTypes = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList,
                rates = !cachedRateList.length ? response.rates : cachedRateList,
                variedAndCommonRestrictions = response.restrictionsWithStatus[0].restrictions,
                roomTypePricesAndRestrictions = response.roomTypeAndRestrictions[0];

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = roomTypes;

            // rateList is now cached
            cachedRateList = rates;

            var data = {
                roomTypePricesAndRestrictions,
                variedAndCommonRestrictions,
                restrictionTypes,
                mode: rvRateManagerPopUpConstants.RM_SINGLE_RATE_MULTIPLE_ROOMTYPE_RESTRICTION_AMOUNT_MODE,
                rate: _.findWhere(cachedRateList, { id: successCallBackParameters.rateID }),
                rates: cachedRateList,
                date: successCallBackParameters.date,
                'isMultiple': false
            };

            showRateRestrictionPopup(data);
        };

        /*
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

            $scope.callAPI(rvRateManagerCoreSrv.fetchSingleRateRestrictionsAndAmountsDetails, options);
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

            // 2nd row onwards
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

                /*
                 * Summary information holds the first row - this is rendered in the header of the grid
                 * @type {Array}
                 */
                var restrictionSummary = [{
                    rateDetails: [],
                    restrictionList: dates.map((date) => {
                        return _.findWhere(commonRestrictions, {date: date}).restrictions;
                    })
                }];

                return {
                    roomTypeWithRestrictions : roomTypeWithRestrictions,
                    restrictionSummary: restrictionSummary
                };
            };

        /*
         * to update single rate type view with latest data
         * updating the store by dispatching the action
         * @param  {array} roomTypeWithAmountAndRestrictions
         * @param  {array} dates
         */
        var updateSingleRatesView = (roomTypeWithAmountAndRestrictions, dates, restrictionSummary) => {
            store.dispatch({
                type: RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED,
                singleRateRestrictionData : [...roomTypeWithAmountAndRestrictions],
                restrictionSummaryData : [...restrictionSummary],
                businessDate: tzIndependentDate($rootScope.businessDate),
                callbacksFromAngular: getTheCallbacksFromAngularToReact(),
                restrictionTypes,
                dates
            });
        };

        /*
         * when single rate details api call success
         * @param  {Object} response
         */
        var onFetchSingleRateDetailsAndRestrictions = (response) => {
            var roomTypeAmountAndRestrictions = response.roomTypeAndRestrictions,
                commonRestrictions = response.commonRestrictions;

            // roomTypeList is now cached, we will not fetch that again
            cachedRoomTypeList = !cachedRoomTypeList.length ? response.roomTypes : cachedRoomTypeList;

            // we will be showing 'No Results' page, if returned result contain zero room types
            var totalRoomTypesToShow = roomTypeAmountAndRestrictions[0].room_types.length;

            if (totalRoomTypesToShow === 0) {
                hideAndClearDataForTopBar();
                showNoResultsPage();
                return;
            }

            // topbar
            var dates = _.pluck(roomTypeAmountAndRestrictions, 'date');

            showAndFormDataForTopBar(dates);

            // grid view data model
            var renderableData = formRenderingDataModelForSingleRateDetailsAndRestrictions
                (dates, roomTypeAmountAndRestrictions, commonRestrictions, cachedRoomTypeList);

            var roomTypeWithAmountAndRestrictions = renderableData.roomTypeWithRestrictions;

            // let's view results ;)
            updateSingleRatesView(roomTypeWithAmountAndRestrictions, dates, renderableData.restrictionSummary);

            // we need to keep track what we're showing the react part for determining the scrolling position & other things later. so,
            addToShowingDataArray(dates, roomTypeWithAmountAndRestrictions,
                RM_RX_CONST.SINGLE_RATE_EXPANDABLE_VIEW_CHANGED);

            // closing the left side filter section
            $scope.$broadcast(rvRateManagerEventConstants.CLOSE_FILTER_SECTION);
        };

        /*
         * callback from react, when clicked on rate type
         * @param  {Object} filterValues
         */
        var fetchSingleRateTypeDetailsFromReact = (filterValues) => {
            lastSelectedFilterValues.push({
                ...lastSelectedFilterValues[activeFilterIndex],
                ...filterValues,
                fromLeftFilter: false
            });

            activeFilterIndex = activeFilterIndex + 1;
            let allRate = {
                ...lastSelectedFilterValues[activeFilterIndex].allRate,
                currentPage: 1
            };

            lastSelectedFilterValues[activeFilterIndex].allRate = allRate;
            delete lastSelectedFilterValues[activeFilterIndex].allRateTypes;

            $scope.selectedRateTypeNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRateTypes, 'name');

            $scope.showBackButton = true;
            $scope.isRateView = true;
            $scope.isRateTypeView = false;
            $scope.isRoomTypeView = false;

            var filterValuesForShowRates = {
                allRate: allRate,
                chosenTab: 'RATE_TYPES',
                fromDate: filterValues.fromDate,
                toDate: filterValues.toDate,
                fromLeftFilter: false,
                selectedRateTypes: [{'id': filterValues.selectedRateTypes[0].id}],
                selectedRates: []
            };

            fetchDailyRates(filterValuesForShowRates);
        };

        /*
         * callback from react, when clicked on rate
         * @param  {Object} filterValues
         */
        var fetchSingleRateDetailsFromReact = (filterValues) => {
            lastSelectedFilterValues.push({
                ...lastSelectedFilterValues[activeFilterIndex],
                ...filterValues,
                selectedRateTypes: [],
                fromLeftFilter: false
            });
            delete lastSelectedFilterValues[activeFilterIndex].allRates;

            activeFilterIndex = activeFilterIndex + 1;
            $scope.selectedRateNames = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'name');
            $scope.selectedAccountName = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'accountName');
            $scope.selectedAddress = _.pluck(lastSelectedFilterValues[activeFilterIndex].selectedRates, 'address');

            $scope.showBackButton = true;
            $scope.isRateView = false;
            $scope.isRateTypeView = false;
            $scope.isRoomTypeView = true;

            if (chosenTab === 'RATE_TYPES') {
                $scope.backButtonText = 'RATES';
            }

            fetchSingleRateDetailsAndRestrictions(lastSelectedFilterValues[activeFilterIndex]);
        };

        /*
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

        /*
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

            paginationRatePerPage = Math.ceil(totalHeightOfContainer / ratePagination.rowHeight);

            // Rounding to next 5th (just for better acceptability)
            if ( paginationRatePerPage % 5 !==  0) {
                paginationRatePerPage += (5 - paginationRatePerPage % 5);
            }

            paginationRateMaxRowsDisplay = paginationRatePerPage + ratePagination.additionalRowsToPickFromPrevious;
        };

        /*
         * to update results
         * @param  {Object} event
         * @param  {Object} newFilterValues)
         */
        $scope.$on(rvRateManagerEventConstants.UPDATE_RESULTS, (event, newFilterValues) => {
            var initiatedFromLeftFilter = (_.has(newFilterValues, 'fromLeftFilter') && newFilterValues.fromLeftFilter)

            // Storing for further reference
            if (initiatedFromLeftFilter) {
                cachedRoomTypeList = [];
                cachedRateTypeList = [];
                cachedRateAndRestrictionResponseData = [];
                chosenTab = newFilterValues.chosenTab;
                // setting the current scroll position as STILL
                newFilterValues.scrollDirection = rvRateManagerPaginationConstants.scroll.STILL;
                lastSelectedFilterValues = [{...newFilterValues}]; // ES7
                activeFilterIndex = 0;
                $scope.showBackButton = false;
                totalRatesCountForPagination = 0;
                totalRateTypesCountForPagination = 0;
                showingData = [];

                switch (chosenTab) {

                    case 'RATES' :
                        $scope.backButtonText = 'RATE';
                        $scope.isRateView = true;
                        $scope.isRateTypeView = false;
                        $scope.isRoomTypeView = false;
                        break;

                    case 'RATE_TYPES' :
                        $scope.backButtonText = 'RATE TYPES';
                        $scope.isRateView = false;
                        $scope.isRateTypeView = true;
                        $scope.isRoomTypeView = false;
                        break;

                    case 'ROOM_TYPES' :
                        $scope.isRateView = false;
                        $scope.isRateTypeView = false;
                        $scope.isRoomTypeView = true;
                        break;
                }
            }

            if ($scope.isRateView) {
                if (initiatedFromLeftFilter) {
                    let allRate = {
                        ...lastSelectedFilterValues[activeFilterIndex].allRate,
                        currentPage: 1
                    };

                    lastSelectedFilterValues[activeFilterIndex].allRate = allRate;
                    newFilterValues.allRate = allRate;

                    cachedRateAndRestrictionResponseData = [];
                }

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
                if we choose multiple rate,
                the very same mode newFilterValues.showAllRates (check the lines above) will become active
                */

                // single rate view
                if (newFilterValues.selectedRates.length === 1)  {
                    fetchSingleRateDetailsAndRestrictions(newFilterValues);
                }
                // multiple rate view
                else if (newFilterValues.selectedRates.length > 1) {
                    // calling the api
                    let allRate = {
                        ...lastSelectedFilterValues[activeFilterIndex].allRate,
                        currentPage: initiatedFromLeftFilter ? 1 : lastSelectedFilterValues[activeFilterIndex].allRate.currentPage
                    };

                    lastSelectedFilterValues[activeFilterIndex].allRate = allRate;
                    newFilterValues.allRate = allRate;

                    if ( initiatedFromLeftFilter ) {
                        totalRatesCountForPagination = 0;
                        cachedRateAndRestrictionResponseData = [];
                    }
                    fetchDailyRates(newFilterValues);
                }
                else {
                    fetchDailyRates(newFilterValues);
                }
            }
            else if ($scope.isRoomTypeView) {
                $scope.isRateView = false;
                $scope.isRateTypeView = false;
                $scope.isRoomTypeView = true;
                fetchRoomTypeAndRestrictions(newFilterValues);
            }
            else if ($scope.isRateTypeView) {

                if (initiatedFromLeftFilter) {
                    let allRateTypes = {
                        ...lastSelectedFilterValues[activeFilterIndex].allRateTypes,
                        currentPage: 1
                    };

                    lastSelectedFilterValues[activeFilterIndex].allRateTypes = allRateTypes;
                    newFilterValues.allRateTypes = allRateTypes;
                }

                // calling the api
                fetchRateTypeAndRestrictions(newFilterValues);
            }
        });

        /*
         * to initialize data model for rate manager
         */
        var initializeDataModel = () => {
            // for top bar
            $scope.showContractDetailsChecked = false;
            $scope.showTopBar = false;
            $scope.showBackButton = false;
            $scope.selectedCardNames = [];
            $scope.selectedRateNames = [];
            $scope.selectedRateTypeNames = [];
            $scope.selectedAccountName = [];
            $scope.selectedAddress = [];
            $scope.fromDate = null;
            $scope.toDate = null;

            // mode
            $scope.viewingScreen = RM_RX_CONST.GRID_VIEW;
        };

        var initialState = {
            mode: RM_RX_CONST.NOT_CONFIGURED_MODE
        };

        const store = configureStore(initialState);

        const {render} = ReactDOM;
        const {Provider} = ReactRedux;

        /*
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

            // initialize pagination values
            initializePaginationValues();
        })();

    }]);
