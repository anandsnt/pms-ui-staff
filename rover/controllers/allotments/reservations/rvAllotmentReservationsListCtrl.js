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
  'rvGroupRoomingListSrv',
  function(
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
    $stateParams,
    rvGroupRoomingListSrv) {

    BaseCtrl.call(this, $scope);

    var currentMode;

    /**
     * util function to check whether a string is empty
     * we are assigning it as util's isEmpty function since it is using in html
     * @param {String/Object}
     * @return {boolean}
     */
    $scope.isEmpty = util.isEmpty;


    /**
     * function to stringify a string
     * sample use case:- directive higlight filter
     * sometimes through error parsing speial charactes
     * @param {String}
     * @return {String}
     */
    $scope.stringify = util.stringify;

    /**
     * Has Permission To Create allotment room block
     * @return {Boolean}
     */
    var hasPermissionToCreateRoomingList = function() {
      //TODO: Change key to allotment namespace, not added in API
      return (rvPermissionSrv.getPermissionValue('CREATE_ALLOTMENT_ROOMING_LIST'));
    };

    /**
     * Has Permission To Edit allotment room block
     * @return {Boolean}
     */
    var hasPermissionToEditRoomingList = function() {
      //TODO: Change key to allotment namespace, not added in API
      return (rvPermissionSrv.getPermissionValue('EDIT_ALLOTMENT_ROOMING_LIST'));
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
     * @param  {Date}
     * @return {String}
     */
    var getApiFormattedDate = function(date) {
      return ($filter('date')(new tzIndependentDate(date), $rootScope.dateFormatForAPI));
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
        $scope.reservationAddToDate = $scope.reservationAddFromDate;
      }

      runDigestCycle();

      //calling the api for populating the room type and max. possible held count
      $scope.fetchConfiguredRoomTypeDetails();
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
        $scope.reservationAddFromDate = $scope.reservationAddToDate;
      }

      runDigestCycle();

      //calling the api for populating the room type and max. possible held count
      $scope.fetchConfiguredRoomTypeDetails();
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

      var possibleDefaultDate = refData.block_from;

      //if we are in edit mode, we have to set the min/max date
      if (!$scope.isInAddMode()) {
        _.extend(commonDateOptions, {
          minDate: new tzIndependentDate($rootScope.businessDate),
          maxDate: new tzIndependentDate(refData.block_to)
        });
      }

      //date picker options - Reservation Add From
      $scope.reservationAddFromDateOptions = _.extend({
        onSelect: reservationAddFromDateChoosed
      }, commonDateOptions);

      //date picker options - Reservation to From
      $scope.reservationAddToDateOptions = _.extend({
        onSelect: reservationAddToDateChoosed,
        minDate: new tzIndependentDate(refData.block_from)
      }, commonDateOptions);

      //date picker options - Reservation Add From
      $scope.reservationSearchFromDateOptions = _.extend({
        minDate: '',
        onSelect: reservationSearchFromDateChoosed
      }, commonDateOptions);

      //date picker options - Reservation to From
      $scope.reservationSearchToDateOptions = _.extend({
        minDate: '',
        onSelect: reservationSearchToDateChoosed
      }, commonDateOptions);

      if (possibleDefaultDate < new tzIndependentDate($rootScope.businessDate)) {
        possibleDefaultDate = new tzIndependentDate($rootScope.businessDate);
      }

      //default from date, as per CICO-13900 it will be block_from date
      $scope.reservationAddFromDate = possibleDefaultDate;

      //default to date, as per CICO-13900 it will be block_to date
      $scope.reservationAddToDate = refData.block_to;

      $scope.reservationSearchFromDate = possibleDefaultDate;
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
      return !!$scope.allotmentConfigData.summary.is_cancelled;
    };

    /**
     * between default & add mode
     * @return {undefined}
     */
    $scope.toggleAddMode = function() {
      if (isReservationListInAddMode()) {
        setToDefaultMode();
        $scope.fetchReservations ();
      } else {
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
        $scope.fetchReservations ();
      } else {
        setToSearchMode();
      }
    };

    /**
     * to set to Add mode
     */
    var setToAddMode = function() {
      currentMode = 'ADD';
      $scope.searchQuery = '';
    };

    /**
     * to set to Search mode
     */
    var setToSearchMode = function() {
      $scope.searchQuery = '';
      currentMode = 'SEARCH';
    };

    /**
     * to set to default mode
     */
    var setToDefaultMode = function() {
      $scope.searchQuery = '';
      currentMode = 'DEFAULT';
    };

    /**
     * @return {Boolean}
     */
    var isReservationListInSearchMode = function() {
      return (currentMode === 'SEARCH');
    };

    /**
     * @return {Boolean}
     */
    var isReservationListInAddMode = function() {
      return (currentMode === 'ADD');
    };

    /**
     * will clear the query and will run for the new data
     */
    $scope.clearSearchQuery = function() {
      $scope.searchQuery = '';
      $scope.page = 1;
      $scope.fetchReservations (true); //true because  to indicate search mode
    };

    /**
     * [onBackgroundImageLoaded description]
     * @return {[type]} [description]
     */
    var onBackgroundImageLoaded = function() {
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
    };


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
        var $container  = $('#print-orientation'),
            bg          = $container.css('background-image'),
            src         = bg.replace(/(^url\()|(\)$|[\"\'])/g, ''),
            $img        = $('<img>').attr('src', src).on('load', onBackgroundImageLoaded);
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
        $scope.resevationsBeforePrint = util.deepCopy($scope.reservations);
        $scope.reservations = data.results;
        $scope.print_type = 'rooming_list';
        //if you are looking for where the HELL this list is printing
        //look for "NG_REPEAT_COMPLETED_RENDERING", thanks!!
    };

    /**
     * Function to fetch Rooming list for print.
     * @return - None
     */
    $scope.fetchReservationsForPrintingRoomingList = function() {
        var params = {
            id: $scope.allotmentConfigData.summary.allotment_id,
            per_page: 1000 //assuming that there will be max of 1000 res. for an allotment
        };
        var options = {
            params: params,
            successCallBack: successCallBackOfFetchAllReservationsForPrint
        };
        $scope.callAPI(rvAllotmentReservationsListSrv.fetchReservations, options);
    };

    /**
     * when a tab switch is there, parant controller will propogate
     * API, we will get this event, we are using this to fetch new room block deails
     */
    $scope.$on('ALLOTMENT_TAB_SWITCHED', function(event, activeTab) {
      if (activeTab !== 'RESERVATIONS') {
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
      currentMode = 'DEFAULT';

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
        editedReservationStart: '',
        editedReservationEnd: ''
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
     * utiltiy function for setting scroller and things
     * return - None
     */
    var refreshScrollers = function() {
      $scope.refreshScroller('rooming_list');
    };

    /**
     * to set the active left side menu
     * @return {undefined}
     */
    var setActiveLeftSideMenu = function() {
      var activeMenu = ($scope.isInAddMode()) ? 'menuCreateAllotment' : 'menuManageAllotment';
      $scope.$emit('updateRoverLeftMenu', activeMenu);
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
 * [successCallBackOfAddReservations description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
    var successCallBackOfAddReservations = function(data) {
      $scope.newReservations = [];
      _.each(data.results, function(reservation) {
        $scope.newReservations.push(reservation);
        $scope.reservations.unshift(reservation);
      });

      //total result count
      $scope.totalResultCount += (data.results.length);

      //pickup
      $scope.totalPickUpCount = data.total_picked_count;

      //we changed data, so
      refreshScrollers();

      //rooming data will change after adding some reservation
      $scope.fetchConfiguredRoomTypeDetails();
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

      if (!$scope.possibleNumberOfRooms.length) {
        $scope.errorMessage = ['No Rooms have been added for the selected Room in the Room Block.'];
        return;
      }

      //wiping the weepy
      $scope.errorMessage = '';

      //API params
      var params = {
        id            : $scope.allotmentConfigData.summary.allotment_id,
        room_type_id  : $scope.selectedRoomType,
        from_date     : $scope.reservationAddFromDate !== '' ? getApiFormattedDate($scope.reservationAddFromDate) : '',
        to_date       : $scope.reservationAddToDate !== '' ? getApiFormattedDate($scope.reservationAddToDate) : '',
        occupancy     : $scope.selectedOccupancy,
        no_of_reservations: $scope.numberOfRooms
      };

      //
      var options = {
        params: params,
        successCallBack: successCallBackOfAddReservations
      };
      $scope.callAPI(rvAllotmentReservationsListSrv.addReservations, options);

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

      var isValidSelectedRoomType = (typeof selectedRoomType !== 'undefined');

      //forming [1,2,3,4]
      $scope.possibleNumberOfRooms = isValidSelectedRoomType ? _.range(1, util.convertToInteger(selectedRoomType.total_rooms) + 1) : [];

      //we are unselecting the selected occupancy incase of invalid roomt type
      if (!isValidSelectedRoomType) {
        $scope.selectedOccupancy = '-1';
      }

      //changing the default selected number of rooms
      if (typeof $scope.numberOfRooms === 'undefined' && $scope.possibleNumberOfRooms.length > 0) {
        $scope.numberOfRooms = $scope.possibleNumberOfRooms[0];
      }

      if (_.max($scope.possibleNumberOfRooms) < $scope.numberOfRooms) {
        $scope.numberOfRooms = $scope.possibleNumberOfRooms[0];
      }
    };

    /**
     * @return {Obect}
     */
    var formParamsForConfiguredRoomTypeFetch = function() {
      return {
        id: $scope.allotmentConfigData.summary.allotment_id,
        from_date: getApiFormattedDate($scope.reservationAddFromDate),
        to_date: getApiFormattedDate($scope.reservationAddToDate)
      };
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

      var params = formParamsForConfiguredRoomTypeFetch();

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
          var new_room_type_ids = _.pluck(data.result, 'room_type_id'),
              existing_room_type_ids = _.pluck($scope.roomTypesAndData, 'room_type_id'),
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
      $scope.totalPickUpCount = data.total_picked_count;

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
    var formFetchReservationsParams = function(isSearching) {
      var params = {
        id      : $scope.allotmentConfigData.summary.allotment_id,
        payLoad : {
          per_page  : $scope.perPage,
          page      : $scope.page,
          sort_field: $scope.sorting_field,
          sort_dir  : $scope.sort_dir
        }
      };

      if (isSearching) {
        _.extend(params.payLoad,
        {
          start_date  : getApiFormattedDate($scope.reservationSearchFromDate),
          end_date    : getApiFormattedDate($scope.reservationSearchToDate),
          query       : $scope.searchQuery
        });
      }

      return params;
    };

    /**
     * to fetch reservations against group
     * @return - None
     */
    $scope.fetchReservations = function(isSearching) {
      var params = formFetchReservationsParams(isSearching);
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
        template        : '/assets/partials/groups/rooming/popups/general/rvGroupRoomingNoRoomTypeAttachedPopUp.html',
        className       : '',
        scope           : $scope,
        closeByDocument : false,
        closeByEscape   : false
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

      //roomtypes fetch
      var paramsForRoomingDetails = formParamsForConfiguredRoomTypeFetch();
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
     * Function to handle input of search queries from the reservation list tab
     * @return {[type]} [description]
     */
    $scope.searchAllotmentReservations = function() {

      switch ($scope.searchQuery.length) {
        case 0:
          console.log('reset');
          break;
        case 1:
        case 2:
          console.log('do nothing');
          break;
        default:
          $scope.fetchReservations(true);
      }
    };

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
      $scope.fetchReservations(isReservationListInSearchMode());
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
      $scope.fetchReservations(isReservationListInSearchMode());
    };

    /**
     * Pagination things
     * @return {undefined}
     */
    var initialisePagination = function() {
      //pagination
      $scope.perPage = rvAllotmentReservationsListSrv.DEFAULT_PER_PAGE;
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
        var index = _.indexOf(_.pluck($scope.selected_reservations, 'id'), reservation.id);
        $scope.selected_reservations.splice(index, 1);
      } else {
        $scope.selected_reservations.push(reservation);
      }
    };

    /**
     * function to get reservation class against reservation status
     * @param {Object} reservation
     * @return {String} [class name]
     */
    $scope.getReservationClass = function(reservation) {
      var class_ = '', rStatus = reservation.status.toUpperCase(),
        isOptedLateCheckout = reservation.is_opted_late_checkout,
        isPreCheckin = reservation.is_pre_checkin;

      switch (rStatus) {
        case 'RESERVED':
          class_ = 'arrival';
          break;

        case 'CHECKING_IN':
          class_ = 'check-in';
          break;

        case 'CHECKEDIN':
          class_ = 'inhouse';
          break;

        case 'CHECKING_OUT':
          class_ = 'check-out';
          if (isOptedLateCheckout) {
            class_ = 'late-check-out';
          }
          break;

        case 'CHECKEDOUT':
          class_ = 'departed';
          break;

        case 'CANCELED':
          class_ = 'cancel';
          break;

        case 'NOSHOW':
        case 'NOSHOW_CURRENT':
          class_ = 'no-show';
          break;

        default:
          class_ = '';
          break;
      }

      if (isPreCheckin) {
        class_ = 'pre-check-in';
      }

      return class_;
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
     * to get the room status css class
     * @param {Object} - reservation
     * @return {String} - css class
     */
    $scope.getRoomStatusClass = function(res) {
      var mappedStatus = '';

      //Please note: St - Status

      if (res.room_service_status) {
        if (res.room_service_status === 'OUT_OF_SERVICE' ||
            res.room_service_status === 'OUT_OF_ORDER') {
          return 'room-grey';
        }
      }

      if (res.reservation_status !== 'CHECKING_IN') {
        return mappedStatus;
      }

      if (res.room_ready_status === '') {
        return mappedStatus;
      }

      if (res.fostatus !== 'VACANT') {
        mappedStatus += ' room-red';
        return mappedStatus;
      }

      switch (res.room_ready_status) {
        case 'INSPECTED':
          mappedStatus += ' room-green';
          break;
        case 'CLEAN':
          mappedStatus += (res.checkin_inspected_only === 'true') ? ' room-orange' : ' room-green';
          break;
        case 'PICKUP':
          mappedStatus += ' room-orange';
          break;
        case 'DIRTY':
          mappedStatus += ' room-red';
          break;
      }
      return mappedStatus;
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
      return (typeof isReservaionInSelectedReservation !== 'undefined');
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
    $scope.toggleAllSelection = function() {
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

    /*local scope for reservation edit popup showing
(function() {
    var selectedReservation;
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
    var failedToFetchOfAllReqdForReservationEdit = function(errorMessage) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
    };
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
    $scope.clickedOnReservation = function (reservation) {
        selectedReservation = reservation;
        callNeccessaryApiForReservationDetailsShowing (reservation);
    };
}());
*/

    (function() {
      var selectedReservation;

      var showEditReservationPopup = function(reservationData) {
        ngDialog.open({
              template: '/assets/partials/allotments/reservations/popups/editReservation/rvAllotmentEditRoomingListItem.html',
              className: '',
              scope: $scope,
              closeByDocument: false,
              closeByEscape: false,
              controller: 'rvAllotmentReservationEditCtrl',
              data: JSON.stringify(reservationData)
            });
      };

      var onSuccessGetFreeRooms = function(data) {
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

      var onFailureGetFreeRooms = function(argument) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = errorMessage;
      };

      $scope.onClickReservation = function(reservation) {
        selectedReservation = reservation;
        $scope.callAPI(rvGroupRoomingListSrv.getFreeAvailableRooms, {
          params: {
            reserevation_id: reservation.id,
            num_of_rooms_to_fetch: 5,
            room_type_id: reservation.room_type_id
          },
          successCallBack: onSuccessGetFreeRooms,
          failureCallBack: onFailureGetFreeRooms
        });
      };
    }());

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
      setScroller();

      //we have a list of scope varibales which we wanted to initialize
      initializeVariables();

      //pagination
      initialisePagination();

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
