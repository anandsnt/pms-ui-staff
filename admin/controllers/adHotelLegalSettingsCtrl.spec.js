describe('adHotelLegalSettingsController', function() {

    var $controller,
        $scope = {},
        ADHotelDetailsSrv,
        $q;

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_, _ADHotelDetailsSrv_, _$q_ ) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            ADHotelDetailsSrv = _ADHotelDetailsSrv_;
            $q = _$q_;
        });       
        angular.extend($scope, {
            'setScroller': function() {
                return true;
            }
        });
        $scope.data = {};
        $scope.data.id = 81;
        $controller('adHotelLegalSettingsController', {
            $scope: $scope
        });
    });

    it('Clicked on financials tab', function() {
        
        $scope.clickedTabMenu('financials');
      
        expect($scope.activeTab).toBe('financials');
    });    
});
