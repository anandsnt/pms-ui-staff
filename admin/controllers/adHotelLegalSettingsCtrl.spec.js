describe('adHotelLegalSettingsController', function() {

    var $controller,
        $scope = {},
        ADHotelDetailsSrv,
        $q;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADHotelDetailsSrv_, _$q_ ) {
            $controller = _$controller_;
            ADHotelDetailsSrv = _ADHotelDetailsSrv_;
            $q = _$q_;
            $scope = _$rootScope_.$new();
        });
        
        angular.extend($scope, {
            'setScroller': function() {
                return true;
            }
        });

        $controller('adHotelLegalSettingsController', {
            $scope: $scope
        });
    });

    it('Clicked on financials tab', function() {
        
        $scope.clickedTabMenu('financials');
      
        expect($scope.activeTab).toBe('financials');
    });
    
});
