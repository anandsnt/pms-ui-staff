describe('RvOverBookingHeaderCtrl', function() {

    var $controller,
        $scope = {},
        $rootScope = {},
        $q,
        that,
        rvOverBookingSrv;

    jasmine.getJSONFixtures().fixturesPath = 'base/unitTestSampleData/';
    var fixtures = loadJSONFixtures('overbookingSampleData.json'),
        jsonResultData = fixtures['overbookingSampleData.json'];

    beforeEach(function() {
        module('sntRover');
        inject(function (_$controller_, _rvOverBookingSrv_, _$rootScope_, _$q_) {
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_.$new();
            $q = _$q_,
            rvOverBookingSrv = _rvOverBookingSrv_;
        });

        angular.extend($scope, {
            overBookingObj: jsonResultData,
            addOverBookingObj: {
                fromDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
                toDate: moment(tzIndependentDate($rootScope.businessDate)).format($rootScope.momentFormatForAPI),
                weekDayList: [
                    { name: 'MON', id: 1, isChecked: true },
                    { name: 'TUE', id: 2, isChecked: true },
                    { name: 'WED', id: 3, isChecked: true },
                    { name: 'THU', id: 4, isChecked: true },
                    { name: 'FRI', id: 5, isChecked: true },
                    { name: 'SAT', id: 6, isChecked: true },
                    { name: 'SUN', id: 0, isChecked: true }
                ],
                applyForHouse: true,
                applyForRoomTypes: false,
                isShowRoomsLeftToSell: false,
                limitType: 'RMS',
                completeRoomTypeListData: jsonResultData.completeRoomTypeListData,
                roomTypeList: [],
                limitValue: ''
            },
            setScroller: function() {
                return true;
            },
            refreshScroller: function() {
                return true;
            }
        });

        that = $controller('RvOverBookingHeaderCtrl', {
            $scope: $scope
        });

    });

    it('On clicked clickedShowRoomsLeftTosell', function() {
        var isCheckedBefore = $scope.overBookingObj.isShowRoomsLeftToSell,
            isCheckedAfter = '';

        $scope.clickedShowRoomsLeftTosell();
        setTimeout(function() {
            isCheckedAfter = $scope.overBookingObj.isShowRoomsLeftToSell;
            expect(isCheckedBefore).toBe(!isCheckedAfter);
        }, 500);
    });

    it('On clicked clickedPrevDateButton', function() {
        $scope.overBookingObj.startDate = '2017-12-22';

        $scope.clickedPrevDateButton();
        console.log($scope.overBookingObj.startDate);
        console.log($scope.overBookingObj.endDate);

        expect($scope.overBookingObj.startDate).toBe($scope.overBookingObj.endDate);
    });

});