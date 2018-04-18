describe('guestCardController', function() {

    var $controller,
        $rootScope,
        $scope = {},
        $state,
        RVContactInfoSrv,
        $q,
        ngDialog,
        ngDialogInstance = {
            open: jasmine.createSpy('ngDialogInstance.open'),
            dismiss: jasmine.createSpy('modalInstance.dismiss')
        };

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
            _ngDialog_: ngDialogInstance
        });
    });

    it('if the setting is manual, go to manual key pickup state', function() {
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
        expect(ngDialogInstance.open).toHaveBeenCalled();
        //$rootScope.$apply();
    });
});