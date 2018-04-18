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

            $scope.reservationDetails = {
                'travelAgent': {}
            };
            $scope.guestCardData = {
                'contactInfo': {}
            };
            $scope.viewState = {
                'identifier': {}
            };
        });
        $controller('guestCardController', {
            $scope: $scope,
            _ngDialog_: ngDialog
        });
    });

    it('show warning popup on TA card removal', function() {
        spyOn(RVContactInfoSrv, 'checkIfCommisionWasRecalculated').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({
                'commission_info': {
                    'posted': true
                }
            });
            return deferred.promise;
        });
        spyOn(ngDialog, 'open').and.callThrough();
        $scope.reservationData = {
            'reservation_id': 123
        };
        $scope.detachTravelAgent();
        $scope.$apply();
        expect(ngDialog.open).toHaveBeenCalled();
    });
});