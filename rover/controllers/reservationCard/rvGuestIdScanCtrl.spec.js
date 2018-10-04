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

        $controller('rvGuestIdScanCtrl', {
            $scope: $scope
        });
        $scope.guestIdData = {
            'first_name': 'Peter',
            'last_name': 'Pan',
            'front_image_data': 'XXXXXX',
            'back_image_data': 'xxxxxx',
            'signature': ''
        };
        $scope.reservationData = {
            'reservation_card': {
                reservation_id: 122
            }
        };
    });

    it('On clicking upload front image button, trigger click on the hidden input field', function() {
        setFixtures('<input type="file" style="display: none;" id="front-image-upload" />');
        var spyEvent = spyOnEvent($('#front-image-upload'), 'click');
        $scope.uploadFrontImage();
        expect(spyEvent).toHaveBeenTriggered();
    });

    it('On clicking upload back image button, trigger click on the hidden input field', function() {
        setFixtures('<input type="file" style="display: none;" id="back-image-upload" />');
        var spyEvent = spyOnEvent($('#back-image-upload'), 'click');
        $scope.uploadBackImage();
        expect(spyEvent).toHaveBeenTriggered();
    });


    it('On image change, call API to save image', function() {
        spyOn(RVGuestCardsSrv, 'uploadGuestId')
            .and
            .callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
        $scope.ImageChange();
        expect(RVGuestCardsSrv.uploadGuestId)
            .toHaveBeenCalled();
    });

    it('On delete image change, call API to delete image', function() {
        spyOn(RVGuestCardsSrv, 'deleteGuestId')
            .and
            .callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
        $scope.deleteImage('front-image');
        $scope.$digest();
        expect(RVGuestCardsSrv.deleteGuestId)
            .toHaveBeenCalled();
    });


    it('On clicking save on left panel, call API to save', function() {

        spyOn(RVGuestCardsSrv, 'saveGuestIdDetails')
            .and
            .callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({});
                return deferred.promise;
            });
        $scope.saveGuestIdDetails();
        expect(RVGuestCardsSrv.saveGuestIdDetails).toHaveBeenCalled();
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
        spyOn(ngDialog, "close");
        $scope.closeGuestIdModal();
        expect(ngDialog.close).toHaveBeenCalled();
    });

});