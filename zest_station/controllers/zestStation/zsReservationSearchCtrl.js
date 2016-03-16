sntZestStation.controller('zsReservationSearchCtrl', [
    '$scope',
    '$state',
    'zsModeConstants',
    'zsEventConstants',
    'zsTabletSrv','zsCheckoutSrv',
    '$stateParams', 'zsHotelDetailsSrv','$timeout',
    function($scope, $state, zsModeConstants, zsEventConstants, zsTabletSrv,zsCheckoutSrv, $stateParams, hotelDetailsSrv,$timeout) {

    BaseCtrl.call(this, $scope);

    $scope.reservationParams = {
        "last_name":"",
        "email":"",
        "room_no":""
    };
    $scope.input = {};

    /**
     * when the back button clicked
     * @param  {[type]} event
     * @return {[type]} 
     */
        
        var home = function(){$state.go ('zest_station.home');};
        
        
        $scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
                if ($scope.isInPickupKeyMode()){
                    $scope.pickupNavBack();
                } else {
                    if ($scope.headingText === 'NEXT_ROOM_NUMBER'){
                        $scope.inputType = 'text';
                        $scope.input.inputTextValue = "";
                        $scope.mode = "search-mode";
                        $scope.headingText = "TYPE_LAST";
                    } else {
                        home();
                    }
                }
        });
        $scope.pickupNavBack = function(){
            if ($scope.at === 'input-room'){
                $scope.backToLastNameInput();
            } else {
                home();
            }
        };
        $scope.backToLastNameInput = function(){
            if ($scope.pickupValues && $scope.pickupValues.last){
                $scope.input.inputTextValue = $scope.pickupValues.last;
                $scope.at = 'input-last';
                $scope.mode = "pickup-mode";
                $scope.headingText = "TYPE_LAST";
                $scope.inputType = 'text';
            }
        };

    /**
     * success Call Back Of Search Reservations
     * @return {[type]}
     */

    $scope.retry = false;
    var successCallBackOfSearchReservations = function(data) {
        $scope.reservations = data.results;
        if (typeof $scope.reservations === typeof undefined){
            if (data.errors && !$scope.retry){
                if (data.errors[0] === 'The Business Date has changed'){
                    //try a second attempt, for some reason the first one of new business date always fails, need to have it fixed in api
                        $scope.searchReservations(true);
                    return;
                }
                console.warn(data.errors);
            }
            $scope.initErrorScreen();
            return;
        }
        $scope.totalPages   = Math.ceil (data.total_count/$scope.PER_PAGE_RESULTS);
            if ($scope.reservations.length === 0){
                // $scope.showRoomEnter = $scope.isInCheckoutMode() ?  true : false;
                $scope.mode = 'no-match';
                $scope.at = 'no-match';
                
                if ($scope.isInCheckinMode()){
                    $state.go('zest_station.find_reservation_no_match');
                }
            } else if ($scope.reservations.length === 1 && !$scope.fetchingList){
                $scope.mode = "single-reservation";
                $scope.selectReservation($scope.reservations[0]);
            }
            else {
                $scope.mode = "reservations-list";
            }
    };

    /**
     * [isInCheckinMode description]
     * @return {Boolean} [description]
     */
    $scope.isInCheckinMode = function() {
        return ($state.mode === zsModeConstants.CHECKIN_MODE);
    };

    /**
     * [isInCheckinMode description]
     * @return {Boolean} [description]
     */
    $scope.isInCheckoutMode = function() {
        return ($state.mode === zsModeConstants.CHECKOUT_MODE);
    };

    /**
     * [isInCheckinMode description]
     * @return {Boolean} [description]
     */
    $scope.isInPickupKeyMode = function() {
        return ($state.mode === zsModeConstants.PICKUP_KEY_MODE);
    };

    var isItFontainebleauHotel = function(){
        return hotelDetailsSrv.data.theme === "fontainebleau";
    };

    var isInFinalSearchingScreen = function() {
        return $scope.mode === "search-final-mode";
    };

    $scope.shouldShowFloorChoosing = function(){
        return ($scope.isInCheckoutMode() && isItFontainebleauHotel() && isInFinalSearchingScreen());
    };

    /**
     * [searchReservations description]
     * @return {undefined}
     */
        
        $scope.getCheckInParams = function(){
            var params = {
                last_name           : $state.input.last,
                per_page            : $scope.PER_PAGE_RESULTS,
                page                : $scope.page
            };
            if ($state.lastAt === 'find-by-email'){
                params.email = $state.input.email;
            }
            if ($state.lastAt === 'find-by-no-of-nights'){
                params.no_of_nights = $state.input.NoOfNights;
            }
            if ($state.lastAt === 'find-by-date'){
                 params.departure_date  = $state.input.date;
            }
            if ($state.lastAt === 'find-by-confirmation'){
                 params.alt_confirmation_number = $state.input.confirmation;//alt_confirmation_number is to fetch both internal and external confirmation numbers
            }
            return params;
            
        };
        $scope.getCheckOutParams = function(){
           return {
                last_name           : $scope.reservationParams.last_name,
                room_no             : $scope.reservationParams.room_no,
                per_page            : $scope.PER_PAGE_RESULTS,
                page                : $scope.page
            };
        };
        
        
    $scope.searchReservations = function(retry) {
            if (retry){//workaround to fix 23288, until time for API to research further
                $scope.retry = true;
            } else {
                $scope.retry = false;
            }
            var params;
            if ($scope.isInCheckoutMode()){
                params = $scope.getCheckOutParams();
            } else if ($scope.isInCheckinMode()) {
                params = $scope.getCheckInParams();
            }
            
            //sets due_in or due_out
            params = $scope.setDueInOut(params);

            var options = {
                    params            : params,
                    successCallBack   : successCallBackOfSearchReservations,
                    failureCallBack:    successCallBackOfSearchReservations
            };
            $scope.callAPI(zsTabletSrv.fetchReservations, options);
    };

    $scope.isSearchMode = function(){
        if($scope.isInCheckoutMode()){
            return ($scope.mode === 'search-mode' || $scope.mode ==='search-final-mode');
        } else if ($scope.isInCheckinMode()){
                    return false;
                } else{
            return true;
        }
    };

    var checkoutVerificationSuccess = function(data){
        $scope.$emit("hideLoader");
        $scope.zestStationData.reservationData = data;
        $state.go('zest_station.review_bill');

    };
    var checkoutVerificationCallBack = function(){
        $scope.mode = "no-match";
        $scope.showRoomEnter = true;
    };
    
    $scope.changedTheSelectedTower = function(){
        $scope.input.inputTextValue = $scope.tower.selected;
    };

    $scope.setFontainebleauTowers = function(){
        if(isItFontainebleauHotel()) {
            _.each(hotelDetailsSrv.data.towers, function(value, key){
                $scope.towerList.push({
                    name: key,
                    value: value
                });
            });
            $scope.headingText = "CHOOSE_TOWER_AND_ENTER_ROOM_NUMBER";
            $scope.input.inputTextValue = $scope.towerList[0].value;
            $scope.selectedTower = $scope.towerList[0].value;
        }
    };
    
    /*
    *   There are two steps for checkout
    *   1.enter last name
    *   2.enter room number
    */
    $scope.goToNextForCheckout = function(){
        /*
         * 1) Enter Last name (saves to state.input.last)
         * 2) Enter Room number (saves to state.input.room)
         * 3) Re-Enter Last name (set from above)
         * 4) Re-Enter Room number (set from above)
         */
        if ($scope.mode === "search-mode" && !$scope.reEnteredNameInfo){
            ////enterLast (first time)
            $scope.reEnteredRoomInfo = false;
            
            $scope.saveEnteredLast();
            $scope.setEnterRoom();
            
        } else if ($scope.mode === "search-mode" && $scope.reEnteredNameInfo){
            //reEnterLast
            $scope.reEnteredNameInfo = false;
            
            $scope.saveEnteredLast();
            $scope.getReservations();
            
        } else if ($scope.mode === "search-final-mode" && !$scope.reEnteredRoomInfo){
            //enterRoom (first time)
            $scope.reEnteredNameInfo = false;
            
            $scope.saveEnteredRoom();
            $scope.getReservations();
            
        } else if ($scope.mode === "search-final-mode" && $scope.reEnteredRoomInfo){
            //reEnterRoom
            $scope.reEnteredRoomInfo = false;
            
            $scope.saveEnteredRoom();
            $scope.getReservations();
        }
    };
    $scope.getReservations = function(){
            var options = {
                params:             $scope.getReservationParams(),
                successCallBack:    checkoutVerificationSuccess,
                failureCallBack:    checkoutVerificationCallBack
            };
            $scope.fetchReservations(options);
    };
    $scope.saveEnteredLast = function(){
        $scope.reservationParams.last_name = angular.copy($scope.input.inputTextValue);
        $state.input.last                  = angular.copy($scope.input.inputTextValue);
    };
    
    $scope.saveEnteredRoom = function(){
        $scope.reservationParams.room_no = angular.copy($scope.input.inputTextValue);
        $state.input.room                = angular.copy($scope.input.inputTextValue);
    };
    
    $scope.setEnterRoom = function(){
        if ($state.last_at === 'review_bill'){
            $scope.reservationParams.last_name = $state.input.last;
            $state.last_at = '';
        }
        $scope.mode = "search-final-mode";
        $scope.input.inputTextValue = "";
        $scope.headingText = "NEXT_ROOM_NUMBER";
        $scope.inputType = 'text';
        $scope.setFontainebleauTowers();
    };
    $scope.getReservationParams = function(){
        var params = {
            "last_name":$scope.reservationParams.last_name,
            "room_no":$scope.reservationParams.room_no+''.replace(/\-/g, '')//adding '' to for non-str values
        };
        return params;
    };

    $scope.fetchReservations = function(options){
        //depending on the mode, will fetch reservations for check-out or pickup key
        $scope.callAPI(zsCheckoutSrv.findReservation, options);
    };

    $scope.onNextReEnterLast = function(){
        $scope.pickupValues.last = angular.copy($scope.input.inputTextValue);
        $state.input.last = angular.copy($scope.input.inputTextValue);
        $scope.pickupValues.room = $state.input.room;

        var options = $scope.getPickupKeyOptions();
        $scope.fetchReservations(options);
    };
    $scope.onNextReEnterRoom = function(){
        $scope.pickupValues.room = angular.copy($scope.input.inputTextValue);
        $state.input.room = angular.copy($scope.input.inputTextValue);
        $scope.pickupValues.last = $state.input.last;

        var options = $scope.getPickupKeyOptions();
        $scope.fetchReservations(options);
    };
    $scope.onPickupInputRoom = function(){
        $scope.pickupValues.room = $scope.input.inputTextValue;
        $state.input.room = $scope.input.inputTextValue;
        var options = $scope.getPickupKeyOptions();
        $scope.fetchReservations(options);
    };
    $scope.goToNext =  function(){
        if($scope.isInCheckoutMode()){//checkout
                $scope.goToNextForCheckout();

        } else if ($scope.isInPickupKeyMode() && $scope.at === 'input-last'){//pickup
                $scope.goToNextForPickup();

        } else if ($scope.isInPickupKeyMode() && $scope.at === 'input-room'){//pickup
            $scope.onPickupInputRoom();

        } else if ($scope.at === 're-input-last'){//check in
            $scope.onNextReEnterLast();

        } else if ($scope.at === 're-input-room'){//check in
            $scope.onNextReEnterRoom();

        }
    };
          
    $scope.initErrorScreen = function(){
            $scope.at = 'error';
            $scope.headingText = 'BROKE_HEADER';
            $scope.subHeadingText = 'BROKE_HEADER_SUB';
            $scope.modalBtn1 = 'DONE_BTN';
            $scope.$emit('hideLoader');
            $state.go('zest_station.error');
    };
    $scope.getPickupKeyOptions = function(){
        var pickupSuccess = function(response){
            $state.selectedReservation = response;
            $state.selectedReservation.printSuccess = false;
            $state.selectedReservation.keySuccess = false;
            $state.go('zest_station.pickup_keys');
        };
        var pickupFail = function(response){
            console.log(response);
            if (response){
                if (response[0] === 'Could not find the Reservation'){
                    $scope.pickupKeyNoMatch();
                    return;
                }
            }
                $scope.initErrorScreen();
        };
        var options = {
            params:             {"last_name":$scope.pickupValues.last,"room_no":$scope.pickupValues.room},
            successCallBack:    pickupSuccess,
            failureCallBack:    pickupFail
        };
        return options;
    };
    $scope.pickupKeyNoMatch = function(){
        $scope.mode = 'no-match';
        $scope.at = 'no-match';
        $scope.lastAt = 'pick-up-room';
        $state.lastAt = 'pick-up-room';
        $state.go('zest_station.find_reservation_no_match');
    };
    $scope.pickupValues = {
      'last':'',
      'room':''
    };
    
    $scope.reEnteredNameInfo = false;
    $scope.reEnteredRoomInfo = false;
    $scope.goToNextForPickup = function(){
        $scope.pickupValues.last = $scope.input.inputTextValue;
        $state.input.last = $scope.input.inputTextValue;
        $scope.at = 'input-room';
        $state.at = 'input-room';
        $scope.input.inputTextValue = "";
        $scope.headingText = "NEXT_ROOM_NUMBER";
        $scope.inputType = 'number';
    };
        
    $scope.reEnterLastName = function(name){
        $scope.inputType = 'text';
        $scope.reEnteredNameInfo = true;
        $scope.reEnteredRoomInfo = false;
        $scope.headingText = "TYPE_LAST";
        $state.last = 'input-last';
        $scope.mode = "search-mode";
        $scope.input.inputTextValue = name;
    };
    
    $scope.reEnterRoomNumber = function(room){
        $scope.inputType = 'text';
        $scope.reEnteredRoomInfo = true;
        $scope.reEnteredNameInfo = false;
        $scope.headingText = "NEXT_ROOM_NUMBER";
        $state.last = 'input-room';
        $scope.mode = "search-final-mode";
        $scope.input.inputTextValue = room;
        
    };

    $scope.talkToStaff = function(){
        $state.go('zest_station.speak_to_staff');
    };
        
    $scope.setDueInOut = function(params){
        if ($scope.isInCheckinMode()) {
                params.due_in = true;
        }

        else if ($scope.isInCheckoutMode()) {
                params.due_in = true; // need to change to due_out
        }

        else if ($scope.isInPickupKeyMode()) {
                params.due_in = true;
        }
        return params;
    };
    
    $scope.scanQRCode = function(){
        $scope.qrCodeScanFailed = false;
        var onFailure = function(){
             $scope.qrCodeScanFailed = true;
        };
        var onSuccess  = function(){

        };
        //this is just simulation
        //handling failure case only now.
        $scope.$emit('showLoader');
        $timeout(function() {
            $scope.$emit('hideLoader');
            onFailure();
        }, 2000);
    };

    /**
     * [fetchNextReservationList description]
     * @return {[type]} [description]
     */
    $scope.fetchingList = false;
    $scope.fetchNextReservationList = function() {
        $scope.fetchingList = true;
        if ($scope.page < $scope.totalPages) {
            $scope.page++;
        }
        $scope.searchReservations();
    };

    /**
     * [fetchPreviousReservationList description]
     * @return {[type]} [description]
     */
    $scope.fetchPreviousReservationList = function() {
        if ($scope.page > 1) {
            $scope.page--;
        }
        $scope.searchReservations();
    };

    /**
     * wanted to show search results
     * @return {Boolean}
     */
    $scope.shouldShowSearchResults = function() {
        return ($scope.reservations.length > 0);
    };


    $scope.selectReservation = function(r){
        //pass reservation as a state param
        $state.selectedReservation = r;
        if($scope.isInCheckoutMode()){
            // $state.go('zest_station.review_bill',{"res_id":r.id});
        }
        else{
            var primaryGuest = _.find(r.guest_details, function(guest_detail) {
                return guest_detail.is_primary === true
            });
            $scope.zestStationData.check_in_collect_nationality ? $state.go('zest_station.collect_nationality',{'guestId':primaryGuest.id}) : $state.go('zest_station.reservation_details');
        }

    };


    //non QR code actions
    var normalPickupKeyActions = function(){
                $scope.at = 'input-last';
                $scope.headingText = "TYPE_LAST";
                
                if ($state.lastAt === 're-enter-last'){
                    $scope.inputType = 'text';
                    $scope.headingText = "TYPE_LAST";
                    $scope.input.inputTextValue = $state.input.last;
                    $scope.at = 're-input-last';
                } else if ($state.lastAt === 're-enter-room'){
                    $scope.inputType = 'number';
                    $scope.headingText = "NEXT_ROOM_NUMBER";
                    $scope.input.inputTextValue = $state.input.room;
                    $scope.at = 're-input-room';
                }
    };

    $scope.quitQRScanMode = function(){
        normalPickupKeyActions();
    };

    $scope.initPuk = function(){

        $scope.mode = "pickup-mode";
        if ($scope.zestStationData.pickup_qr_scan || $scope.selectedLanguage === 'Italiano'){//using italian to debug qr code page
            $scope.setScreenIcon('key');
            $scope.at = 'input-qr-code';
            $scope.headingText = "QR_LOOKUP_HEADER";
            $scope.subHeadingText = "QR_LOOKUP_SUB_HEADER";
                
        } else {
            normalPickupKeyActions();
        };
    };
    $scope.initCheckout = function(){
        if ($state.lastAt === 'review_bill'){
               $scope.mode = "search-final-mode";
               $scope.reEnteredRoomInfo = true;
               $scope.input.inputTextValue = "";
               $scope.inputType = 'text';
               $scope.headingText = "NEXT_ROOM_NUMBER";
               $scope.setFontainebleauTowers();
            } else {
               $scope.mode = "search-mode";
               $scope.headingText = "TYPE_LAST";
               $scope.inputType = 'text';
            }
    };

    $scope.init = function(){
        $scope.inputType = 'text';

        if ($state.search){
            $scope.searchReservations();
            $state.search = false;
        }

        if ($scope.isInCheckoutMode()){
            $scope.initCheckout();
        }


        if ($scope.isInPickupKeyMode()){
            $scope.initPuk();
        }
    };
    /**
     * [initializeMe description]
     * @return {[type]} [description]
     */
    var initializeMe = function() {
        //show back button
        $scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

        //show close button
        $scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);

        $scope.reservations = [];

        $scope.towerList = [];
        $scope.tower = { selected : ""};

        //pagination
        $scope.page             = 1;
        $scope.totalPages       = 0;
        $scope.PER_PAGE_RESULTS = 3;
                $scope.init();
    }();
        
        

}]);
