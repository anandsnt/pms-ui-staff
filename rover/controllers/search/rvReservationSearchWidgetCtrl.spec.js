describe('rvReservationSearchWidgetController', function () {
    var $controller,
        $scope,
        RVSearchSrv,
        $q,
        rvReservationSearchWidgetController,
        $rootScope,
        rvPermissionSrv;

    describe('Bulk checkout functionality', function () {
        beforeEach(function () {
            module('sntRover');
            inject(function (_$controller_, _$rootScope_, _RVSearchSrv_, _$q_, _ngDialog_, _rvPermissionSrv_) {
                $controller = _$controller_;
                $scope = _$rootScope_.$new();
                RVSearchSrv = _RVSearchSrv_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                rvPermissionSrv = _rvPermissionSrv_;
            });

            rvReservationSearchWidgetController = $controller('rvReservationSearchWidgetController', {
                $scope: $scope
            });
        });

        it('should show the bulk checkout in progress popup, when one bulk checkout process is already in progress', function () {
            spyOn(RVSearchSrv, 'processBulkCheckout').and.callFake(function () {
                var deferred = $q.defer();

                deferred.resolve({
                    "is_bulk_checkout_in_progress": true
                });
                return deferred.promise;
            });

            spyOn(rvReservationSearchWidgetController, 'showBulkCheckoutStatusPopup').and.callFake(function () {
                expect(arguments[0].isFailure).toEqual(true);
            });

            $scope.performBulkCheckout();
            $rootScope.$apply();
        });

        it('should show bulk checkout process initiated popup when the process is initiated', function () {
            spyOn(RVSearchSrv, 'processBulkCheckout').and.callFake(function () {
                var deferred = $q.defer();

                deferred.resolve({
                    "is_bulk_checkout_in_progress": false
                });
                return deferred.promise;
            });

            spyOn(rvReservationSearchWidgetController, 'showBulkCheckoutStatusPopup').and.callFake(function () {
                expect(arguments[0].isSuccess).toEqual(true);
            });

            $scope.performBulkCheckout();
            $rootScope.$apply();
        });

        it('should disable the bulk checkout option for overlay properties', function () {
            $rootScope.isStandAlone = false;

            expect($scope.shouldDisableBulkCheckoutOption()).toEqual(true);
        });

        it('should disable the bulk checkout option for hourly properties', function () {
            $rootScope.isHourlyRateOn = true;

            expect($scope.shouldDisableBulkCheckoutOption()).toEqual(true);
        });

        it('should disable the bulk checkout option for hourly properties', function () {
            $rootScope.isInfrasecEnabled = true;

            expect($scope.shouldDisableBulkCheckoutOption()).toEqual(true);
        });

        it('should disable the bulk checkout option when there is no checkout permission', function () {
            $rootScope.isStandAlone = true;
            $rootScope.isHourlyRateOn = false;
            $rootScope.isInfrasecEnabled = false;

            spyOn(rvPermissionSrv, 'getPermissionValue').and.callFake(function () {
                return false;
            });
            expect($scope.shouldDisableBulkCheckoutOption()).toEqual(true);
        });
        it('should show the bulk checkout option for standalone nightly hotels with checkout permission and no infrasec enabled', function () {
            $rootScope.isStandAlone = true;
            $rootScope.isHourlyRateOn = false;
            $rootScope.isInfrasecEnabled = false;
            
            spyOn(rvPermissionSrv, 'getPermissionValue').and.callFake(function () {
                return true;
            });
            expect($scope.shouldDisableBulkCheckoutOption()).toEqual(false);
        });

    });

});