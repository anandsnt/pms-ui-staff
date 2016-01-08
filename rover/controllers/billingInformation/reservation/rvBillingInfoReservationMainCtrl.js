sntRover.controller('rvBillingInfoReservationMainCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	
    BaseCtrl.call(this, $scope);

    $scope.selectedEntity = {};
	$scope.results = {};
    $scope.bills = [];
    $scope.routes = [];
    $scope.routeDates = {};
    $scope.errorMessage = '';

    $scope.billingInfoFlags = {
        isInAddRoutesMode   : false,
        isInitialPage       : true,
        isEntitySelected    : false,
        shouldShowWaiting   : false,
        isReloadNeeded      : false
    };

    $scope.saveData = {
        payment_type             : "",
        payment_type_description : "",
        newPaymentFormVisible    : false
    };

	$scope.$on('UPDATE_SHOULD_SHOW_WAITING', function (event, value){
		$scope.billingInfoFlags.shouldShowWaiting = value;
	});

	$scope.closeDialog = function () {
		ngDialog.close();
        $scope.$emit('routingPopupDismissed');
	};

	$scope.dimissLoaderAndDialog = function (){
		$scope.$emit('hideLoader');
		$scope.closeDialog();
	};

    /**
    * Function to get label for all routes and add routes button
    * @return {String} the button label
    */
	$scope.getHeaderButtonLabel = function () {
		return $scope.billingInfoFlags.isInitialPage?
               $filter('translate')('ADD_ROUTES_LABEL'):
               $filter('translate')('ALL_ROUTES_LABEL');
	};

    /**
    * Function to set the reload option
    * @param {Boolean} - true/false
    * @return {undefined}
    */
    $scope.setReloadOption = function (option) {
        $scope.billingInfoFlags.isReloadNeeded = option;
    };

    /**
    * Function to check whether the routing for a group/house already exist
    * @return {Boolean} []
    */
    var isRoutingForPostingAccountExist = function () {
        var routeToPostingAccountExist = false;
        var routesList = dclone($scope.routes,[]);

        for (var i = 0; i < routesList.length; i++) {
            if (routesList[i].entity_type === "GROUP" || 
                routesList[i].entity_type === "HOUSE" || 
                routesList[i].entity_type === "ALLOTMENT" ) {

                routeToPostingAccountExist = true;
                return routeToPostingAccountExist;
            }
        }
        return routeToPostingAccountExist;
    };

    /**
    * Function to handle the click 'all routes' and 'add routes' button
    * @return {undefined}
    */
	$scope.headerButtonClicked = function () {
        $scope.billingInfoFlags.isInAddRoutesMode = true;
        $scope.billingInfoFlags.isEntitySelected  = false;
		$scope.billingInfoFlags.isInitialPage     = !$scope.billingInfoFlags.isInitialPage;
        //setDefaultRoutingDates();
        //setRoutingDateOptions();

        if ($scope.billingInfoFlags.isInitialPage  && $scope.billingInfoFlags.isReloadNeeded) {
            $scope.billingInfoFlags.isReloadNeeded = false;
            $scope.fetchRoutes();
        }

        // While moved to initial screen
        if ($scope.billingInfoFlags.isInitialPage) {
            init();
        }
	};

    /**
    * Function to handle the pencil button click in route detail screen
    * @return {undefined}
    */
    $scope.deSelectEntity = function() {
        $scope.billingInfoFlags.isEntitySelected = false;
    };

    /**
    * Function to set selected entity
    * @param {Object} [selected entity details]
    * @return {undefined}
    */
    $scope.setSelectedEntity = function(entityDetails) {
        $scope.selectedEntity = entityDetails;
    }

    /**
    * Function used in template to map the reservation status to the view expected format
    * @param {String} [reservation status]
    * @param {Boolean}
    * @return {String} [class according to reservation status]
    */
    $scope.getGuestStatusMapped = function (reservationStatus, isLateCheckoutOn) {
        var viewStatus = "";
        if (isLateCheckoutOn && "CHECKING_OUT" === reservationStatus) {
            viewStatus = "late-check-out";
            return viewStatus;
        }

        if ("RESERVED" === reservationStatus) {
            viewStatus = "arrival";
        } 
        else if ("CHECKING_IN" === reservationStatus) {
            viewStatus = "check-in";
        } 
        else if ("CHECKEDIN" === reservationStatus) {
            viewStatus = "inhouse";
        } 
        else if ("CHECKEDOUT" === reservationStatus) {
            viewStatus = "departed";
        } 
        else if ("CHECKING_OUT" === reservationStatus) {
            viewStatus = "check-out";
        } 
        else if ("CANCELED" === reservationStatus) {
            viewStatus = "cancel";
        } 
        else if (("NOSHOW" === reservationStatus) || ("NOSHOW_CURRENT" === reservationStatus)) {
            viewStatus = "no-show";
        }
        return viewStatus;
    };

    /**
    * Function to get the class for the 'li' according to the entity role
    * @param {Ohject} selected route
    * @return {String} class of 'li'
    */
	$scope.getEntityRole = function (route) {
    	if (route.entity_type === 'RESERVATION' &&  !route.has_accompanying_guests) {
    		return 'guest';
        }
    	else if (route.entity_type === 'RESERVATION') {
    		return 'accompany';
        }
    	else if (route.entity_type === 'TRAVEL_AGENT') {
    		return 'travel-agent';
        }
    	else if (route.entity_type === 'COMPANY_CARD') {
    		return 'company';
        }
    };

    /**
    * Function to get the class for the 'icon' according to the entity role
    * @param {Ohject} selected route
    * @return {String} class of 'icon'
    */
    $scope.getEntityIconClass = function (route) {
        if (route.entity_type === 'RESERVATION' &&  route.has_accompanying_guests) {
            return 'accompany';
        }
    	else if (route.entity_type === 'RESERVATION' || route.entity_type === 'COMPANY_CARD') {
            return '';
        }
    	else if (route.entity_type === 'TRAVEL_AGENT') {
    		return 'icons icon-travel-agent';
        }
    };

    $scope.escapeNull = function (value, replaceWith) {
		return escapeNull(value, replaceWith);
    };

    /**
    * Function to fetch the attached entity list
    * @return {undefined}
    */
    $scope.fetchRoutes = function () {

        var successCallback = function (data) {
             $scope.routes = data;
             $scope.fetchEntities();
        };

        var errorCallback = function (errorMessage) {
            $scope.fetchEntities();
            $scope.errorMessage = errorMessage;

        };

        $scope.invokeApi(RVBillinginfoSrv.fetchRoutes, $scope.reservationData.reservation_id, successCallback, errorCallback);
    };

    /**
    * Function to set the default routing dates for a new route.
    * @return {undefined}
    */
    $scope.setDefaultRoutingDates = function () {
        $scope.routeDates.from = $rootScope.businessDate > $scope.reservation.reservation_card.arrival_date? 
                                 $rootScope.businessDate : $scope.reservation.reservation_card.arrival_date;
        $scope.routeDates.to   = $scope.reservation.reservation_card.departure_date;
    };

    /**
    * Function to set the date range for from and to date fields
    * @return {undefined}
    */
    $scope.setRoutingDateOptions = function () {
        $scope.routingDateFromOptions = {       
            dateFormat : 'dd-mm-yy',
            minDate    : tzIndependentDate($scope.reservation.reservation_card.arrival_date),
            maxDate    : tzIndependentDate($scope.reservation.reservation_card.departure_date)
        };

        $scope.routingDateToOptions = {       
            dateFormat : 'dd-mm-yy',
            minDate    : tzIndependentDate($scope.reservation.reservation_card.arrival_date),
            maxDate    : tzIndependentDate($scope.reservation.reservation_card.departure_date)
        };
    };

    /**
    * Function to fetch the attached cards list
    * @return {undefined}
    */
    $scope.fetchEntities = function () {

        var successCallback = function (data) {
            $scope.attachedEntities = data;
             $scope.$parent.$emit('hideLoader');
        };

        var errorCallback = function (errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        $scope.invokeApi(RVBillinginfoSrv.fetchAttachedCards, $scope.reservationData.reservation_id, successCallback, errorCallback);
    };

    /**
    * Function to save the new route
    * @return {undefined}
    */
    $scope.saveRoute = function () {
        $rootScope.$broadcast('routeSaveClicked');
    };

    /**
    * Listener to show error messages for child views
    */
    $scope.$on("displayErrorMessage", function(event, error) {
        $scope.errorMessage = error;
    });

	$scope.handleCloseDialog = function () {
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();

        if (!!$scope.billingData) {// NOTE: CICO-17123 When the billing information popup is called from the Group Summary Tab, there wont be a billingData object in $scope. This was throwing "TypeError: Cannot set property 'billingInfoTitle' of undefined"
            $scope.billingData.billingInfoTitle = ($scope.routes.length > 0 )? 
                                                  $filter('translate')('BILLING_INFO_TITLE'):
                                                  $filter('translate')('ADD_BILLING_INFO_TITLE');
        }
	};

    var init = function () {
        /*if ($scope.attachedEntities === undefined) {*/
            $scope.billingInfoFlags.isInitialPage = true;
            $scope.fetchRoutes();
            $scope.attachedEntities = [];
        /*}
        else {
            $scope.isInitialPage = true;
            $scope.fetchRoutes();
            $scope.attachedEntities = [];
        }*/
    };

    init();

}]);
