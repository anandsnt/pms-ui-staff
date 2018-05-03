/*

There are different ways to invoke guest web. 

User can send mail from hotel admin or use direct URL for checkin and checkout. 

But the options available for different hotels are different. 
So make sure the hotel admin settings for checkin and checkout are turned on or off w.r.t . 
You can see all the available options for a hotel in the router file for the corresponding hotel. 
If because of some settings, if user tries to go to a state not listed in the app router (eg:app_router_yotel.js)
for the hotel ,the user will be redirected to no options page.

The initial condtions to determine the status of reseravations are extracted from the URL(calling API based on params in URL).

*/


var sntGuestWeb = angular.module('sntGuestWeb', ['ui.router', 'ui.bootstrap', 'pickaDate', 'ngSanitize']);

sntGuestWeb.controller('RootController', ['$scope', '$rootScope', '$state', '$controller', function($scope, $rootScope, $state, $controller) {

    $controller('BaseController', {
        $scope: $scope
    });
    $scope.$emit('showLoader');
    $state.go('guestwebRoot');

    // in order to prevent url change or fresh url entering with states
    var routeChange = function(event) {
        event.preventDefault();
        return;
    };

    $rootScope.$on('$locationChangeStart', routeChange);

    // function to handle exception when state is not found
    $scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        event.preventDefault();
        $state.go('noOptionAvailable');
    });

}]);

sntGuestWeb.controller('HomeController', ['$scope', '$rootScope', '$state', '$controller', 'zestwebData', 'screenMappings', 'GwWebSrv', 'GwCheckinSrv',
    function($scope, $rootScope, $state, $controller, zestwebData, screenMappings, GwWebSrv, GwCheckinSrv) {

        $controller('BaseController', {
            $scope: $scope
        });
        var reservationAndhotelDetails = zestwebData;
        // There will be a keyword for each screen which has to be mapped with screen id
        // this is fetched and saved in service for future usage

        GwWebSrv.setScreenList(screenMappings);
        // save the data for future usage
        GwWebSrv.setzestwebData(zestwebData);
        // override styles if styles are set in hotel admin
        !!reservationAndhotelDetails.zest_web ? overrideStylesWithCMSdata(reservationAndhotelDetails.zest_web) : '';
        // check if demo mode is set, if so all APIS will be called using sample JSON
        GwWebSrv.zestwebData.isInZestwebDemoMode = !!reservationAndhotelDetails.zest_web ? reservationAndhotelDetails.zest_web.is_zestweb_demo_mode_on : false;
        
        // /to delete afterwards
        // GwWebSrv.zestwebData.isInZestwebDemoMode = true;

        // set static items
        $rootScope.hotelLogo = reservationAndhotelDetails.hotel_logo;
        $rootScope.currencySymbol = reservationAndhotelDetails.currency_symbol;
        $rootScope.hotelPhone = reservationAndhotelDetails.hotel_phone;
        // to start displaying contents in the page
        $rootScope.uiViewDOMloaded = true;
        $scope.$emit('hideLoader');
        // conditional page navigations
        if (reservationAndhotelDetails.is_external_verification === "true") {
            $state.go('externalCheckoutVerification'); // external checkout URL
        }
        else if (reservationAndhotelDetails.checkin_url_verification === "true" && reservationAndhotelDetails.is_zest_checkin === "false") {
            $state.go('externalCheckInTurnedOff'); // external checkin URL off
        }
        else if (reservationAndhotelDetails.checkin_url_verification === "true" &&  reservationAndhotelDetails.is_zest_checkin === "true") {
            $state.go('externalCheckinVerification'); // external checkin URL
        }
        else if (GwWebSrv.zestwebData.isCheckedin) {
            $state.go('alreadyCheckedIn');// already checkedin
        }
        else if (GwWebSrv.zestwebData.isCheckedout) {
            $state.go('alreadyCheckedOut');// already checked out
        }
        else if (reservationAndhotelDetails.is_checkin === "false" && reservationAndhotelDetails.access_token.length > 0) {
            $state.go('checkoutRoomVerification');
        } else if (reservationAndhotelDetails.is_checkin === "true" && reservationAndhotelDetails.access_token.length > 0) {
            var absUrl = window.location.href;

            if (absUrl.indexOf("/guest_web/") !== -1 && absUrl.indexOf("/checkin?guest_web_token=") !== -1 &&
                reservationAndhotelDetails.skip_checkin_verification && reservationAndhotelDetails.reservation_details) {
                GwCheckinSrv.setcheckinData(reservationAndhotelDetails.reservation_details);
                GwWebSrv.zestwebData.termsAndConditions = reservationAndhotelDetails.reservation_details.terms_and_conditions;
                GwWebSrv.zestwebData.roomUpgraded = false;
                $state.go('checkinReservationDetails');
                var node = document.createElement('style');

                node.innerHTML = ".container {margin-top: 30px !important;} .row.header-bar {display: none;} #zest-footer{ display: none !important;}";
                document.head.appendChild(node);
            } else {
                $state.go('checkinLanding'); // checkin starting -> page precheckin + auto checkin
            }

        }

        var handleDemoMode =  function () {
            if (GwWebSrv.zestwebData.isInZestwebDemoMode) {
                // reload the App... cant used dummy data for actual process
                alert("Leaving demo mode!. We can't continue using dummy data to proceed. The App will be refreshed.");
                location.reload();
            } else {
                GwWebSrv.zestwebData.isInZestwebDemoMode = true;
            }
        };

        document.addEventListener("keydown", function(event) {
            if (event.altKey) {
                switch (event.keyCode) {
                    // ALT + e --> Turn on edit mode
                    case 69:
                        break;
                    // ALT + d --> Toggle demo mode
                    case 68:
                        handleDemoMode();
                        break;
                    default:
                        return;
                }
            } else {
                return;
            }
        });
    }
]);