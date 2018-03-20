sntRover.controller('rvGMSLoyalityController', ['$scope', '$rootScope', '$filter', 'RVLoyaltyProgramSrv', 'ngDialog', '$sce', '$timeout',
    function($scope, $rootScope, $filter, RVLoyaltyProgramSrv, ngDialog, $sce, $timeout) {
        BaseCtrl.call(this, $scope);
        var credentials = {
                'username': 'zdirect_real.pmsTest',
                'password': 'Secret123!',
                'buildingCode': 'STAYTEST',
                'identifier': 'SNT_AGENT_USERNAME'
            },
            content = {
                'profileId': 'SNT_PROFILE_ID',
                'email': 'test@example.com',
                'salutation': 'Mr.',
                'firstName': 'Testy',
                'lastName': 'McTesterton',
                'middleInitial': 'T',
                'suffix': 'Esq.',
                'address': '123 Fake St.',
                'address2': 'Suite 404',
                'city': 'TownsVille',
                'state': 'ON',
                'zip': 'H0H 0H0',
                'country': 'CA',
                'home': '555-456-7890',
                'office': '',
                'cell': '555-567-1234',
                'fax': '',
                'company': 'Example Company Inc.',
                'title': 'Account Tester',
                'birthday': '2000-01-01',
                'langcode': 'en'
            },
            sendInitialMessage = function(event) {
                if (event.target.id === 'gms-iframe') {
                    clearLoadEvents();
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
                            clearLoadEvents();
                            closeGMSiFrame();
                            $scope.closeDialog();
                            break;
                        case 'cancel':
                            closeGMSiFrame();
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
                console.log('error message');
                var errorMsg = 'Error code:' + code + '\nMessage:' + msg + '\nDetails:' + JSON.stringify(details);

                console.log(errorMsg);
            },
            closeGMSiFrame = function () {
                clearLoadEvents();
                // remove message listener
                window.removeEventListener('message', handleGMSmessage);
                $scope.iframe.src = null;
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
            init = function () {
                console.log($scope);
                $scope.$emit('showLoader');
                $scope.trustSrc = $sce.trustAsResourceUrl;
                $scope.GMSiFrameSrc = 'https://gm-d1.travelclick.com/gms/app/external/snt';
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

        init();
    }]);
