sntRover.controller('rvAllotmentReservationsListCtrl', [
  '$scope',
  '$rootScope',
  'rvAllotmentReservationsListSrv',
  '$filter',
  '$timeout',
  'rvUtilSrv',
  'rvPermissionSrv',
  '$q',
  'ngDialog',
  'rvAllotmentConfigurationSrv',
  '$state',
  '$window',
  '$stateParams',
  function (
    $scope,
    $rootScope,
    rvAllotmentReservationsListSrv,
    $filter,
    $timeout,
    util,
    rvPermissionSrv,
    $q,
    ngDialog,
    rvAllotmentConfigurationSrv,
    $state,
    $window,
    $stateParams) {

        BaseCtrl.call(this, $scope);

        var currentMode;

        /**
         * Has Permission To Create group room block
         * @return {Boolean}
         */
        var hasPermissionToCreateRoomingList = function() {
            //TODO: Change key to allotment namespace, not added in API
            return (rvPermissionSrv.getPermissionValue('CREATE_ROOMING_LIST'));
        };

        /**
         * Has Permission To Edit group room block
         * @return {Boolean}
         */
        var hasPermissionToEditRoomingList = function() {
            //TODO: Change key to allotment namespace, not added in API
            return (rvPermissionSrv.getPermissionValue('EDIT_ROOMING_LIST'));
        };

        /**
         * Has Permission To Edit reservation
         * @return {Boolean}
         */
        var hasPermissionToEditReservation = function() {
            //TODO: Change key to allotment namespace, not added in API
            return (rvPermissionSrv.getPermissionValue('EDIT_RESERVATION'));
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
         * Function to toggle between view mode and add mode
         */
        $scope.toggleDisplayingMode = function() {
            $scope.isAddingMode = !$scope.isAddingMode;
        };

        /**
         * Function to clear from Date
         * @return {None}
         */
        $scope.clearReservationAddFromDate = function() {
            $scope.reservationAddFromDate = '';
            runDigestCycle();
        };

        /**
         * Function to clear to Date
         * @return {None}
         */
        $scope.clearReservationAddToDate = function() {
            $scope.reservationAddToDate = '';
            runDigestCycle();
        };

        /**
         * Function to clear from Date
         * @return {None}
         */
        $scope.clearReservationSearchFromDate = function() {
            $scope.reservationSearchFromDate = '';
            runDigestCycle();
        };

        /**
         * Function to clear to Date
         * @return {None}
         */
        $scope.clearReservationSearchToDate = function() {
            $scope.reservationSearchToDate = '';
            runDigestCycle();
        };

        /**
         * when the reservation add start Date choosed,
         * will assign fromDate to using the value got from date picker
         * will change the min Date of end Date
         * return - None
         */
        var reservationAddFromDateChoosed = function(date, datePickerObj) {
            $scope.reservationAddFromDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.reservationAddFromDate > $scope.reservationAddToDate) {
                $scope.reservationAddToDate = '';
            }

            runDigestCycle();
        };

        /**
         * when the reservation add end Date choosed,
         * will assign endDate to using the value got from date picker
         * return - None
         */
        var reservationAddToDateChoosed = function(date, datePickerObj) {
            $scope.reservationAddToDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.reservationAddFromDate > $scope.reservationAddToDate) {
                $scope.reservationAddFromDate = '';
            }

            runDigestCycle();
        };

        /**
         * when the reservation search start Date choosed,
         * will assign fromDate to using the value got from date picker
         * will change the min Date of end Date
         * return - None
         */
        var reservationSearchFromDateChoosed = function(date, datePickerObj) {
            $scope.reservationSearchFromDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.reservationSearchFromDate > $scope.reservationSearchToDate) {
                $scope.reservationSearchToDate = '';
            }

            runDigestCycle();
        };

        /**
         * when the reservation search end Date choosed,
         * will assign endDate to using the value got from date picker
         * return - None
         */
        var reservationSearchToDateChoosed = function(date, datePickerObj) {
            $scope.reservationSearchToDate = new tzIndependentDate(util.get_date_from_date_picker(datePickerObj));

            // we will clear end date if chosen start date is greater than end date
            if ($scope.reservationSearchFromDate > $scope.reservationSearchToDate) {
                $scope.reservationSearchFromDate = '';
            }

            runDigestCycle();
        };

        /**
         * utility function to set datepicker options
         * return - None
         */
        var setDatePickerOptions = function() {
            //referring data model -> from allotment summary
            var refData = $scope.allotmentConfigData.summary;

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

            //date picker options - Reservation Add From
            $scope.reservationAddFromDateOptions = _.extend({
                onSelect: reservationAddFromDateChoosed
            }, commonDateOptions);

            //date picker options - Reservation to From
            $scope.reservationAddToDateOptions = _.extend({
                onSelect: reservationAddToDateChoosed
            }, commonDateOptions);

            //date picker options - Reservation Add From
            $scope.reservationSearchFromDateOptions = _.extend({
                onSelect: reservationSearchFromDateChoosed
            }, commonDateOptions);

            //date picker options - Reservation to From
            $scope.reservationSearchToDateOptions = _.extend({
                onSelect: reservationSearchToDateChoosed
            }, commonDateOptions);

            //default from date, as per CICO-13900 it will be block_from date
            $scope.reservationAddFromDate = refData.block_from;

            //default to date, as per CICO-13900 it will be block_to date
            $scope.reservationAddToDate = refData.block_to;

            $scope.reservationSearchFromDate = refData.block_from;
            $scope.reservationSearchToDate = refData.block_to;
        };

        /**
         * @return {Boolean}
         */
        $scope.shouldShowSearchReservationFields = function() {
            return (isReservationListInSearchMode() && !$scope.isCancelledAllotment());
        };

        /**
         * @return {Boolean}
         */
        $scope.shouldShowAddReservationFields = function() {
            return (isReservationListInAddMode() && !$scope.isCancelledAllotment());
        };

        /**
         * @return {Boolean}
         */
        $scope.isCancelledAllotment = function() {
            return $scope.allotmentConfigData.summary.is_cancelled;
        };

        /**
         * between default & add mode
         * @return {undefined}
         */
        $scope.toggleAddMode = function() {
            if (isReservationListInAddMode()) {
                setToDefaultMode();
            }
            else {
                setToAddMode();
            }
        };

        /**
         * between default & search mode
         * @return {undefined}
         */
        $scope.toggleSearchMode = function() {
            if (isReservationListInSearchMode()) {
                setToDefaultMode();
            }
            else {
                setToSearchMode();
            }
        };

        /**
         * to set to Add mode
         */
        var setToAddMode = function() {
            currentMode = "ADD";
            $scope.searchQuery = '';
        };

        /**
         * to set to Search mode
         */
        var setToSearchMode = function() {
            $scope.searchQuery = '';
            currentMode = "SEARCH";
        };

        /**
         * to set to default mode
         */
        var setToDefaultMode = function() {
            $scope.searchQuery = '';
            currentMode = "DEFAULT";
        };

        /**
         * @return {Boolean}
         */
        var isReservationListInSearchMode = function() {
            return (currentMode === "SEARCH");
        };

        /**
         * @return {Boolean}
         */
        var isReservationListInAddMode = function() {
            return (currentMode === "ADD");
        };

        /**
         * when a tab switch is there, parant controller will propogate
         * API, we will get this event, we are using this to fetch new room block deails
         */
        $scope.$on("ALLOTMENT_TAB_SWITCHED", function(event, activeTab) {
            if (activeTab !== 'ROOMING') {
                return;
            }
            //calling initially required APIs
            callInitialAPIs();
        });
        
        /**
         * [initializeVariables description]
         * @return {[type]} [description]
         */
        var initializeVariables = function() {
            //selected room types & its data against allotment
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

            //varibale used to track addmode/search/default mode, "DEFAULT" ->  defalt mode
            currentMode = "DEFAULT";

            //default sorting fields & directions
            $scope.sorting_field = 'room_no';
            $scope.sort_dir = 'ASC';

            //selected reservation list
            $scope.selected_reservations = [];

            //mass checkin/checkout
            $scope.qualifiedReservations = [];

            //seaarch text box model
            $scope.searchQuery = '';

            //variables for state maintanace - D
            $scope.roomingListState = {
                editedReservationStart: "",
                editedReservationEnd: ""
            };
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
         * to set the active left side menu
         * @return {undefined}
         */
        var setActiveLeftSideMenu = function () {
            var activeMenu = ($scope.isInAddMode()) ? "menuCreateAllotment": "menuManageAllotment";
            $scope.$emit("updateRoverLeftMenu", activeMenu);
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
            $scope.closeDialog();
            $scope.switchTabTo('ROOM_BLOCK');
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
         * [fetchRoomingDetails description]
         * @return {[type]} [description]
         */
        $scope.fetchConfiguredRoomTypeDetails = function() {
            var hasNeccessaryPermission = (hasPermissionToCreateRoomingList() &&
                hasPermissionToEditRoomingList());

            if (!hasNeccessaryPermission) {
                $scope.errorMessage = ['Sorry, You dont have enough permission to proceed!!'];
                return;
            }

            var params = {
                id: $scope.allotmentConfigData.summary.group_id
            };

            var options = {
                params: params,
                successCallBack: successCallBackOfFetchConfiguredRoomTypeDetails
            };
            $scope.callAPI(rvAllotmentReservationsListSrv.getRoomTypesConfiguredAgainstGroup, options);
        };

        /**
         * [successCallBackOfFetchConfiguredRoomTypeDetails description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfFetchConfiguredRoomTypeDetails = function(data) {
            var toI = util.convertToInteger;
            //if we dont have any data in our hand
            if ($scope.roomTypesAndData.length === 0) {
                //adding available room count over the data we got
                $scope.roomTypesAndData = _.map(data.result, function(data) {
                    data.availableRoomCount = toI(data.total_rooms) - toI(data.total_pickedup_rooms);
                    return data;
                });
                //initially selected room type, above one is '$scope.roomTypesAndData', pls. notice "S" between room type & data
                $scope.selectedRoomType = $scope.roomTypesAndData.length > 0 ? $scope.roomTypesAndData[0].room_type_id : undefined;

            }
            //if we have any data in our hand, just updating the available room count
            else {
                _.each($scope.roomTypesAndData, function(roomTypeData) {
                    var correspondingActualData = _.findWhere(data.result, {
                        room_type_id: roomTypeData.room_type_id
                    });

                    //CICO-20169 Handles cases where total rooms are updated in room block
                    _.extend(roomTypeData, correspondingActualData);

                    roomTypeData.availableRoomCount = toI(correspondingActualData.total_rooms) - toI(correspondingActualData.total_pickedup_rooms);
                });

                //if we've added a new room type from room block & we are switching the tab
                if (data.result.length !== $scope.roomTypesAndData.length) {
                    //we've to find the newly added id of room types
                    var new_room_type_ids = _.pluck(data.result, "room_type_id"),
                        existing_room_type_ids = _.pluck($scope.roomTypesAndData, "room_type_id"),
                        room_type_ids_to_add = _.difference(new_room_type_ids, existing_room_type_ids);

                    //adding the newly added room type to the existing array
                    for (var i = 0; i < room_type_ids_to_add.length; i++) {
                        var room_type_to_add = _.findWhere(data.result, {
                            room_type_id: room_type_ids_to_add[i]
                        });

                        if (room_type_to_add) {
                            room_type_to_add.availableRoomCount = toI(room_type_to_add.total_rooms) - toI(room_type_to_add.total_pickedup_rooms);
                        }
                        $scope.roomTypesAndData.push(room_type_to_add);
                    }
                }
            }

            //we have to populate possible number of rooms & occupancy against a
            $scope.changedSelectedRoomType();
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
        };

        /**
         * utility function to form API params for group search
         * return {Object}
         */
        var formFetchReservationsParams = function() {
            var params = {
                group_id: $scope.allotmentConfigData.summary.allotment_id,
                per_page: $scope.perPage,
                page: $scope.page,
                sorting_field: $scope.sorting_field,
                sort_dir: $scope.sort_dir
            };
            return params;
        };

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
            $scope.callAPI(rvAllotmentReservationsListSrv.fetchReservations, options);
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
                id: $scope.allotmentConfigData.summary.group_id
            };
            promises.push(rvAllotmentReservationsListSrv
                .getRoomTypesConfiguredAgainstGroup(paramsForRoomingDetails)
                .then(successCallBackOfFetchConfiguredRoomTypeDetails)
            );


            //reservation list fetch
            var paramsForReservationFetch = formFetchReservationsParams();
            promises.push(rvAllotmentReservationsListSrv
                .fetchReservations(paramsForReservationFetch)
                .then(successCallBackOfFetchReservations)
            );


            //Lets start the processing
            $q.all(promises)
                .then(successFetchOfAllReqdForRoomingList, failedToFetchOfAllReqdForRoomingList);
        };

        /**
         * Function to initialise allotment reservation list
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
            //setScroller();

            //we have a list of scope varibales which we wanted to initialize
            initializeVariables();

            //pagination
            //initialisePagination();
            //calling initially required APIs
            // CICO-17898 The initial APIs need to be called in the scenario while we come back to the Rooming List Tab from the stay card
            /*var isInRoomingList = ($scope.groupConfigData.activeTab === "ROOMING"),
                amDirectlyComingToRoomingList = $stateParams.activeTab === 'ROOMING';

            if (isInRoomingList && (amDirectlyComingToRoomingList)) {
                $timeout(function(){
                    callInitialAPIs();
                }, 10);                
            }*/
        }();
    }
]);