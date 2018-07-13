describe('rvGroupConfigurationSummaryTab', function () {

    var $controller,
        $scope,
        $q,
        $rootScope,
        rvGroupSrv,
        RVGroupConfigurationSummaryTabController;

        describe('Folio Generation', function () {

            beforeEach(function () {
                module('sntRover');

                inject(function (_$controller_, _$q_, _$rootScope_, _rvGroupSrv_) {
                    $controller = _$controller_;
                    rvGroupSrv = _rvGroupSrv_;
                    $q = _$q_;
                    $rootScope = _$rootScope_;

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

                 RVGroupConfigurationSummaryTabController = $controller('rvGroupConfigurationSummaryTab', {
                    $scope: $scope
                });
            }); 

            it('set tax exempt type null on inactivating tax exempt', function() {
                
                $scope.groupConfigData.summary.is_tax_exempt = false;
                $scope.clickedTaxExemptToggle();

                expect($scope.groupConfigData.summary.tax_exempt_type_id).toBe('');

            });

        });    
});