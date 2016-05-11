angular.module('sntRover').controller('rvGroupRoomingListCtrl', [
  '$scope',
  '$rootScope',
  'rvGroupRoomingListSrv',
  '$filter',
  '$timeout',
  'rvUtilSrv',
  'rvPermissionSrv',
  '$q',
  'ngDialog',
  'rvGroupConfigurationSrv',
  '$state',
  '$window',
  '$stateParams',
  function (
    $scope,
    $rootScope,
    rvGroupRoomingListSrv,
    $filter,
    $timeout,
    util,
    rvPermissionSrv,
    $q,
    ngDialog,
    rvGroupConfigurationSrv,
    $state,
    $window,
    $stateParams) {

        BaseCtrl.call(this, $scope);
        $scope.isPrintClicked = false;
        $scope.isAnyPopupOpen = false;

        /**
         * Has Permission To Create group room block
         * @return {Boolean}
         */
        var hasPermissionToCreateRoomingList = function() {
            return (rvPermissionSrv.getPermissionValue('CREATE_ROOMING_LIST'));
        };

        /**
         * Has Permission To Edit group room block
         * @return {Boolean}
         */
        var hasPermissionToEditRoomingList = function() {
            return (rvPermissionSrv.getPermissionValue('EDIT_ROOMING_LIST'));
        };

        /**
         * Has Permission To Edit reservation
         * @return {Boolean}
         */
        var hasPermissionToEditReservation = function() {
            return (rvPermissionSrv.getPermissionValue('EDIT_RESERVATION'));
        };

        /**
         * Has Permission To check in reservation
         * @return {Boolean}
         */
        var hasPermissionToCheckinReservation = function() {
            return (rvPermissionSrv.getPermissionValue('CHECK_IN_RESERVATION'));
        };

        /**
         * Has Permission To check out reservation
         * @return {Boolean}
         */
        var hasPermissionToCheckoutReservation = function() {
            return (rvPermissionSrv.getPermissionValue('CHECK_OUT_RESERVATION'));
        };

        /**
         * Function to decide whether to show 'no reservations' screen
         * if reservations list is empty, will return true
         * @return {Boolean}
         */
        $scope.shouldShowNoReservations = function() {
            return ($scope.reservations.length === 0);
        };

        /**
         * Function to decide whether to show 'Auto Room Assign' button on screen
         * @return {Boolean}
         */
        $scope.shouldShowAutoRoomAssignmentButton = function() {
            return (!$scope.shouldShowNoReservations());
        };

        /**
         * do wanted to show checking/checkout button area
         * @return {Boolean}
         */
        $scope.shouldShowCheckInCheckoutButton = function() {
            return (!$scope.shouldShowNoReservations() &&
                !$scope.groupConfigData.summary.is_cancelled);
        };

        /**
         * wanted to disable the checkin button
         * @return {Boolean}
         */
        $scope.shouldDisableCheckinButton = function() {
            return ($scope.selected_reservations.length === 0 || !hasPermissionToCheckinReservation());
        };

        /**
         * wanted to disable the checkout button
         * @return {Boolean}
         */
        $scope.shouldDisableCheckoutButton = function() {
            return ($scope.selected_reservations.length === 0 || !hasPermissionToCheckoutReservation());
        };

        /**
         * wanted to disable the auto room assignment button
         * @return {Boolean}
         */
        $scope.shouldDisableAutoRoomAssignButton = function() {
            return ($scope.selected_reservations.length === 0 || !hasPermissionToEditReservation());
        };

        /**
         * Function to decide whether to show a particular occupancy
         * based on the key that we getting from the function we are deciding
         * @return {Boolean}
         */
        $scope.shouldShowThisOccupancyAgainstRoomType = function(keyToCheck) {
            //finding the selected room type data
            var selectedRoomType = _.findWhere($scope.roomTypesAndData, {
                room_type_id: parseInt($scope.selectedRoomType)
            });
            //we are hiding the occupancy if selected room type is undefined
            if (typeof selectedRoomType === "undefined") {
                return false;
            }
            return selectedRoomType[keyToCheck];
        };

        /**
         * Function to decide whether to show 'no guest one'
         * if guest card id is empty, will return true
         * @return {Boolean}
         */
        $scope.isGuestBlank = function(reservation) {
            return util.isEmpty(reservation.guest_card_id);
        };

        /**
         * Function to decide whether to show unassigned room' screen
         * if room is empty, will return true
         * @return {Boolean}
         */
        $scope.isRoomUnAssigned = function(reservation) {
            return util.isEmpty(reservation.room_no);
        };

        /**
         * Function to toggle between display and add mode
         */
        $scope.toggleDisplayingMode = function() {
            $scope.isAddingMode = !$scope.isAddingMode;
        };

        /**
         * util function to check whether a string is empty
         * we are assigning it as util's isEmpty function since it is using in html
         * @param {String/Object}
         * @return {boolean}
         */
        $scope.isEmpty = util.isEmpty;

        /**
         * we want to display date in what format set from hotel admin
         * @param {String/DateObject}
         * @return {String}
         */
        $scope.formatDateForUI = function(date_) {
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
         * function to get reservation class against reservation status
         * @param {String} [reservationStatus] [description]
         * @return {String} [class name]
         */
        $scope.getReservationClass = function(reservationStatus) {
            var class_ = '';
            switch (reservationStatus.toUpperCase()) {
                case "RESERVED":
                    class_ = 'arrival';
                    break;

                case "CHECKING_IN":
                    class_ = 'check-in';
                    break;

                case "CHECKEDIN":
                    class_ = 'inhouse';
                    break;

                case "CHECKING_OUT":
                    class_ = 'check-out';
                    break;

                case "CHECKEDOUT":
                    class_ = 'departed';
                    break;

                case "CANCELED":
                    class_ = 'cancel';
                    break;

                case "NOSHOW":
                case "NOSHOW_CURRENT":
                    class_ = 'no-show';
                    break;

                default:
                    class_ = '';
                    break;
            }
            return class_;
        };

        /**
         * to get the room status css class
         * @param {Object} - reservation
         * @return {String} - css class
         */
        $scope.getRoomStatusClass = function(res) {
            var mappedStatus = "";

            //Please note: St - Status

            if (res.room_service_status) {
                if (res.room_service_status === 'OUT_OF_SERVICE' ||
                    res.room_service_status === 'OUT_OF_ORDER') {
                    return "room-grey";
                }
            }

            if (res.reservation_status !== 'CHECKING_IN') {
                return mappedStatus;
            }

            if (res.room_ready_status === '') {
                return mappedStatus;
            }

            if (res.fostatus !== 'VACANT') {
                mappedStatus += " room-red";
                return mappedStatus;
            }

            switch (res.room_ready_status) {
                case "INSPECTED":
                    mappedStatus += ' room-green';
                    break;
                case "CLEAN":
                    mappedStatus += (res.checkin_inspected_only === "true") ? ' room-orange' : ' room-green';
                    break;
                case "PICKUP":
                    mappedStatus += " room-orange";
                    break;
                case "DIRTY":
                    mappedStatus += " room-red";
                    break;
            }
            return mappedStatus;
        };

        /**
         * to run angular digest loop,
         * will check if it is not running
         * return - None
         */
        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        /**
         * to switch to rooming list tab
         * @return {undefined} [description]
         */
        $scope.gotoRoomBlockTab = function() {
             $scope.closeDialogBox();
            $scope.switchTabTo('ROOM_BLOCK');
        };

        /**
         * Method to show No Room Types Attached PopUp
         * @return undefined
         */
        var showNoRoomTypesAttachedPopUp = function(argument) {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/general/rvGroupRoomingNoRoomTypeAttachedPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * [successCallBackOfFetchRoomBlockGridDetails description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfFetchRoomingDetails = function(data) {
            var toI = util.convertToInteger;

            //adding available room count over the data we got
            $scope.roomTypesAndData = _.map(data.result, function(data) {
                data.availableRoomCount = toI(data.total_rooms) - toI(data.total_pickedup_rooms);
                return data;
            });
            //initially selected room type, above one is '$scope.roomTypesAndData', pls. notice "S" between room type & data
            $scope.selectedRoomType = $scope.roomTypesAndData.length > 0 ? $scope.roomTypesAndData[0].room_type_id : undefined;

            //we have to populate possible number of rooms & occupancy against a
            $scope.changedSelectedRoomType();
        };


        /**
         * [attachBillingInfoToReservations description]
         * @return {[type]} [description]
         */
        var attachBillingInfoToReservations = function() {

            // we need to attach billing info of group to all the  corresponding reservations
            var reservationIds = _.pluck($scope.newReservations, "id");
            var params = {
                group_id: $scope.groupConfigData.summary.group_id,
                reservation_ids: reservationIds
            };

            var options = {
                params: params
            };
            $scope.callAPI(rvGroupRoomingListSrv.attachBillingInfoToReservations, options);
        };

        /**
         * [successCallBackOfcheckDefaultChargeRoutings description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfcheckDefaultChargeRoutings = function(data) {

            if (data.default_route) {
                attachBillingInfoToReservations();
            } else {
                return;
            };
        };

        /**
         * [checkDefaultChargeRoutings description]
         * @return {[type]} [description]
         */
        var checkDefaultChargeRoutings = function() {

            var params = {
                id: $scope.groupConfigData.summary.group_id
            };

            var options = {
                params: params,
                successCallBack: successCallBackOfcheckDefaultChargeRoutings
            };
            $scope.callAPI(rvGroupRoomingListSrv.checkDefaultChargeRoutings, options);
        };

        /**
         * [successCallBackOfAddReservations description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfAddReservations = function(data) {
            $scope.selected_reservations = data.results;
            $scope.updateGroupReservationsGuestData();

        };

        /**
         * to add reservations against a room type
         * @return undefined
         */
        $scope.addReservations = function() {
            //if there is no room type attached, we have to show some message
            if ($scope.roomTypesAndData.length === 0) {
                return showNoRoomTypesAttachedPopUp();
            }

            if(!$scope.possibleNumberOfRooms.length){
                $scope.errorMessage = ['No Rooms have been added for the selected Room in the Room Block.'];
                return;
            }

            //wiping the weepy
            $scope.errorMessage = '';

            //API params
            var params = {
                group_id: $scope.groupConfigData.summary.group_id,
                room_type_id: $scope.selectedRoomType,
                from_date: $scope.fromDate !== '' ? $filter('date')($scope.fromDate, $rootScope.dateFormatForAPI) : '',
                to_date: $scope.toDate !== '' ? $filter('date')($scope.toDate, $rootScope.dateFormatForAPI) : '',
                occupancy: $scope.selectedOccupancy,
                no_of_reservations: $scope.numberOfRooms
            };

            //
            var options = {
                params: params,
                successCallBack: successCallBackOfAddReservations
            };
            $scope.callAPI(rvGroupRoomingListSrv.addReservations, options);

        };

        var formatDateForAPI = function(date) {
            return $filter('date')(date, $rootScope.dateFormatForAPI)
        };

        /**
         * [fetchRoomingDetails description]
         * @return {[type]} [description]
         */
        $scope.fetchRoomingDetails = function() {
            var hasNeccessaryPermission = (hasPermissionToCreateRoomingList() &&
                hasPermissionToEditRoomingList());

            if (!hasNeccessaryPermission) {
                $scope.errorMessage = ['Sorry, You dont have enough permission to proceed!!'];
                return;
            }

            var params = {
                id: $scope.groupConfigData.summary.group_id,
                from_date: formatDateForAPI($scope.fromDate),
                to_date: formatDateForAPI($scope.toDate)
            };

            var options = {
                params: params,
                successCallBack: successCallBackOfFetchRoomingDetails
            };
            $scope.callAPI(rvGroupRoomingListSrv.getRoomTypesConfiguredAgainstGroup, options);
        };

        /**
         * when a tab switch is there, parant controller will propogate
         * API, we will get this event, we are using this to fetch new room block deails
         */
        $scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab) {
            if (activeTab !== 'ROOMING') {
                return;
            }

            //clear previos error message
            $scope.errorMessage = "";

            //re-initializing date pickers as there is to update from other tab & come back here
            setDatePickerOptions();

            //calling initially required APIs
            callInitialAPIs();
        });

        /**
         * [initializeVariables description]
         * @return {[type]} [description]
         */
        var initializeVariables = function() {
            //selected room types & its data against group
            $scope.roomTypesAndData = [];

            //list of our reservations
            $scope.reservations = [];

            //before printing we have to store our 'showing' reservation in some place
            //to show after printing.
            $scope.resevationsBeforePrint = [];

            //text mapping against occupancy
            $scope.occupancyTextMap = {
                '1': 'Single',
                '2': 'Double',
                '3': 'Triple',
                '4': 'Quadruple'
            };

            //total result count
            $scope.totalResultCount = 0;

            //total pick up count
            $scope.totalPickUpCount = 0;

            //some default selected values
            $scope.numberOfRooms = '1';
            $scope.selectedOccupancy = '1';
            $scope.possibleNumberOfRooms = [];

            //varibale used to track addmode/display mode, default add mode
            $scope.isAddingMode = true;

            //default sorting fields & directions
            $scope.sorting_field = 'room_no';
            $scope.sort_dir = 'ASC';

            //selected reservation list
            $scope.selected_reservations = [];

            //mass checkin/checkout
            $scope.qualifiedReservations = [];
            $scope.messageForMassCheckin = '';

            //variables for state maintanace - D
            $scope.roomingListState = {
                editedReservationStart: "",
                editedReservationEnd: ""
            };
        };

        /**
         * should we show pagination area
         * @return {Boolean}
         */
        $scope.shouldShowPagination = function() {
            return ($scope.totalResultCount >= $scope.perPage);
        };

        /**
         * should we disable next button
         * @return {Boolean}
         */
        $scope.isNextButtonDisabled = function() {
            return ($scope.end >= $scope.totalResultCount);
        };

        /**
         * should we disable prev button
         * @return {Boolean}
         */
        $scope.isPrevButtonDisabled = function() {
            return ($scope.start === 1);
        };

        /**
         * function to trgger on clicking the next button
         * will call the search API after updating the current page
         * return - None
         */
        $scope.loadPrevSet = function() {
            var isAtEnd = ($scope.end === $scope.totalResultCount);
            if (isAtEnd) {
                //last diff will be diff from our normal diff
                var lastDiff = ($scope.totalResultCount % $scope.perPage);
                if (lastDiff === 0) {
                    lastDiff = $scope.perPage;
                }

                $scope.start = $scope.start - $scope.perPage;
                $scope.end = $scope.end - lastDiff;
            } else {
                $scope.start = $scope.start - $scope.perPage;
                $scope.end = $scope.end - $scope.perPage;
            }

            //Decreasing the page param used for API calling
            $scope.page--;

            //yes we are calling the API
            $scope.fetchReservations();
        };

        /**
         * function to trgger on clicking the next button
         * will call the search API after updating the current page
         * return - None
         */
        $scope.loadNextSet = function() {
            $scope.start = $scope.start + $scope.perPage;
            var willNextBeEnd = (($scope.end + $scope.perPage) > $scope.totalResultCount);

            if (willNextBeEnd) {
                $scope.end = $scope.totalResultCount;
            } else {
                $scope.end = $scope.end + $scope.perPage;
            }

            //Increasing the page param used for API calling
            $scope.page++;

            //yes we are calling the API
            $scope.fetchReservations();
        };

        /**
         * Pagination things
         * @return {undefined}
         */
        var initialisePagination = function() {
            //pagination
            $scope.perPage = rvGroupRoomingListSrv.DEFAULT_PER_PAGE;
            $scope.start = 1;
            $scope.end = undefined;

            //what is page that we are requesting in the API
            $scope.page = 1;
        };


        /**
         * to add or remove from selected reservation
         * used to do show button enabling/disabling
         * @param {Object} reservation [description]
         */
        $scope.addOrRemoveFromSelectedReservation = function(reservation) {
            var isReservaionInSelectedReservation = _.findWhere($scope.selected_reservations, {
                id: (reservation.id)
            });

            if (isReservaionInSelectedReservation) {
                var index = _.indexOf(_.pluck($scope.selected_reservations, "id"), reservation.id);
                $scope.selected_reservations.splice(index, 1);
            } else {

                $scope.selected_reservations.push(reservation);
                //We have to show in the same order - in popup
                $scope.selected_reservations = _.sortBy($scope.selected_reservations, "confirm_no")
                $scope.selected_reservations = _.sortBy($scope.selected_reservations, $scope.sorting_field);
                if($scope.sort_dir === 'DESC'){
                    $scope.selected_reservations = $scope.selected_reservations.reverse();
                }

            }
        };

        /**
         * whether the reservation in selected reservation
         * @param  {Object}  reservation [description]
         * @return {Boolean}             [description]
         */
        $scope.isReservationInSelectedReservation = function(reservation) {
            var isReservaionInSelectedReservation = _.findWhere($scope.selected_reservations, {
                id: (reservation.id)
            });
            return (typeof isReservaionInSelectedReservation !== "undefined");
        };

        /**
         * whether all reservations are selected or not
         * @return {Boolean} [description]
         */
        $scope.whetherAllReservationsSelected = function() {
            return ($scope.selected_reservations.length === $scope.reservations.length);
        };

        /**
         * to select all reservation or unselect all reservation
         */
        $scope.selectOrUnSelectAllReservation = function() {
            var allSelected = $scope.whetherAllReservationsSelected();

            //un selecting all reservations
            if (allSelected) {
                $scope.selected_reservations = [];
            } else {
                $scope.selected_reservations = _.extend([], $scope.reservations);
            }
        };

        /**
         * whether all reservations are selected or not
         * @return {Boolean} [description]
         */
        $scope.whetherReservationsArePartiallySelected = function() {
            return ($scope.selected_reservations.length < $scope.reservations.length &&
                $scope.selected_reservations.length > 0);
        };

        /**
         * to sort by a field
         * @param  {String} sorting_field [description]
         */
        $scope.sortBy = function(sorting_field) {
            //if we are trying from the same tab, we have to switch between Asc/Desc
            if ($scope.sorting_field === sorting_field) {
                $scope.sort_dir = ($scope.sort_dir === 'ASC') ? 'DESC' : 'ASC';
            } else {
                $scope.sorting_field = sorting_field;
                $scope.sort_dir = 'ASC';
            }

            //calling the reservation fetch API
            $scope.fetchReservations();
        };

        /**
         * to get the sorting field class
         * @param  {String} sorting_field
         * @return {[type]}               [description]
         */
        $scope.getSortClass = function(sorting_field) {
            var classes = '';
            //if we are trying from the same tab, we have to switch between Asc/Desc
            if ($scope.sorting_field === sorting_field) {
                classes = ($scope.sort_dir === 'ASC') ? 'sorting-asc' : 'sorting-desc';
            }
            return classes;
        };

        /**
         * [changedSelectedRoomType description]
         * @return {[type]} [description]
         */
        $scope.changedSelectedRoomType = function() {
            //finding roomTypeData from list of roomTypesData, will form the possible room number list [1,2,3,4]
            var selectedRoomType = _.findWhere($scope.roomTypesAndData, {
                room_type_id: parseInt($scope.selectedRoomType)
            });

            var isValidSelectedRoomType = (typeof selectedRoomType !== "undefined");

            //forming [1,2,3,4]
            $scope.possibleNumberOfRooms = isValidSelectedRoomType ? _.range(1, util.convertToInteger(selectedRoomType.total_rooms) + 1) : [];

            // setting single as default occupancy as part of CICO-27540
            $scope.selectedOccupancy = '1';
            //we are unselecting the selected occupancy incase of invalid roomt type
            if (!isValidSelectedRoomType) {
                $scope.selectedOccupancy = '-1';
            }

            //changing the default selected number of rooms
            if (typeof $scope.numberOfRooms === "undefined" && $scope.possibleNumberOfRooms.length > 0) {
                $scope.numberOfRooms = $scope.possibleNumberOfRooms[0];
            }

            if (_.max($scope.possibleNumberOfRooms) < $scope.numberOfRooms) {
                $scope.numberOfRooms = $scope.possibleNumberOfRooms[0];
            }
        };

        /**
         * successcallback of fetch reservation
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfFetchReservations = function(data) {
            $scope.reservations = data.results;


            //total result count
            $scope.totalResultCount = data.total_count;

            //pickup
            $scope.totalPickUpCount = data.total_pickup_count;

            //if pagination end is undefined
            if ($scope.end === undefined) {
                $scope.end = $scope.reservations.length;
            }

            runDigestCycle();
            //we changed data, so
            refreshScrollers();
            // Added to resolve the issue - CICO-23144 - QA comment
            //updating from one popup not updating in other
            _.each($scope.selected_reservations, function(eachData, resIndex){

                var reservationIndex = _.findIndex(data.results, {"id": eachData.id})
                if(reservationIndex != -1){
                    $scope.selected_reservations[resIndex] = $scope.reservations[reservationIndex];
                }

            });


        };


        /**
         * utility function to form API params for group search
         * return {Object}
         */
        var formFetchReservationsParams = function() {
            var params = {
                group_id: $scope.groupConfigData.summary.group_id,
                per_page: $scope.perPage,
                page: $scope.page,
                sorting_field: $scope.sorting_field,
                sort_dir: $scope.sort_dir,
                arrival_date: formatDateForAPI($scope.arrival_date),
                dep_date: formatDateForAPI($scope.dep_date),
                query: $scope.query,
                exclude_cancel: $scope.exclude_cancel,
                show_pending_only: $scope.show_pending_only
            }

            return params;
        };

        $scope.clearQuery = function() {
            $scope.query = '';
            runDigestCycle();
            $timeout( $scope.fetchReservations, 500 );
        }

        /**
         * to fetch reservations against group
         * @return - None
         */
        $scope.fetchReservations = function() {
            var params = formFetchReservationsParams();
            var options = {
                params: params,
                successCallBack: successCallBackOfFetchReservations
            };
            $scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);
        };
        
        $scope.fiterBy = function() {
            var query = $scope.query.trim(),
                params,
                options;

            if ( ! query.lenth || query.length > 2 ) {
                params = formFetchReservationsParams();
                options = {
                    params: params,
                    successCallBack: successCallBackOfFetchReservations
                };

                $scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);
            }
        };
        $scope.debounceFetchReservations = _.debounce( $scope.fiterBy, 500 );

        /**
         * Function to clear Dates
         * @return {None}
         */
        $scope.clearDate = function(date) {
            $scope[date] = '';
            runDigestCycle();
        };


        /**
         * when the start Date choosed,
         * will assign fromDate to using the value got from date picker
         * will change the min Date of end Date
         * return - None
         */
        var fromDateChoosed = function(date, datePickerObj) {
            $scope.fromDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.fromDate > $scope.toDate) {
                $scope.toDate = '';
            }
            else {
                $scope.fetchRoomingDetails();
            }

            runDigestCycle();
        };

        /**
         * when the end Date choosed,
         * will assign endDate to using the value got from date picker
         * return - None
         */
        var toDateChoosed = function(date, datePickerObj) {
            $scope.toDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.fromDate > $scope.toDate) {
                $scope.fromDate = '';
            }
            else {
                $scope.fetchRoomingDetails();
            }

            runDigestCycle();
        };

        /**
         * utility function to set datepicker options
         * return - None
         */
        var setDatePickerOptions = function() {
            //referring data model -> from group summary
            var refData = $scope.groupConfigData.summary;

            //date picker options - Common
            var commonDateOptions = {
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1
            };

            //if we are in edit mode, we have to set the min/max date
            if (!$scope.isInAddMode()) {
                _.extend(commonDateOptions, {
                    minDate: new tzIndependentDate(refData.block_from),
                    maxDate: new tzIndependentDate(refData.block_to)
                });
            }

            //date picker options - From
            $scope.fromDateOptions = _.extend({
                onSelect: fromDateChoosed
            }, commonDateOptions);

            //date picker options - Departute
            $scope.toDateOptions = _.extend({
                onSelect: toDateChoosed
            }, commonDateOptions);

            //default from date, as per CICO-13900 it will be block_from date
            $scope.fromDate = refData.block_from;

            //default to date, as per CICO-13900 it will be block_to date
            $scope.toDate = refData.block_to;

            //default block_from date
            $scope.arrival_date = refData.block_from;

            //default block_to date
            $scope.dep_date = refData.block_to;
        };

        /**
         * utiltiy function for setting scroller and things
         * return - None
         */
        var setScroller = function() {
            //setting scroller things
            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                deceleration: 0.0001,
                shrinkScrollbars: 'clip'
            };
            $scope.setScroller('rooming_list', scrollerOptions);
        };

        /**
         * utiltiy function for setting scroller and things
         * return - None
         */
        var refreshScrollers = function() {
            $scope.refreshScroller('rooming_list');
        };

        /**
         * we want to verify from the user before going into mass checking
         * @return undefined
         */
        var openCheckinConfirmationPopup = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckin/rvGroupMassCheckinSomeResReadyPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * when no reservations meet checkin criteria
         * @return undefined
         */
        var openNoReservationMeetCheckinCriteria = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckin/rvGroupMassCheckinNoResMeetCriteria.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * we want to verify from the user before going into auto room assign
         * @return undefined
         */
        var openAutoRoomAssignConfirmationPopup = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/autoAssignRooms/rvGroupAutoRoomAssignSomeResReadyPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * when no reservations meet checkin criteria
         * @return undefined
         */
        var openNoReservationMeetAutoAssignCriteria = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/autoAssignRooms/rvGroupAutoRoomAssignNoResMeetCriteria.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * to perform auto assign rooms
         * @return undefined
         */
        $scope.autoAssignRooms = function() {
            var rStatus,
                roomNo,
                filteredList,
                qualifiedRes,
                qualifiedResCount,
                selectedResCount = $scope.selected_reservations.length;

            filteredList = _.filter($scope.selected_reservations, function(reservation) {
                rStatus = reservation.reservation_status.toUpperCase();
                return (rStatus === "RESERVED" || rStatus === "CHECKING_IN");
            });
            qualifiedRes = _.filter(filteredList, function(reservation) {
                roomNo = reservation.room_no;
                return (roomNo === null || roomNo === '');
            });
            qualifiedResCount = qualifiedRes.length;

            if (qualifiedResCount > 0) {
                $scope.qualifiedReservations = qualifiedRes;
                $scope.messageForAutoRoomAssignment = (selectedResCount === qualifiedResCount) ?
                    '' : 'GROUP_AUTO_ROOM_ASSIGN_CONFIRMATION_PARTIALLY_OKEY';
                openAutoRoomAssignConfirmationPopup();
            } else {
                openNoReservationMeetAutoAssignCriteria();
            }
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openAutoRoomAssignSuccessPopup = function(data) {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/autoAssignRooms/rvGroupResAutoRoomAssignmentSuccessPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(data),
                controller: 'rvGroupRoomingAutoRoomAssignPopUpCtrl'
            });
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openAutoRoomAssignFailedPopup = function(errorMessage) {
            var errorMessageForPopup = {
                errorMessage: errorMessage
            };

            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/autoAssignRooms/rvGroupResAutoAssignRoomsFailedPopup.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(errorMessageForPopup)
            });
        };

        /**
         * we want to refresh the listing reservation when mass checkin completed
         * @return undefined
         */
        $scope.closeAutoRoomAssignSuccessPopup = function() {
             $scope.closeDialogBox();
            //resetting the selected reservations
            $scope.selected_reservations = [];

            $timeout(function() {
                callInitialAPIs();
            }, 800);
        };

        /**
         * when the mass checkin is success (api will return success even if it includes some of the reservation which are failed during the operation)
         * @return undefined
         */
        var successCallBackOfAutoRoomAssignQualifiedReservations = function(data) {
            var failureReservations = data.failure_reservation_ids;

            if (failureReservations.length > 0) {
                data.failedReservations = [];
                _.each(data.failure_reservation_ids, function(reservation_id) {
                    data.failedReservations.push(_.findWhere($scope.selected_reservations, {
                        id: reservation_id
                    }));
                });
            }
            openAutoRoomAssignSuccessPopup(data);
        };

        /**
         * When there is some failure in API side on auto room assign
         * @return undefined
         */
        var failureCallBackOfAutoRoomAssignQualifiedReservations = function(errorMessage) {
            openAutoRoomAssignFailedPopup(errorMessage);
        };

        /**
         * when selected reservations meet the criteria and user confirmed to go ahead
         * @return undefined
         */
        $scope.autoRoomAssignQualifiedReservations = function() {
             $scope.closeDialogBox();
            $timeout(function() {
                var params = {
                    group_id: $scope.groupConfigData.summary.group_id,
                    reservation_ids: _.pluck($scope.qualifiedReservations, "id")
                };

                var options = {
                    params: params,
                    successCallBack: successCallBackOfAutoRoomAssignQualifiedReservations,
                    failureCallBack: failureCallBackOfAutoRoomAssignQualifiedReservations
                };
                $scope.callAPI(rvGroupRoomingListSrv.performAutoRoomAssignment, options);
            }, 800);
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openMassCheckinSuccessPopup = function(data) {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckin/rvGroupResMassCheckinSuccessPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(data),
                controller: 'rvGroupRoomingMassCheckinPopUpCtrl'
            });
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openMassCheckinFailedPopup = function(errorMessage) {
            var errorMessageForPopup = {
                errorMessage: errorMessage
            };

            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckin/rvGroupResMassCheckinFailedPopup.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(errorMessageForPopup)
            });
        };

        /**
         * to perform mass checkin
         * @return undefined
         */
        $scope.groupCheckin = function() {
            var qualifiedRes = _.where($scope.selected_reservations, {
                    'can_checkin': true
                }),
                qualifiedResCount = qualifiedRes.length,
                selectedResCount = $scope.selected_reservations.length;

            if (qualifiedResCount > 0) {
                $scope.qualifiedReservations = qualifiedRes;
                $scope.messageForMassCheckin = (selectedResCount === qualifiedResCount) ?
                    '' : 'GROUP_MASS_CHECKIN_CONFIRMATION_PARTIALLY_OKEY';
                openCheckinConfirmationPopup();
            } else {
                openNoReservationMeetCheckinCriteria();
            }
        };

        /**
         * we want to refresh the listing reservation when mass checkin completed
         * @return undefined
         */
        $scope.closeMassCheckinSuccessPopup = function() {
             $scope.closeDialogBox();
            //resetting the selected reservations
            $scope.selected_reservations = [];

            $timeout(function() {
                callInitialAPIs();
            }, 800);
        };

        /**
         * when the mass checkin is success (api will return success even if it includes some of the reservation which are failed during the operation)
         * @return undefined
         */
        var successCallBackOfCheckInQualifiedReservations = function(data) {
            var failureReservations = data.failure_reservation_ids;

            if (failureReservations.length > 0) {
                data.failedReservations = [];
                _.each(data.failure_reservation_ids, function(reservation_id) {
                    data.failedReservations.push(_.findWhere($scope.selected_reservations, {
                        id: reservation_id
                    }));
                });
            }
            openMassCheckinSuccessPopup(data);
        };

        /**
         * When there is some failure in API side on mass checkin
         * @return undefined
         */
        var failureCallBackOfCheckInQualifiedReservations = function(errorMessage) {
            openMassCheckinFailedPopup(errorMessage);
        };

        /**
         * when selected reservations meet the criteria and user confirmed to go ahead
         * @return undefined
         */
        $scope.checkInQualifiedReservations = function() {
             $scope.closeDialogBox();
            $timeout(function() {
                var params = {
                    group_id: $scope.groupConfigData.summary.group_id,
                    reservation_ids: _.pluck($scope.qualifiedReservations, "id")
                };

                var options = {
                    params: params,
                    successCallBack: successCallBackOfCheckInQualifiedReservations,
                    failureCallBack: failureCallBackOfCheckInQualifiedReservations
                };
                $scope.callAPI(rvGroupRoomingListSrv.performMassCheckin, options);
            }, 800);
        };

        /**
         * we want to verify from the user before going into mass checkout
         * @return undefined
         */
        var openCheckoutConfirmationPopup = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckout/rvGroupMassCheckoutSomeResReadyPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * when no reservations meet checkin criteria
         * @return undefined
         */
        var openNoReservationMeetCheckoutCriteria = function() {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckout/rvGroupMassCheckoutNoResMeetCriteria.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false
            });
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openMassCheckoutSuccessPopup = function(data) {
            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckout/rvGroupResMassCheckoutSuccessPopUp.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(data),
                controller: 'rvGroupRoomingMassCheckoutPopUpCtrl'
            });
        };

        /**
         * we will show mass checkin success pop up on completed success
         * @return undefined
         */
        var openMassCheckoutFailedPopup = function(errorMessage) {
            var errorMessageForPopup = {
                errorMessage: errorMessage
            };

            ngDialog.open({
                template: '/assets/partials/groups/rooming/popups/massCheckout/rvGroupResMassCheckoutFailedPopup.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(errorMessageForPopup)
            });
        };

        /**
         * when selected reservations meet the criteria and user confirmed to go ahead
         * @return undefined
         */
        $scope.checkOutQualifiedReservations = function() {
             $scope.closeDialogBox();
            $timeout(function() {
                var params = {
                    group_id: $scope.groupConfigData.summary.group_id,
                    reservation_ids: _.pluck($scope.qualifiedReservations, "id")
                };

                var options = {
                    params: params,
                    successCallBack: successCallBackOfCheckoutQualifiedReservations,
                    failureCallBack: failureCallBackOfCheckoutQualifiedReservations
                };
                $scope.callAPI(rvGroupRoomingListSrv.performMassCheckout, options);
            }, 800);
        };

        /**
         * to perform mass checkout
         * @return undefined
         */
        $scope.groupCheckout = function() {
            var qualifiedRes = _.where($scope.selected_reservations, {
                    'can_checkout': true
                }),
                qualifiedResCount = qualifiedRes.length,
                selectedResCount = $scope.selected_reservations.length;

            if (qualifiedResCount > 0) {
                $scope.qualifiedReservations = qualifiedRes;
                $scope.messageForMassCheckout = (selectedResCount === qualifiedResCount) ?
                    '' : 'GROUP_MASS_CHECKOUT_CONFIRMATION_PARTIALLY_OKEY';
                openCheckoutConfirmationPopup();
            } else {
                openNoReservationMeetCheckoutCriteria();
            }
        };

        /**
         * we want to refresh the listing reservation when mass checkout completed
         * @return undefined
         */
        $scope.closeMassCheckoutSuccessPopup = function() {
             $scope.closeDialogBox();
            //resetting the selected reservations
            $scope.selected_reservations = [];

            $timeout(function() {
                callInitialAPIs();
            }, 800);
        };

        /**
         * when the mass checkout is success (api will return success even if it includes some of the reservation which are failed during the operation)
         * @return undefined
         */
        var successCallBackOfCheckoutQualifiedReservations = function(data) {
            var failureReservations = data.failure_reservation_ids;

            if (failureReservations.length > 0) {
                data.failedReservations = [];
                _.each(data.failure_reservation_ids, function(reservation_id) {
                    data.failedReservations.push(_.findWhere($scope.selected_reservations, {
                        id: reservation_id
                    }));
                });
            }
            openMassCheckoutSuccessPopup(data);
        };

        /**
         * When there is some failure in API side on mass checkout
         * @return undefined
         */
        var failureCallBackOfCheckoutQualifiedReservations = function(errorMessage) {
            openMassCheckoutFailedPopup(errorMessage);
        };

        /**
         * [successFetchOfAllReqdForRoomingList description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successFetchOfAllReqdForRoomingList = function(data) {
            $scope.$emit('hideLoader');

            //if there is no room type attached, we have to show some message
            if ($scope.roomTypesAndData.length === 0) {
                showNoRoomTypesAttachedPopUp();
            }
        };

        /**
         * [successFetchOfAllReqdForRoomingList description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var failedToFetchOfAllReqdForRoomingList = function(errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        /**
         * we have to call multiple API on initial screen, which we can't use our normal function in teh controller
         * depending upon the API fetch completion, loader may disappear.
         * @return {[type]} [description]
         */
        var callInitialAPIs = function() {
            var hasNeccessaryPermission = (hasPermissionToCreateRoomingList() &&
                hasPermissionToEditRoomingList());

            if (!hasNeccessaryPermission) {
                $scope.errorMessage = ['Sorry, You dont have enough permission to proceed!!'];
                return;
            }

            var promises = [];
            //we are not using our normal API calling since we have multiple API calls needed
            $scope.$emit('showLoader');

            //rooming details fetch
            var paramsForRoomingDetails = {
                id: $scope.groupConfigData.summary.group_id,
                from_date: formatDateForAPI($scope.fromDate),
                to_date: formatDateForAPI($scope.toDate)
            };

            promises.push(rvGroupRoomingListSrv
                .getRoomTypesConfiguredAgainstGroup(paramsForRoomingDetails)
                .then(successCallBackOfFetchRoomingDetails)
            );


            //reservation list fetch
            var paramsForReservationFetch = formFetchReservationsParams();
            promises.push(rvGroupRoomingListSrv
                .fetchReservations(paramsForReservationFetch)
                .then(successCallBackOfFetchReservations)
            );


            //Lets start the processing
            $q.all(promises)
                .then(successFetchOfAllReqdForRoomingList, failedToFetchOfAllReqdForRoomingList);
        };

        //local scope for reservation edit popup showing
        (function() {
            var selectedReservation;

            /**
             * when we completed the fetching of free rooms available
             * @param  {Object} - free rooms available
             * @return {undefined}
             */
            var successCallBackOfListOfFreeRoomsAvailable = function(data) {
                var roomId = selectedReservation.room_id,
                    assignedRoom = [];

                selectedReservation.roomsAvailableToAssign = [];

                if (roomId !== null && roomId !== '') {
                    assignedRoom = [{
                        id: roomId,
                        room_number: selectedReservation.room_no
                    }];
                }

                //Since we have to include already assigned rooms in the select box, merging with rooms coming from the api
                selectedReservation.roomsAvailableToAssign = assignedRoom.concat(data.rooms);
            };

            /**
             * when all required to show reservation edit popup is in place
             * @return {undefined}
             */
            var successFetchOfAllReqdForReservationEdit = function() {
                var reservationData = angular.copy(selectedReservation),
                    room_type_id_list = null,
                    containNonEditableRoomType = null,
                    roomTypesForEditPopup = null,
                    allowedRoomTypes = null;

                _.extend($scope.roomingListState, {
                    editedReservationStart: selectedReservation.arrival_date,
                    editedReservationEnd: selectedReservation.departure_date
                });

                //as per CICO-17082, we need to show the room type in select box of edit with others
                //but should be disabled
                room_type_id_list = _.pluck($scope.roomTypesAndData, 'room_type_id');
                containNonEditableRoomType = !_.contains(room_type_id_list, parseInt(selectedReservation.room_type_id));

                if (containNonEditableRoomType) {
                    roomTypesForEditPopup = [{
                        room_type_id: selectedReservation.room_type_id,
                        room_type_name: selectedReservation.room_type_name
                    }];
                    allowedRoomTypes = _.union(roomTypesForEditPopup,
                        util.deepCopy($scope.roomTypesAndData));
                } else {
                    allowedRoomTypes = (util.deepCopy($scope.roomTypesAndData));
                }

                _.extend(reservationData, {
                    arrival_date: new tzIndependentDate(reservationData.arrival_date),
                    departure_date: new tzIndependentDate(reservationData.departure_date),
                    //Pls note, roomsFreeToAssign include already assigned room of that particular reservation
                    roomsFreeToAssign: selectedReservation.roomsAvailableToAssign,
                    allowedRoomTypes: allowedRoomTypes
                });

                //inorder to tackle the empty entry showing in case of no rooms available to assign/or prev. set as N/A
                if (reservationData.room_id === null) {
                    reservationData.room_id = '';
                }

                $scope.$emit('hideLoader');

                //we've everything to show popup
                showEditReservationPopup(reservationData);
            };

            /**
             * when we failed to fetch some of the api need to show the reservation details popup
             */
            var failedToFetchOfAllReqdForReservationEdit = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };

            /**
             * we need to fetch some data before reservation edit pop up showing
             * @param  {Object} reservation
             * @return {undefined}
             */
            var callNeccessaryApiForReservationDetailsShowing = function(reservation) {
                var promises = [];
                //we are not using our normal API calling since we have multiple API calls needed
                $scope.$emit('showLoader');

                //rooming details fetch
                var paramsForListOfFreeRooms = {
                    reserevation_id: reservation.id,
                    num_of_rooms_to_fetch: 5,
                    room_type_id: reservation.room_type_id
                };
                promises.push(rvGroupRoomingListSrv
                    .getFreeAvailableRooms(paramsForListOfFreeRooms)
                    .then(successCallBackOfListOfFreeRoomsAvailable)
                );

                //Lets start the processing
                $q.all(promises)
                    .then(successFetchOfAllReqdForReservationEdit, failedToFetchOfAllReqdForReservationEdit);
            };

            /**
             * Function to edit a reservation from the rooming list
             */
            var showEditReservationPopup = function(reservationData) {
                ngDialog.open({
                    template: '/assets/partials/groups/rooming/popups/editReservation/rvGroupEditRoomingListItem.html',
                    className: '',
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false,
                    controller: 'rvGroupReservationEditCtrl',
                    data: JSON.stringify(reservationData)
                });
            };

            /**
             * when clicked on a particular reservation, this will trigger
             * @param  {Object} reservation
             * @return {undefined}
             */
            $scope.clickedOnReservation = function (reservation) {
                selectedReservation = reservation;
                callNeccessaryApiForReservationDetailsShowing (reservation);
            };

        }());



        $scope.checkoutReservation = function(reservation) {
            //  It navigates to the Guest Bill for the selected record.
        };

        /**
         * event triggered by ngrepeatend directive
         * mainly used to referesh scroller/printing
         */
        $scope.$on('NG_REPEAT_COMPLETED_RENDERING', function(event) {
            $timeout(function() {
                if ($scope.print_type === 'rooming_list') {
                    printRoomingList();
                }
            }, 500);
        });

        /**
         * to print rooming list
         * this method requires '$scope.resevationsBeforePrint', so please check where all it is assigning
         * @return undefined
         */
        var printRoomingList = function() {

            //changing the orientation to landscape
            addPrintOrientation();

            //as part of https://stayntouch.atlassian.net/browse/CICO-14384?focusedCommentId=48871&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-48871
            //We dont know the icon background-image loaded or not. We need to start print preview
            //only when it is loaded, this is wrong practice (accessing DOM elements from controller), but there is no option
            var $container = $('#print-orientation'),
                bg = $container.css('background-image'),
                src = bg.replace(/(^url\()|(\)$|[\"\'])/g, ''),
                $img = $('<img>').attr('src', src).on('load', function() {
                    //unbinding the events & removing the elements inorder to prevent memory leaks
                    $(this).off('load');
                    $(this).remove();

                    //yes we have everything we wanted
                    window.print();

                    //if we are in the app
                    $timeout(function() {
                        if (sntapp.cordovaLoaded) {
                            cordova.exec(
                                function(success) {},
                                function(error) {},
                                'RVCardPlugin',
                                'printWebView', []
                            );
                        };
                    }, 300);


                    $timeout(function() {
                        $scope.print_type = '';
                        removePrintOrientation();
                        $scope.reservations = util.deepCopy($scope.resevationsBeforePrint);
                        $scope.resevationsBeforePrint = [];

                    }, 1200);
                    $timeout(function() {
                        $scope.isPrintClicked = false;
                    }, 200);
                });


        };

        /**
         * add the print orientation before printing
         * @return - None
         */
        var addPrintOrientation = function() {
            $('body').append("<style id='print-orientation'>@page { size: landscape; }</style>");
        };

        /**
         * remove the print orientation before printing
         * @return - None
         */
        var removePrintOrientation = function() {
            $('#print-orientation').remove();
        };

        /**
         * Function - Successful callback of printRoomingList.Prints fetched Rooming List.
         * @return - None
         */
        var successCallBackOfFetchAllReservationsForPrint = function(data) {
            //if you are looking for where the HELL this list is printing
            //look for "NG_REPEAT_COMPLETED_RENDERING", thanks!!
            $scope.isPrintClicked = true;
            $scope.resevationsBeforePrint = util.deepCopy($scope.reservations);
            $scope.reservations = data.results;
            $scope.print_type = 'rooming_list';

        };

        /**
         * Function to fetch Rooming list for print.
         * @return - None
         */
        $scope.fetchReservationsForPrintingRoomingList = function() {
            var params = {
                group_id: $scope.groupConfigData.summary.group_id,
                per_page: 1000
            };
            var options = {
                params: params,
                successCallBack: successCallBackOfFetchAllReservationsForPrint
            };
            $scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);
        };
        /**
         * Function to pop up for print/mail option Rooming list.
         * @return - None
         */
        $scope.openEmailPrintPopup = function() {
                // if ($scope.groupConfigData && $scope.groupConfigData.summary && !!$scope.groupConfigData.summary.contact_email) {
                //     $scope.sendEmail($scope.groupConfigData.summary.contact_email);
                // } else {
                    $scope.isAnyPopupOpen = true;
                    ngDialog.open({
                        template: '/assets/partials/groups/rooming/popups/general/rvRoomingListEmailPrompt.html',
                        className: '',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false
                    });

                // }
            };
            /**
             * Function to send e-mail of Rooming list.API call goes here.
             * @return - None
             */
        $scope.sendEmail = function(mailTo) {
            if(!mailTo){
                $scope.errorMessage =  ["Please enter email!!"];
                return;
            }
            $scope.errorMessage = "";
            var mailSent = function(data) {
                    $scope.closeDialogBox();
                    $scope.isAnyPopupOpen = false;
                },
                mailFailed = function(errorMessage) {
                    $scope.errorMessage = errorMessage;
                   // $scope.closeDialog();
                };
            var params = {
                "to_address": mailTo,
                "group_id": $scope.groupConfigData.summary.group_id,
                "is_include_rate": !$scope.groupConfigData.summary.hide_rates
            };
            $scope.callAPI(rvGroupRoomingListSrv.emailInvoice, {
                successCallBack: mailSent,
                failureCallBack: mailFailed,
                params: params
            });
        };
        $scope.closeDialogBox = function(){
            $scope.closeDialog();
            $scope.isAnyPopupOpen = false;
        }

        $scope.printRegistrationCards = function() {
            // add the print orientation after printing
            var removePrintOrientation = function() {
                    $('#print-orientation').remove();
                },
                addPrintOrientation = function() { // add the print orientation before printing
                    $('head').append("<style id='print-orientation'>@page { size: portrait; }</style>");
                },
                sucessCallback = function(data) {
                    $scope.$emit('hideLoader');

                    // CICO-21803: filter selected reservations for print
                    var selectedForPrint = _($scope.selected_reservations).pluck('id'),
                        totalSelected    = selectedForPrint.length;

                    data.group_reservations = _.map(data.group_reservations, function (reservation) {
                        reservation.print = true;
                        if (totalSelected > 0 && selectedForPrint.indexOf(reservation.id) < 0) {
                            reservation.print = false;
                        }
                        return reservation;
                    });

                    $scope.printRegCardData = data;
                    $scope.errorMessage = "";

                    // CICO-9569 to solve the hotel logo issue
                    $("header .logo").addClass('logo-hide');
                    $("header .h2").addClass('text-hide');

                    // add the orientation
                    addPrintOrientation();

                    /*
                     *   ======[ READY TO PRINT ]======
                     */
                    // this will show the popup with full bill
                    $scope.isPrintRegistrationCard = true;
                    $rootScope.addNoPrintClass = true;

                    $timeout(function() {
                        /*
                         *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                         */

                        $window.print();
                        if (sntapp.cordovaLoaded) {
                            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
                        };
                    }, 100);

                    /*
                     *   ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                     */
                    $timeout(function() {
                        $scope.isPrintRegistrationCard = false;
                        $rootScope.addNoPrintClass = false;
                        // CICO-9569 to solve the hotel logo issue
                        $("header .logo").removeClass('logo-hide');
                        $("header .h2").addClass('text-hide');

                        // remove the orientation after similar delay
                        removePrintOrientation();
                    }, 100);

                },
                failureCallback = function(errorData) {
                    $scope.isPrintRegistrationCard = false;
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = errorData;
                };

            $scope.invokeApi(rvGroupRoomingListSrv.fetchRegistrationCardPrintData, {
                'group_id': $scope.groupConfigData.summary.group_id
            }, sucessCallback, failureCallback);
        };

        /**
         * Function to handle success, failure callbacks for toggleHideRate
         */
        var sucessCallbackToggleHideRate = function(data){
            $scope.groupConfigData.summary.hide_rates = !$scope.groupConfigData.summary.hide_rates;
            $scope.errorMessage = "";
        },
        failureCallbackToggleHideRate = function(errorData){
            $scope.errorMessage = errorData;
        };
        /**
         * Function to toggle show rate checkbox value
         */
        $scope.clickedShowRate = function(){

            var params = {
                'group_id'      : $scope.groupConfigData.summary.group_id,
                'hide_rates'    : !$scope.groupConfigData.summary.hide_rates
            };
            $scope.callAPI(rvGroupConfigurationSrv.toggleHideRate, {
                successCallBack: sucessCallbackToggleHideRate,
                failureCallBack: failureCallbackToggleHideRate,
                params: params
            });
        };
        $scope.updateGroupReservationsGuestData = function(){
            $scope.isUpdateReservation = true;
            $scope.totalCountForUpdate = $scope.selected_reservations.length;


            ngDialog.open({
                        template: '/assets/partials/groups/rooming/popups/editReservation/rvAddEditReservationGuestData.html',
                        className: '',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false,
                        controller: 'rvReservationGuestDataPopupCtrl'
                    });

        };

        /**
         * to set the active left side menu
         * @return {undefined}
         */
        var setActiveLeftSideMenu = function () {
            var activeMenu = ($scope.isInAddMode()) ? "menuCreateGroup": "menuManageGroup";
            $scope.$emit("updateRoverLeftMenu", activeMenu);
        };

        /**
         * Function to initialise room block details
         * @return - None
         */
        var initializeMe = function() {
            //updating the left side menu
            setActiveLeftSideMenu();

            //IF you are looking for where the hell the API is CALLING
            //scroll above, and look for the event 'GROUP_TAB_SWITCHED'

            //date related setups and things
            setDatePickerOptions();

            //setting scrollers
            setScroller();

            //we have a list of scope varibales which we wanted to initialize
            initializeVariables();

            //pagination
            initialisePagination();
            //calling initially required APIs
            // CICO-17898 The initial APIs need to be called in the scenario while we come back to the Rooming List Tab from the stay card
            var isInRoomingList = ($scope.groupConfigData.activeTab === "ROOMING"),
            	amDirectlyComingToRoomingList = $stateParams.activeTab === 'ROOMING';

            if (isInRoomingList && (amDirectlyComingToRoomingList)) {
                $timeout(function(){
                    callInitialAPIs();
                }, 10);
            }
        }();


        /**
         * event exposed for other (mainly for children) controllers to update the data
         */
        $scope.$on("REFRESH_GROUP_ROOMING_LIST_DATA", function (event) {
            //calling initially required APIs
            callInitialAPIs();
        });


    }
]);