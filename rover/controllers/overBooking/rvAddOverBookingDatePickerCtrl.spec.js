describe('rvAddOverBookingDatePickerCtrl', function() {

    var $controller,
        $scope = {},
        that;

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
        });

        angular.extend($scope, {
            addOverBookingObj: {
                type: 'FROM',
                fromDate: '2018-05-01',
                toDate: '2018-05-05'
            }
        });

        that = $controller('rvAddOverBookingDatePickerCtrl', {
            $scope: $scope
        });
    });

    it('On selecting FROM date', function() {
        $scope.addOverBookingObj.type = 'FROM';
        that.init();
        that.setUpData();
        expect($scope.date).toBe($scope.addOverBookingObj.fromDate);
    });

    it('On selecting TO date', function() {
        $scope.addOverBookingObj.type = 'TO';
        that.init();
        that.setUpData();
        expect($scope.date).toBe($scope.addOverBookingObj.toDate);
    });
});