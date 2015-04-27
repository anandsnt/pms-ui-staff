sntRover.controller('rvGroupRoomingListCtrl', [
    '$scope',
    '$rootScope',
    'rvGroupRoomingListSrv',
    '$filter',
    '$timeout',
    '$state',
    'rvUtilSrv',
    'rvPermissionSrv',
    '$q',
    'ngDialog',
    'rvGroupConfigurationSrv',
    '$state',
    function($scope,
        $rootScope,
        rvGroupRoomingListSrv,
        $filter,
        $timeout,
        $state,
        util,
        rvPermissionSrv,
        $q,
        ngDialog,
        rvGroupConfigurationSrv,
        $state) {

        BaseCtrl.call(this, $scope);

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
         * Function to decide whether to show 'no reservations' screen
         * if reservations list is empty, will return true
         * @return {Boolean}
         */
        $scope.shouldShowNoReservations = function() {
            return ($scope.reservations.length === 0);
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
            if (typeof selectedRoomType === "undefined") return false;

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
            var classes = {
                "RESERVED": 'arrival',
                "CHECKING_IN": 'check-in',
                "CHECKEDIN": 'inhouse',
                "CHECKING_OUT": 'check-out',
                "CHECKEDOUT": 'departed',
                "CANCELED": 'cancel',
                "NOSHOW": 'no-show',
                "NOSHOW_CURRENT": 'no-show',
            };
            if (reservationStatus.toUpperCase() in classes) {
                return classes[reservationStatus.toUpperCase()];
            }
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
         * [successCallBackOfFetchRoomBlockGridDetails description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfFetchRoomingDetails = function(data) {

            //if we dont have any data in our hand
            if ($scope.roomTypesAndData.length === 0) {
                //adding available room count over the data we got
                $scope.roomTypesAndData = _.map(data.result, function(data) {
                    data.availableRoomCount = util.convertToInteger(data.total_rooms) - util.convertToInteger(data.total_pickedup_rooms);
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
                    roomTypeData.availableRoomCount = util.convertToInteger(correspondingActualData.total_rooms) - util.convertToInteger(correspondingActualData.total_pickedup_rooms);
                });
            }

            //we have to populate possible number of rooms & occupancy against a 
            $scope.changedSelectedRoomType();
        }

        /**
         * [successCallBackOfAddReservations description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successCallBackOfAddReservations = function(data) {
            _.each(data.results, function(reservation) {
                $scope.reservations.push(reservation);
            });

            //total result count
            $scope.totalResultCount = data.total_count;

            //we changed data, so
            refreshScrollers();

            //rooming data will change after adding some reservation
            $scope.fetchRoomingDetails();
        };

        /**
         * to add reservations against a room type
         * @return undefined
         */
        $scope.addReservations = function() {
            //API params
            var params = {
                group_id: $scope.groupConfigData.summary.group_id,
                room_type_id: $scope.selectedRoomType,
                from_date: $scope.fromDate,
                to_date: $scope.toDate,
                occupancy: $scope.selectedOccupancy,
                no_of_reservations: $scope.numberOfRooms
            };

            //
            var options = {
                params: params,
                successCallBack: successCallBackOfAddReservations,
            };
            $scope.callAPI(rvGroupRoomingListSrv.addReservations, options);

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
                id: $scope.groupConfigData.summary.group_id
            };

            var options = {
                params: params,
                successCallBack: successCallBackOfFetchRoomingDetails,
            };
            $scope.callAPI(rvGroupRoomingListSrv.getRoomTypesConfiguredAgainstGroup, options);
        };

        /**
         * when a tab switch is there, parant controller will propogate
         * API, we will get this event, we are using this to fetch new room block deails
         */
        /*$scope.$on("GROUP_TAB_SWITCHED", function(event, activeTab){
            if (activeTab !== 'ROOMING') return;
            $scope.fetchRoomingDetails();
        });*/

        /**
         * [initializeVariables description]
         * @return {[type]} [description]
         */
        var initializeVariables = function() {
            //selected room types & its data against group
            $scope.roomTypesAndData = [];

            //list of our reservations
            $scope.reservations = [];

            //text mapping against occupancy
            $scope.occupancyTextMap = {
                '1': 'Single',
                '2': 'Double',
                '3': 'Triple',
                '4': 'Quadruple',
            };

            //total result count
            $scope.totalResultCount = 0;

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
            var isAtEnd = ($scope.end == $scope.totalResultCount);
            if (isAtEnd) {
                //last diff will be diff from our normal diff
                var lastDiff = ($scope.totalResultCount % $scope.perPage);
                if (lastDiff == 0) {
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
            if ($scope.sorting_field == sorting_field) {
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
            if ($scope.sorting_field == sorting_field) {
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

            //forming [1,2,3,4]
            $scope.possibleNumberOfRooms = _.range(1, util.convertToInteger(selectedRoomType.total_rooms) + 1);

            //changing the default selected number of rooms
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
            //if pagination end is undefined
            if ($scope.end == undefined) {
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
                group_id: $scope.groupConfigData.summary.group_id,
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
            $scope.callAPI(rvGroupRoomingListSrv.fetchReservations, options);
        };

        /**
         * Function to clear from Date
         * @return {None}
         */
        $scope.clearFromDate = function() {
            $scope.fromDate = '';
            runDigestCycle();
        };

        /**
         * Function to clear to Date
         * @return {None}
         */
        $scope.clearToDate = function() {
            $scope.toDate = '';
            runDigestCycle();
        };

        /**
         * when the start Date choosed,
         * will assign fromDate to using the value got from date picker
         * will change the min Date of end Date
         * return - None
         */
        var fromDateChoosed = function(date, datePickerObj) {
            $scope.fromDate = date;

            // we will clear end date if chosen start date is greater than end date
            if ($scope.fromDate > $scope.toDate) {
                $scope.toDate = '';
            }

            runDigestCycle();
        };

        /**
         * when the end Date choosed,
         * will assign endDate to using the value got from date picker
         * return - None
         */
        var toDateChoosed = function(date, datePickerObj) {
            $scope.toDate = date;

            // we will clear end date if chosen start date is greater than end date
            if ($scope.fromDate > $scope.toDate) {
                $scope.fromDate = '';
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
                numberOfMonths: 1,
            };

            //date picker options - From
            $scope.fromDateOptions = _.extend({
                minDate: new tzIndependentDate(refData.block_from),
                maxDate: new tzIndependentDate(refData.block_to),
                onSelect: fromDateChoosed
            }, commonDateOptions);

            //date picker options - Departute
            $scope.toDateOptions = _.extend({
                minDate: new tzIndependentDate(refData.block_from),
                maxDate: new tzIndependentDate(refData.block_to),
                onSelect: toDateChoosed
            }, commonDateOptions);

            //default from date, as per CICO-13900 it will be block_from date       
            $scope.fromDate = $filter('date')(tzIndependentDate(refData.block_from),
                $rootScope.dateFormat);

            //default to date, as per CICO-13900 it will be block_to date    
            $scope.toDate = $filter('date')(tzIndependentDate(refData.block_to),
                $rootScope.dateFormat);
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
         * [successFetchOfAllReqdForRoomingList description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        var successFetchOfAllReqdForRoomingList = function(data) {
            $scope.closeDialog();
            $scope.$emit('hideLoader');
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
                id: $scope.groupConfigData.summary.group_id
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
        }

        /**
         * Function to edit a reservation from the rooming list
         */
        $scope.showEditReservationPopup = function(reservation) {
            var reservationData = angular.copy(reservation);
            reservationData.reservationStatusFlags = getReservationStatusFlags(reservation);
            ngDialog.open({
                template: '/assets/partials/groups/rooming/rvGroupEditRoomingListItem.html',
                className: '',
                scope: $scope,
                closeByDocument: false,
                closeByEscape: false,
                data: JSON.stringify(reservationData)
            });
        }

        /**
         * Method to update the reservation
         * @param  {object} reservation
         * @return {undefined}
         */
        $scope.updateReservation = function(reservation) {
            if (reservation.reservation_status == "CANCELED") {
                return false;
            } else {
                reservation.group_id = $scope.groupConfigData.summary.group_id;

                var onUpdateReservationSuccess = function(data) {
                        //calling initially required APIs
                        callInitialAPIs();
                    },
                    onUpdateReservationFailure = function(errorMessage) {
                        $scope.errorMessage = errorMessage;
                    }

                $scope.callAPI(rvGroupConfigurationSrv.updateRoomingListItem, {
                    successCallBack: onUpdateReservationSuccess,
                    failureCallBack: onUpdateReservationFailure,
                    params: reservation
                });
            }
        }

        var getReservationStatusFlags = function(reservation) {
            return {
                isUneditable: reservation.reservation_status == "CANCELED",
                isExpected: reservation.reservation_status == "RESERVED" || reservation.reservation_status == "CHECKING_IN",
                isStaying: reservation.reservation_status == "CHECKEDIN" || reservation.reservation_status == "CHECKING_OUT",
                canChekin: !!reservation.room_no && new tzIndependentDate(reservation.arrival_date) == new tzIndependentDate($rootScope.businessDate),
                isGuestAttached: !!reservation.lastname
            }
        }

        /**
         * Method to remove the reservation
         * @param  {object} reservation
         * @return {undefined}
         */
        $scope.removeReservation = function(reservation) {
            if (reservation.reservationStatusFlags.isUneditable || reservation.reservationStatusFlags.isStaying) {
                return false;
            } else {
                var onRemoveReservationSuccess = function(data) {
                        //calling initially required APIs
                        callInitialAPIs();
                    },
                    onRemoveReservationFailure = function(errorMessage) {
                        $scope.errorMessage = errorMessage;
                    }

                $scope.callAPI(rvGroupConfigurationSrv.removeRoomingListItem, {
                    successCallBack: onRemoveReservationSuccess,
                    failureCallBack: onRemoveReservationFailure,
                    params: {
                        id: reservation.id,
                        group_id: $scope.groupConfigData.summary.group_id
                    }
                });
            }
        }

        $scope.checkoutReservation = function(reservation) {
            //  It navigates to the Guest Bill for the selected record.
        }

        $scope.navigateStayCard = function(reservation) {
            // Navigate to StayCard
            if (reservation.reservationStatusFlags.isGuestAttached) {
                $scope.$emit('showLoader');
                $scope.closeDialog();
                $timeout(function() {
                    $state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
                        "id": reservation.id,
                        "confirmationId": reservation.confirm_no,
                        "isrefresh": false
                    });
                }, 150)
            }
        }

        /**
         * Function to initialise room block details
         * @return - None
         */
        var initializeMe = function() {
            //updating the left side menu
            $scope.$emit("updateRoverLeftMenu", "menuCreateGroup");

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
            callInitialAPIs();

        }();
    }
]);