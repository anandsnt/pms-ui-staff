describe('rvGroupConfigurationSummaryTab', function () {
    var $controller,
        $q,
        $rootScope,
        $scope,
        RVReservationSummarySrv;

    describe('Folio Generation', function () {
        beforeEach(function() {
            module('sntRover');

            inject(function(_$controller_, _$q_, _$rootScope_) {
                $controller = _$controller_;
                $scope = _$rootScope_.$new();
                $scope.groupConfigData = {};
                $scope.groupConfigData.summary = {};
                $scope.groupConfigData.summary.block_from = '';
                $scope.groupConfigData.summary.block_to = '';
            });

            angular.extend($scope, {
                'refreshScroll': function() {
                    return true;
                },
                'getMoveDatesActions': function() {
                    return {
                        "setToDefaultMode": function() {
                            return true;
                        }
                    };
                },
                'isInAddMode': function() {
                    return true;
                }
            });

            $controller('rvGroupConfigurationSummaryTab', {
                $scope: $scope
            });
        });

        it('set tax exempt type null on inactivating tax exempt', function() {
            $scope.groupConfigData.summary.is_tax_exempt = false;
            $scope.clickedTaxExemptToggle();

            expect($scope.groupConfigData.summary.tax_exempt_type_id).toBe('');
        });
    });

    describe('.computeSegment()', function() {
        var blockStartDate = '1970-01-01',
            blockEndDate = '1970-01-03',
            segments = [
                {value: 2, name: 'Long Stay' , los: 5},
                {value: 1, name: 'Short Stay', los: 3}
            ];

        beforeEach(function() {
            module('sntRover');

            inject(function(_$controller_, _RVReservationSummarySrv_, _$q_, _$rootScope_) {
                $controller = _$controller_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $scope = _$rootScope_.$new();
                $scope.groupConfigData = {};
                $scope.groupConfigData.summary = {};
                $scope.groupConfigData.summary.block_from = blockStartDate;
                $scope.groupConfigData.summary.block_to = blockEndDate;
                $scope.groupConfigData.summary.demographics = {};
                $scope.groupSummaryData = {};
                RVReservationSummarySrv = _RVReservationSummarySrv_;
            });

            angular.extend($scope, {
                'getMoveDatesActions': function() {
                    return {
                        "setToDefaultMode": function() {
                            return true;
                        }
                    };
                },
                'isInAddMode': function() {
                    return true;
                }
            });

            $controller('rvGroupConfigurationSummaryTab', {
                $scope: $scope
            });

            spyOn(RVReservationSummarySrv, 'fetchInitialData').and.callFake(function() {
                var deferred = $q.defer();

                deferred.resolve({
                    demographics: {
                        segments: segments
                    }
                });

                return deferred.promise;
            });
        });

        describe('when block period is less than a segment length of stay', function() {
            beforeEach(function() {
                $scope.computeSegment();
                $rootScope.$apply();
            });

            it('sets the demographics segment', function() {
                expect($scope.groupConfigData.summary.demographics.segment_id).toBe(1);
            });

            it('marks the demographics segment as computed', function() {
                expect($scope.groupSummaryData.isComputedSegment).toBe(true);
            });
        });

        describe('when block period exceeds segment lengths of stay', function() {
            beforeEach(function() {
                $scope.groupConfigData.summary.block_to = '1970-01-10';
                $scope.computeSegment();
                $rootScope.$apply();
            });

            it('does not set the demographics segment', function() {
                expect($scope.groupConfigData.summary.demographics.segment_id).toBeUndefined();
            });

            it('the demographics segment is not marked as computed', function() {
                expect($scope.groupSummaryData.isComputedSegment).toBe(false);
            });
        });

        describe('when segments do not have lengths of stay', function() {
            var currentSegment = {value: 2, name: 'Long Stay'};

            beforeEach(function() {
                segments = [{value: 1, name: 'Short Stay'}];
                $scope.groupConfigData.summary.demographics.segment_id = currentSegment.value;
                $scope.computeSegment();
                $rootScope.$apply();
            });

            it('does not overwrite an existing segment', function() {
                expect($scope.groupConfigData.summary.demographics.segment_id).toEqual(currentSegment.value);
            });

            it('the demographics segment is not marked as computed', function() {
                expect($scope.groupSummaryData.isComputedSegment).toBe(false);
            });
        });
    });
});
