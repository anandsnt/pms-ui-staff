sntRover.controller('rvBillingInfoReservationMainCtrl',['$scope','$rootScope','$filter','RVBillinginfoSrv', 'ngDialog', function($scope, $rootScope,$filter, RVBillinginfoSrv, ngDialog){
	
    BaseCtrl.call(this, $scope);

    $scope.selectedEntity = {};
	$scope.results = {};
    $scope.bills = [];
    $scope.routes = [];
    $scope.errorMessage = '';

    $scope.billingInfoFlags = {
        isInAddRoutesMode     : false,
        isInitialPage         : true,
        isEntitySelected      : false,
        shouldShowWaiting     : false,
        isReloadNeeded        : false,
        selectedEntityChanged : false
    };

    /*$scope.isInAddRoutesMode = false;
    $scope.;
    $scope.isEntitySelected = false;
    $scope.shouldShowWaiting = false;
    $scope.isReloadNeeded = false;
    $scope.selectedEntityChanged = false;*/

    $scope.saveData = {
        payment_type             : "",
        payment_type_description : "",
        newPaymentFormVisible    : false
    };

    /*$scope.saveData.payment_type =  "";
    $scope.saveData.payment_type_description =  "";
    $scope.saveData.newPaymentFormVisible = false;*/

	$scope.$on('UPDATE_SHOULD_SHOW_WAITING', function(e, value) {
		$scope.billingInfoFlags.shouldShowWaiting = value;
	});

	$scope.closeDialog = function () {
		ngDialog.close();
        $scope.$emit('routingPopupDismissed');
	};

	$scope.dimissLoaderAndDialog = function () {
		$scope.$emit('hideLoader');
		$scope.closeDialog();
	};

    /**
    * Function to get label for all routes and add routes button
    * @return {String}
    */
	$scope.getHeaderButtonLabel = function () {
		return $scope.billingInfoFlags.isInitialPage?
               $filter('translate')('ADD_ROUTES_LABEL'):
               $filter('translate')('ALL_ROUTES_LABEL');
	};

    /**
    * Function to set the reload option
    * @param {Boolean}
    * @return {undefined}
    */
    $scope.setReloadOption = function (option) {
        $scope.billingInfoFlags.isReloadNeeded = option;
    };

    /**
    * Function to check whether the routing for a group/house already exist
    * @return {Boolean}
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
        $scope.billingInfoFlags.isEntitySelected = false;
		$scope.billingInfoFlags.isInitialPage = !$scope.billingInfoFlags.isInitialPage;
        setDefaultRoutingDates();
        setRoutingDateOptions();

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
    $scope.deSelectEntity = function () {
        $scope.billingInfoFlags.isEntitySelected = false;
    };

    /**
    * Function to handle entity selection from the 'All Routes' screen and the 'select entity' screen
    * @param {Number} index of selected entity
    * @param {Number} type of selected entity
    * @return {undefined}
    */
	$scope.selectEntity = function (index,type) {

        if ($scope.routes && $scope.routes[index] && $scope.routes[index].from_date) {
            $scope.arrivalDate = $scope.routes[index].from_date;
            $scope.departureDate = $scope.routes[index].to_date;
        }
        setRoutingDateOptions();

        $scope.errorMessage = "";
		$scope.billingInfoFlags.isEntitySelected = true;
        $scope.billingInfoFlags.isInAddRoutesMode = false;
        $scope.billingInfoFlags.isInitialPage = false;
        $scope.billingInfoFlags.selectedEntityChanged = true;

        if (type === 'ATTACHED_ENTITY' || type === 'ROUTES') {
        	$scope.selectedEntity = $scope.routes[index];
            $scope.selectedEntity.is_new = (type === 'ATTACHED_ENTITY')? true: false;

            if ($scope.selectedEntity.entity_type !=='RESERVATION') {
                $scope.selectedEntity.guest_id = null;
            }

            if ($scope.selectedEntity.entity_type === "GROUP" || $scope.selectedEntity.entity_type === "HOUSE" || $scope.selectedEntity.entity_type === "ALLOTMENT") {

            }
            else {
                $scope.selectedEntity.images[0].guest_image = $scope.selectedEntity.images[0].image;
            }
        }
        else if (type === 'RESERVATIONS') {
        	var data = $scope.results.reservations[index];
        	$scope.selectedEntity = {
			    "attached_charge_codes": [],
			    "attached_billing_groups": [],
                "images": data.images,
                "reservation_status" : data.reservation_status,
                "is_opted_late_checkout" : data.is_opted_late_checkout,
                "name": data.firstname + " " + data.lastname,
                "entity_type": "RESERVATION",
                "has_accompanying_guests" : ( data.images.length >1 ) ? true : false,
                "bill_no": "",
                "is_new" : true,
                "credit_card_details": {},
                "id": data.id
			};
        }
        else if (type === 'ACCOUNT') {
        	var data = $scope.results.accounts[index];
        	$scope.selectedEntity = {
			    "id": data.id,
			    "name": data.account_name,
			    "bill_no": "",
			    "images": [{
                    "is_primary":true,
		            "guest_image": data.company_logo
		        }],
			    "attached_charge_codes": [],
			    "attached_billing_groups": [],
                "is_new" : true,
                "selected_payment" : "",
                "credit_card_details": {}
			};

    		if (data.account_type === 'COMPANY') {
    			$scope.selectedEntity.entity_type = 'COMPANY_CARD';
    		}
            else if (data.account_type === 'TRAVELAGENT') {
                $scope.selectedEntity.entity_type = 'TRAVEL_AGENT';
            }
        }
        else if (type === 'GROUP' || type === 'HOUSE') {
            if (isRoutingForPostingAccountExist()) {
                $scope.errorMessage = ["Routing to account already exists for this reservation. Please edit or remove existing routing to add new."];
                $scope.billingInfoFlags.isEntitySelected = false;
                $scope.billingInfoFlags.isInitialPage = true;
            }
            else {
                var data = $scope.results.posting_accounts[index];
                $scope.selectedEntity = {
                    "id": data.id,
                    "name": data.account_name,
                    "bill_no": "",
                    "attached_charge_codes": [],
                    "attached_billing_groups": [],
                    "is_new" : true,
                    "selected_payment" : "",
                    "credit_card_details": {},
                    "entity_type": data.account_type
                };
            }
        }
	};

    /**
    * Function to select the attached entity
    * @param {Number} index of entity
    * @param {Number} type of entity
    * @return {undefined}
    */
    $scope.selectAttachedEntity = function (index,type) {
        $scope.errorMessage = "";
        $scope.billingInfoFlags.isEntitySelected = true;
        $scope.billingInfoFlags.isInitialPage = false;

        //TODO: Remove commented out code
        $scope.selectedEntity = {
            "bill_no": "",
            "has_accompanying_guests" : false,
            "attached_charge_codes": [],
            "attached_billing_groups": [],
            "is_new" : true,
            "credit_card_details": {}
        };

        $scope.selectedEntity.reservation_status = $scope.reservationData.reservation_status;
        $scope.selectedEntity.is_opted_late_checkout = $scope.reservationData.is_opted_late_checkout;

        if (type === 'GUEST') {
            $scope.selectedEntity.id = $scope.reservationData.reservation_id;
            $scope.selectedEntity.guest_id = $scope.attachedEntities.primary_guest_details.id;
            $scope.selectedEntity.name = $scope.attachedEntities.primary_guest_details.name;

            $scope.selectedEntity.images = [{
                "is_primary":true,
                "guest_image": $scope.attachedEntities.primary_guest_details.avatar
            }];
            $scope.selectedEntity.entity_type = "RESERVATION";
        } 
        else if(type === 'ACCOMPANY_GUEST') {
            $scope.selectedEntity.id = $scope.reservationData.reservation_id;
            $scope.selectedEntity.guest_id = $scope.attachedEntities.accompanying_guest_details[index].id;
            $scope.selectedEntity.name = $scope.attachedEntities.accompanying_guest_details[index].name;

            $scope.selectedEntity.images = [{
                "is_primary":false,
                "guest_image": $scope.attachedEntities.accompanying_guest_details[index].avatar
            }];

            $scope.selectedEntity.has_accompanying_guests = true;
            $scope.selectedEntity.entity_type = "RESERVATION";
        }
        else if (type === 'COMPANY_CARD') {
            $scope.selectedEntity.id = $scope.attachedEntities.company_card.id;
            $scope.selectedEntity.name = $scope.attachedEntities.company_card.name;

            $scope.selectedEntity.images = [{
                "is_primary":true,
                "guest_image": $scope.attachedEntities.company_card.logo
            }];
            $scope.selectedEntity.entity_type = "COMPANY_CARD";
        }
        else if (type === 'TRAVEL_AGENT') {
            $scope.selectedEntity.id = $scope.attachedEntities.travel_agent.id;
            $scope.selectedEntity.name = $scope.attachedEntities.travel_agent.name;

            $scope.selectedEntity.images = [{
                "is_primary":true,
                "guest_image": $scope.attachedEntities.travel_agent.logo
            }];
            $scope.selectedEntity.entity_type = "TRAVEL_AGENT";
        }
        else if (type ==='GROUP' || type === 'HOUSE') {
            if (isRoutingForPostingAccountExist()) {
                $scope.errorMessage = ["Routing to account already exists for this reservation. Please edit or remove existing routing to add new."];
                $scope.billingInfoFlags.isEntitySelected = false;
                $scope.billingInfoFlags.isInitialPage = true;
            }
            else {
                $scope.selectedEntity.id = $scope.attachedEntities.posting_account.id;
                $scope.selectedEntity.name = $scope.attachedEntities.posting_account.name;
                $scope.selectedEntity.entity_type = type;
            }
        }
    };

    /**
    * Function used in template to map the reservation status to the view expected format
    * @param {String} reservation status
    * @param {Boolean}
    * @return {String}
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
    var setDefaultRoutingDates = function () {
        if (!!$scope.reservation) {
            $scope.arrivalDate   = $scope.reservation.reservation_card.arrival_date,
            $scope.departureDate = $scope.reservation.reservation_card.departure_date;
            $scope.arrivalDate   = $rootScope.businessDate > $scope.arrivalDate? 
                                   $rootScope.businessDate : $scope.arrivalDate;
        }
    };

    /**
    * Function to set the min date and max date for date range field
    * @return {undefined}
    */
    var setRoutingDateOptions = function () {
        $scope.routeDates = {
            from : $scope.arrivalDate,
            to : $scope.departureDate
        };

        $scope.routingDateFromOptions = {       
            dateFormat: 'dd-mm-yy',
            minDate : tzIndependentDate($scope.reservation.reservation_card.arrival_date),
            maxDate : tzIndependentDate($scope.reservation.reservation_card.departure_date)
        };

        $scope.routingDateToOptions = {       
            dateFormat: 'dd-mm-yy',
            minDate : tzIndependentDate($scope.reservation.reservation_card.arrival_date),
            maxDate : tzIndependentDate($scope.reservation.reservation_card.departure_date)
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
