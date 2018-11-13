describe('guestCardController', function() {

    var $controller,
        $rootScope,
        $scope = {},
        $state,
        RVContactInfoSrv,
        $q,
        ngDialog;

    beforeEach(function() {
        module('sntRover');
        module('/assets/partials/cards/popups/detachCardsAPIWarningPopup.html');
        inject(function(_$controller_, _$rootScope_, _$state_, _RVContactInfoSrv_, _$q_, _ngDialog_) {

            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $state = _$state_;
            $scope = _$rootScope_.$new();
            RVContactInfoSrv = _RVContactInfoSrv_;
            $q = _$q_;
            ngDialog = _ngDialog_;

            angular.extend($scope, {
                'reservationDetails': {
                    'travelAgent': {}
                },
                'guestCardData': {
                    'contactInfo': {}
                },
                'viewState': {
                    'identifier': {}
                },
                'userInfo': {
                    'business_date': '2017-01-30'
                },
                'reservationData': {
                    'reservation_id': 123
                }
            });
        });

        $controller('guestCardController', {
            $scope: $scope,
            _ngDialog_: ngDialog
        });
    });

    var spyOnApiAndCallDetachTravelAgent = function() {
        spyOn(RVContactInfoSrv, 'checkIfCommisionWasRecalculated').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({
                'commission_info': {
                    'posted': true,
                    'is_paid_or_held': true
                }
            });
            return deferred.promise;
        });
        spyOn(ngDialog, 'open').and.callThrough();
        spyOn($scope, 'detachTACard').and.callThrough();

        $scope.detachTravelAgent();
        $scope.$digest();
    };

    it('When detaching a TA card, Do not allow TA card removal if the reservation is checked out and EOD has passed', function() {

        $scope.reservationData.departureDate = '2017-01-29';
        $scope.reservationData.status = "CHECKEDOUT";

        spyOnApiAndCallDetachTravelAgent();

        // Popup which says TA can't be removed
        expect(ngDialog.open).toHaveBeenCalled();
        // ensure detachTACard is not called
        expect($scope.detachTACard).not.toHaveBeenCalled();
    });

    it('When detaching a TA card, Allow TA card removal if the reservation is not checked out or EOD is not over', function() {

        $scope.reservationData.departureDate = '2017-01-30';
        $scope.reservationData.status = "CHECKEDIN";

        spyOnApiAndCallDetachTravelAgent();
        // ensure detachTACard is  called
        expect($scope.detachTACard).toHaveBeenCalled();
        // Popup to confirm TA removal
        expect(ngDialog.open).toHaveBeenCalled();
    });

});