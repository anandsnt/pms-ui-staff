describe('rvGuestIdScanCtrl', function() {

    var $controller,
        $scope,
        $q,
        RVGuestCardsSrv,
        ngDialog;

    beforeEach(function() {

        module('sntRover');

        inject(function(_$controller_, _RVGuestCardsSrv_, _$q_, _$rootScope_, _ngDialog_) {
            $controller = _$controller_;
            RVGuestCardsSrv = _RVGuestCardsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
            ngDialog = _ngDialog_;
        });

        $scope.guestIdData = {
            'front_image_data': '',
            'back_image_data': '',
            'signature': '',
            'guest_id': '',
            'last_name': '',
            'first_name': '',
            'date_of_birth': '',
            'nationality_id': '',
            'document_number': '',
            'expiration_date': '',
            'reservation_id': '',
            'document_type': 'PASSPORT',
            'is_primary_guest': true
        };

        $controller('rvGuestIdScanCtrl', {
            $scope: $scope
        });
    
        $scope.reservationData = {
            'reservation_card': {
                reservation_id: 122
            }
        };
    });

    it('On clicking upload front image button, trigger click on the hidden input field', function() {
        setFixtures("<input type='file' style='display: none;' id='front-image-upload' />");
        var spyEvent = spyOnEvent($('#front-image-upload'), 'click');

        $scope.uploadFrontImage();
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('On clicking upload back image button, trigger click on the hidden input field', function() {
        setFixtures("<input type='file' style='display: none;' id='back-image-upload' />");
        var spyEvent = spyOnEvent($('#back-image-upload'), 'click');
        
        $scope.uploadBackImage();
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('On clicking dob input field, open the calendar popup', function() {
        spyOn(ngDialog, 'open');
        $scope.openDobCalendar();
        expect(ngDialog.open).toHaveBeenCalled();
    });

    it('On clicking ID expiry input field, open the calendar popup', function() {
        spyOn(ngDialog, 'open');
        $scope.openExpiryCalendar();
        expect(ngDialog.open).toHaveBeenCalled();
    });

    it('On clicking close popup, close ngDialog', function() {
        spyOn(ngDialog, 'close');
        $scope.closeGuestIdModal();
        expect(ngDialog.close).toHaveBeenCalled();
    });

    it('On clicking save, call API to save and close dialiog', function() {
        spyOn(ngDialog, 'close');
        spyOn(RVGuestCardsSrv, 'saveGuestIdDetails').and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve({});
            return deferred.promise;
        });
        $scope.saveGuestIdDetails();
        $scope.$digest();
        expect(RVGuestCardsSrv.saveGuestIdDetails).toHaveBeenCalled();
        expect(ngDialog.close).toHaveBeenCalled();
    });

    describe('Delete image', function() {
        beforeEach(function() {
            spyOn(RVGuestCardsSrv, 'saveGuestIdDetails').and.callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
        });

        afterEach(function() {
            expect(RVGuestCardsSrv.saveGuestIdDetails).toHaveBeenCalled();
        });

        it('On clicking front image delete, call API to delete and unset the image', function() {
            $scope.guestIdData.front_image_data = '<front-image-data>';
            $scope.guestIdData.back_image_data = '<back-image-data>';
            $scope.saveGuestIdDetails('DELETE', 'front-image');
            $scope.$digest();
            expect($scope.guestIdData.front_image_data).toEqual('');
            expect($scope.guestIdData.back_image_data).toEqual('<back-image-data>');
        });


        it('On clicking back image delete, call API to delete and unset the image', function() {
            $scope.guestIdData.back_image_data = '<back-image-data>';
            $scope.guestIdData.front_image_data = '<front-image-data>';
            $scope.saveGuestIdDetails('DELETE', 'back-image');
            $scope.$digest();
            expect($scope.guestIdData.front_image_data).toEqual('<front-image-data>');
            expect($scope.guestIdData.back_image_data).toEqual('');
        });

    });
});