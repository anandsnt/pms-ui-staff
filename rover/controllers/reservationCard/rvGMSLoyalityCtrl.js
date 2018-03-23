sntRover.controller('rvGMSLoyalityController', ['$scope', '$rootScope', '$filter', 'RVLoyaltyProgramSrv', 'ngDialog', '$sce', '$timeout',
    function($scope, $rootScope, $filter, RVLoyaltyProgramSrv, ngDialog, $sce, $timeout) {
        BaseCtrl.call(this, $scope);
        var credentials = {},
            content = {},
            guestInfo = {},
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

                    console.log(message);
                    switch (message.messageType) {
                        case 'error':
                            messageContent = message.content;
                            var str = JSON.stringify(message, undefined, 4);

                            logGMSError(message.timestamp || Date.now(), messageContent.code,
                        messageContent.message, messageContent.details);
                        // iframe remains open so front desk agent knows there's an issue.
                        // will need to manually press close button that sends cancel message.
                            break;
                        case 'details':
                            messageContent = message.content;
                            if (messageContent) {
                                var str = JSON.stringify(message, undefined, 4);
                            }
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
            logGMSError = function(time, code, msg, details) {
                var errorMsg = 'Error code:' + code + '\nMessage:' + msg + '\nDetails:' + JSON.stringify(details);
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
                    'buildingCode': 'STAYTEST',
                    'identifier': 'SNT_AGENT_USERNAME'
                };
                content = {
                    // 'profileId': 'SNT_PROFILE_ID',
                    'email': guestInfo.email,
                    // 'salutation': 'Mr.',
                    'firstName': guestInfo.firstName,
                    'lastName': guestInfo.lastName
                    // 'middleInitial': 'T',
                    // 'suffix': 'Esq.',
                    // 'address': '123 Fake St.',
                    // 'address2': 'Suite 404',
                    // 'city': 'TownsVille',
                    // 'state': 'ON',
                    // 'zip': 'H0H 0H0',
                    // 'country': 'CA',
                    // 'home': '555-456-7890',
                    // 'office': '',
                    // 'cell': '555-567-1234',
                    // 'fax': '',
                    // 'company': 'Example Company Inc.',
                    // 'title': 'Account Tester',
                    // 'birthday': '2000-01-01',
                    // 'langcode': 'en'
                };
            },
            addGMSLoyalty = function (message) {
                var params = {},
                    successCallbackaddLoyaltyProgram = function(data) {
                        $scope.newLoyalty.id = data.id;
                        $rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty, 'fromReservationCard');
                    },
                    errorCallbackaddLoyaltyProgram = function(errorMessage) {
                        $scope.$emit('hideLoader');
                        $scope.errorMessage = errorMessage;
                    };

                params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
                params.user_id = $scope.$parent.$parent.guestCardData.userId;
                params.user_membership = {};
                params.user_membership.membership_type = message.details.progamCode;
                params.user_membership.membership_card_number = message.memberNumber;
                //params.user_membership.membership_class = $scope.selectedLoyaltyProgram;
                //params.user_membership.membership_level = $scope.selectedLevel;
                $scope.invokeApi(RVLoyaltyProgramSrv.addLoyaltyProgram, params, successCallbackaddLoyaltyProgram, errorCallbackaddLoyaltyProgram);
            },
            init = function () {
                $scope.$emit('showLoader');
                $scope.trustSrc = $sce.trustAsResourceUrl;
                $scope.GMSiFrameSrc = $scope.ngDialogData.end_point;
                guestInfo = $scope.$parent.reservationParentData.guest;
                generateCredentailAndContent();
                $scope.iframe = null;
                var iframetimer = $timeout(function() {
                    $scope.iframe = document.getElementById('gms-iframe');
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
