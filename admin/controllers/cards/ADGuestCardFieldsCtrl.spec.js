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
            $scope.guestCardFields = {};
            $scope.guestCardFields.father_name = {is_visible: true};
            $scope.guestCardFields.mother_name = {is_visible: false};
            $scope.guestCardFields.birth_place = {is_visible: true};
            $scope.guestCardFields.gender = {is_visible: false};
            $scope.guestCardFields.registration_number = {is_visible: false};
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
    it('Clicked status toggle when father_name visibility is true', function() {

        $scope.clickedStatus('father_name');

        expect($scope.guestCardFields.father_name.is_visible).toBe(false);
    });
    // =======================
    it('Clicked status toggle when mother_name visibility is true', function() {

        $scope.clickedStatus('mother_name');

        expect($scope.guestCardFields.mother_name.is_visible).toBe(true);
    });
    // =======================
    it('Clicked status toggle when birth_place visibility is true', function() {

        $scope.clickedStatus('birth_place');

        expect($scope.guestCardFields.birth_place.is_visible).toBe(false);
    });
    // =======================
    it('Clicked status toggle when gender visibility is true', function() {

        $scope.clickedStatus('gender');

        expect($scope.guestCardFields.gender.is_visible).toBe(true);
    });

    // =======================
    it('Clicked status toggle when registration_number visibility is true', function() {

        $scope.clickedStatus('registration_number');

        expect($scope.guestCardFields.registration_number.is_visible).toBe(true);
    });
});
