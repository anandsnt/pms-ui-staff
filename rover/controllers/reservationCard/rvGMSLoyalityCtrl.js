sntRover.controller('rvGMSLoyalityController', ['$scope', '$rootScope', '$filter', 'RVLoyaltyProgramSrv', 'ngDialog', '$sce', '$timeout',
    function($scope, $rootScope, $filter, RVLoyaltyProgramSrv, ngDialog, $sce, $timeout) {
        BaseCtrl.call(this, $scope);
        var credentials = {},
            content = {},
            guestInfo = {},
            MEMBERSHIP_CLASS,
            sendInitialMessage = function(event) {
                if (event.target.id === 'gms-iframe') {
                    $scope.iframe.contentWindow.postMessage({
                        'messageType': 'membership-lookup',
                        'credentials': credentials,
                        'content': content || {}
                    }, $scope.GMSiFrameSrc);
                }
                $scope.$emit('hideLoader');
            },
            handleGMSmessage = function(event) {
                // ensure the message sent is from GMS
                if ($scope.GMSiFrameSrc.includes(event.origin)) {
                    var message = event.data,
                        messageContent;

                    switch (message.messageType) {
                        case 'error':
                            messageContent = message.content;
                            logGMSError(message.timestamp || Date.now(), messageContent.code);
                            // iframe remains open so front desk agent knows there's an issue.
                            // will need to manually press close button that sends cancel message.
                            break;
                        case 'details':
                            messageContent = message.content;
                            addGMSLoyalty(messageContent);
                            $scope.closeGMSDialog();
                            break;
                        case 'cancel':
                            $scope.closeGMSDialog();
                            break;
                        default:
                            break;
                    }
                }
            },
            clearLoadEvents = function() {
                $scope.iframe.removeEventListener('load', sendInitialMessage);
                $scope.iframe.removeEventListener('error', loadingError);
            },
            logGMSError = function(time, code) {
                var errorMsg = 'GMS Error code:' + code ;

                $scope.errorMessage = errorMsg;
            },
            closeGMSiFrame = function () {
                clearLoadEvents();
                // remove message listener
                window.removeEventListener('message', handleGMSmessage);
                // $scope.iframe.src = '';
            },
            loadingError = function (event) {
                if (event.target.id === 'gms-iframe') {
                /*
                on the off chance GMS is down or unresponsive.
                log loading error.
                and inform front desk agent
                */
                    logGMSError(Date.now(), 'GMS-XXX', $scope.GMSiFrameSrc + ' failed to load ', event);
                    closeGMSiFrame();
                }
            },
            generateCredentailAndContent = function () {
                credentials = {
                    'username': $scope.ngDialogData.user_name,
                    'password': $scope.ngDialogData.password,
                    'buildingCode': $scope.ngDialogData.hotel_code,
                    'identifier': $rootScope.hotelDetails.current_user.email,
                    'lname': $scope.userInfo.last_name,
                    'fname': $scope.userInfo.first_name
                };
                content = {
                    'email': guestInfo.email,
                    'firstName': guestInfo.firstName,
                    'lastName': guestInfo.lastName
                };
            },
            addGMSLoyalty = function (message) {
                var params = {},
                    user_membership = {},
                    successCallbackaddLoyaltyProgram = function(data) {
                        user_membership.id = data.id;
                        $rootScope.$broadcast('loyaltyProgramAdded', user_membership, 'fromReservationCard');
                        $rootScope.$broadcast('updateEmailFromGMS', message.details.email);
                    },
                    errorCallbackaddLoyaltyProgram = function(errorMessage) {
                        $scope.$emit('hideLoader');
                        $scope.errorMessage = errorMessage;
                    };

                params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
                params.user_id = $scope.$parent.$parent.guestCardData.userId;
                user_membership.membership_type = message.progamCode;
                user_membership.membership_card_number = message.memberNumber;
                user_membership.membership_class = MEMBERSHIP_CLASS;
                params.user_membership = user_membership;

                $scope.invokeApi(RVLoyaltyProgramSrv.addLoyaltyProgram, params, successCallbackaddLoyaltyProgram, errorCallbackaddLoyaltyProgram);
            },
            init = function () {
                $scope.$emit('showLoader');
                $scope.trustSrc = $sce.trustAsResourceUrl;
                guestInfo = $scope.$parent.reservationParentData.guest;
                // Membership class for HLP is 2, Value hardcoded
                MEMBERSHIP_CLASS = 'HLP';
                generateCredentailAndContent();
                $scope.iframe = null;
                $timeout(function() {
                    $scope.iframe = document.getElementById('gms-iframe');
                    $scope.GMSiFrameSrc = $scope.ngDialogData.end_point;
                    if ($scope.iframe) {
                        $scope.iframe.addEventListener('load', sendInitialMessage, false);
                        $scope.iframe.addEventListener('error', loadingError, false);
                        window.addEventListener('message', handleGMSmessage, false);
                    }
                }, 3000);
            };
        
        $scope.closeGMSDialog = function () {
            closeGMSiFrame();
            $scope.closeDialog();
        };

        init();
    }]);
