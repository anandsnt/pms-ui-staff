sntZestStation.controller('zsEmailCollectionDirCtrl', ['$scope', 'zsUtilitySrv', 'zsGeneralSrv', '$timeout',
    function($scope, zsUtilitySrv, zsGeneralSrv, $timeout) {

        BaseCtrl.call(this, $scope);

        $scope.reEnterText = function() {
            $scope.mode = 'EMAIL_ENTRY_MODE';
            zsUtilitySrv.focusInputField('email-entry');
        };

        var checkIfEmailIsBlacklisted = function(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure) {
            var blacklistCheckOptions = {
                params: {
                    'email': $scope.email
                },
                successCallBack: function(data) {
                    // onSuccess, 
                    if (!data.black_listed_email) {
                        afterBlackListValidation();

                    } else {
                        console.warn('email is black listed, request different email address');
                        onBlackListedEmailFound();
                    }
                },
                failureCallBack: onValidationAPIFailure
            };

            $scope.callAPI(zsGeneralSrv.emailIsBlackListed, blacklistCheckOptions);
        };

        var setInvalidEmailMode = function() {
            $scope.mode = 'EMAIL_INVLAID_MODE';
        };

        var goToNextScreenInFlow = function() {
            $scope.$emit('GO_TO_NEXT_SCREEN');
        };

        var updateGuestEmail = function() {
            var updateComplete = function() {
                goToNextScreenInFlow();
            };

            var updateGuestEmailFailed = function(response) {
                console.warn('updateGuestEmailFailed: ', response); // if this fails would help give clues as to why
                var stateParams = {
                    'message': 'Email Updation Failed.'
                };

                $state.go('zest_station.speakToStaff', stateParams);
            };

            var afterBlackListValidation = function() {
                var options = {
                    params: {
                        'guest_id': $scope.guestId,
                        'email': $scope.email
                    },
                    successCallBack: updateComplete,
                    failureCallBack: updateGuestEmailFailed
                };

                $scope.callAPI(zsGeneralSrv.updateGuestEmail, options);
            };
            var onBlackListedEmailFound = function() {
                setInvalidEmailMode();
            };
            var onValidationAPIFailure = function() {
                updateGuestEmailFailed();
            };

            checkIfEmailIsBlacklisted(afterBlackListValidation, onBlackListedEmailFound, onValidationAPIFailure);
        };


        $scope.goToNext = function() {
            var isValidEmail = $scope.email.length > 0 ? zsUtilitySrv.isValidEmail($scope.email) : false;

            if (isValidEmail) {
                updateGuestEmail();
            } else {
                setInvalidEmailMode();
                zsUtilitySrv.focusInputField();
            }
        };

        $scope.skipEmail = function() {
            goToNextScreenInFlow()
        };

        (function() {
            $scope.email = $scope.email || '';
            $scope.mode = 'EMAIL_ENTRY_MODE';
            zsUtilitySrv.focusInputField('email-entry');
        }());

    }
]);