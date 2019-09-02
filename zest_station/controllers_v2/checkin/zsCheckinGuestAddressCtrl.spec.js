describe('zsCheckinGuestAddressCtrl', function() {

    var $state,
        $scope,
        $rootScope,
        zsCheckinSrv,
        $controller,
        zsEventConstants,
        $q;

    beforeEach(function () {
        module('sntZestStation', function ($provide) {
            $provide.value('guestAddress', {
                'postal_code': '20813',
                'state': 'MD',
                'city': '',
                'street': 'Bethesda',
                'street2': '',
                'country_id': '1'
            });
            $provide.value('countryList', [{
                id: 1
            }]);
        });

        inject(function(_$controller_, _$rootScope_, _$state_, _$q_, _zsCheckinSrv_, _zsEventConstants_) {
            $q = _$q_;
            $controller = _$controller_;
            $rootScope = _$rootScope_.$new();
            $state = _$state_;
            $scope = $rootScope.$new();
            zsCheckinSrv = _zsCheckinSrv_;
            zsEventConstants = _zsEventConstants_;
        });
        $controller('zsCheckinGuestAddressCtrl', {
            $scope: $scope
        });
        $scope.focusInputField = function () {
            return false;
        };
        zsCheckinSrv.setCheckInReservations([{
            id: 123
        }]);
    });

    it('On entering guest address collection with address on file, screen mode has to select address option', function () {
        expect($scope.mode)
            .toEqual('SELECT_ADDRESS');
    });

    it('On entering guest address collection, the warning popup is to be hidden', function () {
        expect($scope.showErrorMessage)
            .toEqual(false);
    });

    it('On selecting address on file, go to reservation details page', function () {
        spyOn($state, 'go');
        $scope.usePresentAddress();
        expect($state.go)
            .toHaveBeenCalledWith('zest_station.checkInReservationDetails', jasmine.any(Object));
    });

    it('On selecting new address, screen mode has to NEW_ADDRESS and address1 has to be focused', function () {
        spyOn($scope, 'focusInputField');
        $scope.useNewAddress();
        expect($scope.mode)
            .toEqual('NEW_ADDRESS');
        expect($scope.focusInputField)
            .toHaveBeenCalledWith('address-1');
    });

    it('On next button click, if the address is not valid or empty, show the warning popup', function () {
        $scope.guestDetails = {
            'postal_code': '',
            'state': '',
            'city': '',
            'street': '',
            'street2': '',
            'country_id': ''
        };
        $scope.nextButtonClicked();
        expect($scope.showErrorMessage)
            .toEqual(true);
    });

    it('On clicking OK on warning popup, hide popup', function () {
        $scope.dismissPopup();
        expect($scope.showErrorMessage)
            .toEqual(false);
    });

    describe('On proceeding with a valid Address', function () {
        beforeEach(function () {
            $scope.guestDetails = {
                'postal_code': '20813',
                'state': 'MD',
                'city': '',
                'street': 'Bethesda',
                'street2': '',
                'country_id': '1'
            };
            spyOn(zsCheckinSrv, 'saveGuestAddress')
                .and
                .callFake(function () {
                    var deferred = $q.defer();

                    deferred.resolve({});
                    return deferred.promise;
                });
            spyOn($state, 'go');
        });
        it('On clicking next with valid address, call API to save address', function () {
            $scope.nextButtonClicked();
            expect(zsCheckinSrv.saveGuestAddress)
                .toHaveBeenCalled();
        });
        it('On clicking next with valid address,call API to save address and on success  go to reservation details page', function () {
            $scope.nextButtonClicked();
            $scope.$digest();
            expect($state.go)
                .toHaveBeenCalledWith('zest_station.checkInReservationDetails', jasmine.any(Object));
        });
    });

    describe('Back button actions', function() {

        it('If current Mode is New Address and guest has a valid existing address, got to select Address screen', function() {
            $scope.mode = "NEW_ADDRESS";
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
            expect($scope.mode).toEqual('SELECT_ADDRESS');
        });

        it('On navigating back for a single reservation search, go to select reservation search screen', function() {
            spyOn($state, 'go');
            zsCheckinSrv.setCheckInReservations([{
                id: 123
            }]);
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
            expect($state.go).toHaveBeenCalledWith('zest_station.checkInReservationSearch');
        });

        it('On navigating back for multiple reservation search, go to select reservation page', function() {
            spyOn($state, 'go');
            zsCheckinSrv.setCheckInReservations([{
                id: 123
            }, {
                id: 124
            }]);
            $scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
            expect($state.go).toHaveBeenCalledWith('zest_station.selectReservationForCheckIn');
        });

    });
});
