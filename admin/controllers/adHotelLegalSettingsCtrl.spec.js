describe('adHotelLegalSettingsController', function() {

    var $controller,
        $scope = {};

    beforeEach(function() {
        module('admin');
        inject(function (_$controller_, _$rootScope_ ) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();            
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
