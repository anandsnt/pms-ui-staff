describe('ADGuestCardFieldsCtrl', function() {

    var $controller,
        $scope = {},
        ADGuestCardSrv,
        $q,
        $rootScope;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADGuestCardSrv_, _$q_) {
            $controller = _$controller_;
            ADGuestCardSrv = _ADGuestCardSrv_;
            $q = _$q_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $scope.guestCardFields = {"is_father_name_visible": true,"is_mother_name_visible": false,"is_birth_place_visible": true,"is_gender_visible": false, "is_registration_number_visible": false};
        });

        $controller('ADGuestCardFieldsCtrl', {
            $scope: $scope,
            $rootScope: $rootScope
        });

    });

    // =======================
    it('Save visibility fields', function() {

        spyOn(ADGuestCardSrv, "saveGuestCardFields").and.callFake(function() {
            var deferred = $q.defer();

            deferred.resolve();
            return deferred.promise;
        });       

        $scope.saveGuestCardFields();

        expect(ADGuestCardSrv.saveGuestCardFields).toHaveBeenCalled();

    });
    // =======================
    it('Clicked status toggle when is_father_name_visible visibility is true', function() {

        $scope.clickedStatus('is_father_name_visible');

        expect($scope.guestCardFields.is_father_name_visible).toBe(false);
    });
    // =======================
    it('Clicked status toggle when is_father_name_visible visibility is true', function() {

        $scope.clickedStatus('is_mother_name_visible');

        expect($scope.guestCardFields.is_mother_name_visible).toBe(true);
    });
    // =======================
    it('Clicked status toggle when is_birth_place_visible visibility is true', function() {

        $scope.clickedStatus('is_birth_place_visible');

        expect($scope.guestCardFields.is_birth_place_visible).toBe(false);
    });
    // =======================
    it('Clicked status toggle when is_gender_visible visibility is true', function() {

        $scope.clickedStatus('is_gender_visible');

        expect($scope.guestCardFields.is_gender_visible).toBe(true);
    });

    // =======================
    it('Clicked status toggle when is_registration_number_visible visibility is true', function() {

        $scope.clickedStatus('is_registration_number_visible');

        expect($scope.guestCardFields.is_registration_number_visible).toBe(true);
    });
});
