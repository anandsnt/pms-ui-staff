sntRover.controller('rvAddLoyaltyProgramController', ['$scope', '$rootScope', '$filter', 'RVLoyaltyProgramSrv', 'ngDialog', function($scope, $rootScope, $filter, RVLoyaltyProgramSrv, ngDialog) {
    BaseCtrl.call(this, $scope);

    $scope.availableFFPS = [];
    $scope.availableHLPS = [];
    $scope.loyaltyPrograms = [{name: 'Frequent Flyer Program',
        code: 'FFP'}, {name: 'Hotel Loyalty Program',
            code: 'HLP'}];
    $scope.selectedLoyaltyProgram = '';
    $scope.selectedLoyaltyType = '';
    $scope.selectedLevel = '';
    $scope.loyaltyCode = '';

    $scope.dimissLoaderAndDialog = function () {
        $scope.$emit('hideLoader');
        $scope.closeDialog();
    };

    $scope.addLoyaltyProgram = function () {
        var params = {};

        params.reservation_id = $scope.$parent.reservationData.reservation_card.reservation_id;
        params.user_id = $scope.$parent.$parent.guestCardData.userId;
        params.user_membership = {};
        params.user_membership.membership_type = $scope.selectedLoyaltyType;
        params.user_membership.membership_card_number = $scope.loyaltyCode;
        params.user_membership.membership_class = $scope.selectedLoyaltyProgram;
        params.user_membership.membership_level = $scope.selectedLevel;
        $scope.newLoyalty = params.user_membership;
        var successCallbackaddLoyaltyProgram = function(response) {
                $scope.newLoyalty.id = response.data.id;
                $scope.dimissLoaderAndDialog();
                $rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty, 'fromReservationCard');
            },
            loyaltyAddFailureCallback = function(errorMessage) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            },
            options = {
                params: params,
                successCallBack: successCallbackaddLoyaltyProgram,
                failureCallBack: loyaltyAddFailureCallback
            };

        $scope.callAPI(RVLoyaltyProgramSrv.addLoyaltyProgram, options);
    };

    $scope.setupLoyaltyPrograms = function () {
        if ($scope.$parent.reservationData) {
            var use_ffp = $scope.$parent.reservationData.use_ffp,
                use_hlp = $scope.$parent.reservationData.use_hlp;

            if (use_ffp === true && use_hlp === false) {
                $scope.loyaltyPrograms = [{name: 'Frequent Flyer Program',
                    code: 'FFP'}];
            } else if (use_ffp === false && use_hlp === true) {
                $scope.loyaltyPrograms = [{name: 'Hotel Loyalty Program',
                    code: 'HLP'}];
            } else if (use_ffp === true && use_hlp === true) {
                $scope.loyaltyPrograms = [{name: 'Frequent Flyer Program',
                    code: 'FFP'}, {name: 'Hotel Loyalty Program',
                        code: 'HLP'}];
            } else if (use_ffp === false && use_hlp === false) {
                $scope.loyaltyPrograms = [];
            }
        }
        // now setup ffps and hlps
        $scope.getFFPS();
        $scope.getHLPS();
    };

    $scope.getFFPS = function () {
        var successCallbackGetFFPS = function (data) {
            $scope.setAvailableFFPS(data);
            $scope.$emit('hideLoader');
        };
        var errorCallbackGetFFPS = function (errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        $scope.invokeApi(RVLoyaltyProgramSrv.getAvailableFFPS, '', successCallbackGetFFPS, errorCallbackGetFFPS);
    };

    $scope.getHLPS = function () {
        var successCallbackGetHLPS = function (data) {
            $scope.setAvailableHLPS(data);
            $scope.$emit('hideLoader');
        };
        var errorCallbackGetHLPS = function (errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        $scope.invokeApi(RVLoyaltyProgramSrv.getAvailableHLPS, '', successCallbackGetHLPS, errorCallbackGetHLPS);
    };

    $scope.setAvailableFFPS = function (FFPArray) {
        var loyaltyType;

        for (var i = 0; i < FFPArray.length; i++) {
            loyaltyType = {};
            loyaltyType.name = FFPArray[i].ff_description;
            loyaltyType.code = FFPArray[i].ff_value;
            loyaltyType.levels = FFPArray[i].levels;
            $scope.availableFFPS.push(loyaltyType);
        }
    };

    $scope.setAvailableHLPS = function (HLPArray) {
        var loyaltyType;

        for (var i = 0; i < HLPArray.length; i++) {
            loyaltyType = {};
            loyaltyType.name = HLPArray[i].hl_description;
            loyaltyType.code = HLPArray[i].hl_value;
            loyaltyType.levels = HLPArray[i].levels;
            $scope.availableHLPS.push(loyaltyType);
        }
    };

    $scope.getLoyaltyTypes = function () {
        if ($scope.selectedLoyaltyProgram) {
            if ($scope.selectedLoyaltyProgram === 'HLP') {
                return $scope.availableHLPS;
            }
            else if ($scope.selectedLoyaltyProgram === 'FFP') {
                return $scope.availableFFPS;
            }
            return [];
        }
    };

    $scope.getLoyaltyLevels = function() {
        if ($scope.$parent.reservationData) {
            var use_ffp = $scope.$parent.reservationData.use_ffp,
                use_hlp = $scope.$parent.reservationData.use_hlp;

            if (use_ffp === true && use_hlp === false) {
                if ($scope.selectedLoyaltyProgram === $scope.loyaltyPrograms[0].code) {
                    return $scope.getLoyaltyLevelsfromCode();
                }
            } else if (use_ffp === false && use_hlp === true) {
                if ($scope.selectedLoyaltyProgram === $scope.loyaltyPrograms[0].code) {
                    return $scope.getLoyaltyLevelsfromCode();
                }
            } else if (use_ffp === true && use_hlp === true) {
                if ($scope.selectedLoyaltyProgram === $scope.loyaltyPrograms[1].code) {
                    return $scope.getLoyaltyLevelsfromCode();
                } 
                return $scope.getLoyaltyLevelsfromCode();
                    
            } else if (use_ffp === false && use_hlp === false) {
                $scope.loyaltyPrograms = [];
            }
        }

    };

    $scope.getLoyaltyLevelsfromCode = function() {
        var loyaltytypes, levels = [];

        if ($scope.selectedLoyaltyProgram) {
            if ($scope.selectedLoyaltyProgram === 'HLP') {
                loyaltytypes = $scope.availableHLPS;
            } else if ($scope.selectedLoyaltyProgram === 'FFP') {
                loyaltytypes = $scope.availableFFPS;
            }
            for (var i = 0; i < loyaltytypes.length; i++) {
                if ($scope.selectedLoyaltyType === loyaltytypes[i].code) {
                    levels = loyaltytypes[i].levels;
                    break;
                }
            }
        }
        return levels;
    };

    // CICO-21206
    $scope.setupLoyaltyPrograms();
}]);
